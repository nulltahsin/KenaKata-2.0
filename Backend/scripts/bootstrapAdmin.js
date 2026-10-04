const path = require("node:path");
const fs = require("node:fs");
const readline = require("node:readline");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

const envFile = path.resolve(__dirname, "../../.env.local");
if (!fs.existsSync(envFile)) {
  throw new Error(".env.local is missing. Pull the production Neon variables into it first.");
}
const config = dotenv.parse(fs.readFileSync(envFile));
const databaseUrl = config.DATABASE_URL_UNPOOLED;
const branch = config.NEON_BRANCH;

if (branch !== "production") {
  throw new Error("Refusing to create an admin: .env.local must target NEON_BRANCH=production.");
}
if (!databaseUrl) {
  throw new Error("DATABASE_URL_UNPOOLED is missing from .env.local.");
}

const database = new URL(databaseUrl);
if (!database.hostname.endsWith(".neon.tech")) {
  throw new Error("Refusing to create an admin: the direct URL is not a Neon database URL.");
}

const pool = new Pool({ connectionString: databaseUrl });

function ask(question) {
  const terminal = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    terminal.question(question, (answer) => {
      terminal.close();
      resolve(answer.trim());
    });
  });
}

function askHidden(question) {
  if (!process.stdin.isTTY || typeof process.stdin.setRawMode !== "function") {
    throw new Error("Run this command in an interactive terminal so the password can stay hidden.");
  }

  return new Promise((resolve, reject) => {
    const wasRaw = process.stdin.isRaw;
    let value = "";
    process.stdout.write(question);
    process.stdin.setRawMode(true);
    process.stdin.resume();

    const finish = (error) => {
      process.stdin.removeListener("data", onData);
      process.stdin.setRawMode(wasRaw);
      process.stdout.write("\n");
      if (error) reject(error);
      else resolve(value);
    };

    const onData = (chunk) => {
      for (const character of chunk.toString("utf8")) {
        if (character === "\u0003") {
          finish(new Error("Admin setup cancelled."));
          return;
        }
        if (character === "\r" || character === "\n") {
          finish();
          return;
        }
        if (character === "\u0008" || character === "\u007f") {
          value = value.slice(0, -1);
        } else if (character >= " ") {
          value += character;
        }
      }
    };

    process.stdin.on("data", onData);
  });
}

async function main() {
  const client = await pool.connect();
  try {
    const target = await client.query("SELECT current_database() AS database_name");
    const admins = await client.query("SELECT count(*)::int AS count FROM users WHERE role = 'ADMIN'");
    console.log(`Target: Neon production database “${target.rows[0].database_name}”.`);

    if (admins.rows[0].count > 0) {
      throw new Error("An admin account already exists. This bootstrap script only creates the first one.");
    }

    const name = await ask("Admin full name: ");
    const email = (await ask("Admin email: ")).toLowerCase();
    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Enter a name and a valid email address.");
    }

    const password = await askHidden("Admin password (minimum 6 characters; longer is safer; input hidden): ");
    const confirmation = await askHidden("Confirm password: ");
    if (password.length < 6 || password !== confirmation) {
      throw new Error("Passwords must match and contain at least 6 characters.");
    }

    const approval = await ask('Type "CREATE FIRST ADMIN" to confirm: ');
    if (approval !== "CREATE FIRST ADMIN") {
      throw new Error("Admin creation cancelled.");
    }

    await client.query("BEGIN");
    await client.query("SELECT pg_advisory_xact_lock(hashtext('kenakata:first-admin'))");
    const adminCheck = await client.query("SELECT count(*)::int AS count FROM users WHERE role = 'ADMIN'");
    if (adminCheck.rows[0].count > 0) {
      throw new Error("An admin was created by another session. No account was added.");
    }

    const existing = await client.query("SELECT 1 FROM users WHERE lower(email) = $1", [email]);
    if (existing.rowCount > 0) {
      throw new Error("That email already belongs to an account. No role was changed.");
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await client.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, 'ADMIN')`,
      [name, email, passwordHash]
    );
    await client.query("COMMIT");
    console.log(`Admin account created for ${email}. Sign in through the website.`);
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
