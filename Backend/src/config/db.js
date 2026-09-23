const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function initializeCustomerTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS product_holds (
      hold_id SERIAL PRIMARY KEY,
      customer_id INTEGER,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      status VARCHAR(20) NOT NULL DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      expires_at TIMESTAMP NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL '15 minutes'),
      UNIQUE(customer_id, product_id, status)
    );

    CREATE TABLE IF NOT EXISTS wishlists (
      wishlist_id SERIAL PRIMARY KEY,
      customer_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(customer_id, product_id)
    );

    CREATE TABLE IF NOT EXISTS reservations (
      reservation_id SERIAL PRIMARY KEY,
      customer_id INTEGER NOT NULL,
      product_id INTEGER,
      store_id INTEGER,
      payment_id INTEGER,
      status VARCHAR(20) NOT NULL DEFAULT 'Pending',
      deadline TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      quantity INTEGER NOT NULL DEFAULT 1,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      expires_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP + INTERVAL '48 hours'
    );

    ALTER TABLE reservations ALTER COLUMN product_id DROP NOT NULL;
    ALTER TABLE reservations ALTER COLUMN store_id DROP NOT NULL;
    ALTER TABLE reservations ADD COLUMN IF NOT EXISTS quantity INTEGER NOT NULL DEFAULT 1;
    ALTER TABLE reservations ADD COLUMN IF NOT EXISTS created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
    ALTER TABLE reservations ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP + INTERVAL '48 hours';
    UPDATE reservations SET created_at = COALESCE(created_at, deadline, CURRENT_TIMESTAMP), expires_at = COALESCE(expires_at, deadline, CURRENT_TIMESTAMP) WHERE created_at IS NULL OR expires_at IS NULL;
    ALTER TABLE reservations DROP CONSTRAINT IF EXISTS reservations_status_check;
    ALTER TABLE reservations ADD CONSTRAINT reservations_status_check CHECK (status IN ('Pending', 'Completed', 'Cancelled', 'Expired', 'Collected'));
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'reservations_quantity_check'
      ) THEN
        ALTER TABLE reservations ADD CONSTRAINT reservations_quantity_check CHECK (quantity > 0);
      END IF;
    END $$;
  `);
}

module.exports = pool;
module.exports.initializeCustomerTables = initializeCustomerTables;