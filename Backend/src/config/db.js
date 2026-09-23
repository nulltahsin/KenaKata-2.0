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
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await client.query(`
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

    CREATE TABLE IF NOT EXISTS reservation_status_logs (
      reservation_status_log_id SERIAL PRIMARY KEY,
      reservation_id INTEGER NOT NULL,
      customer_id INTEGER,
      vendor_id INTEGER,
      old_status VARCHAR(20) NOT NULL,
      new_status VARCHAR(20) NOT NULL,
      changed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (reservation_id) REFERENCES reservations(reservation_id) ON DELETE CASCADE,
      FOREIGN KEY (customer_id) REFERENCES customers(user_id) ON DELETE SET NULL,
      FOREIGN KEY (vendor_id) REFERENCES vendors(user_id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS order_status_logs (
      order_status_log_id SERIAL PRIMARY KEY,
      order_id INTEGER NOT NULL,
      old_status VARCHAR(20) NOT NULL,
      new_status VARCHAR(20) NOT NULL,
      changed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
    );

    CREATE OR REPLACE FUNCTION log_reservation_status_change()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    AS $$
    DECLARE
      reservation_vendor_id INTEGER;
    BEGIN
      SELECT vendor_id
      INTO reservation_vendor_id
      FROM stores
      WHERE store_id = NEW.store_id;

      INSERT INTO reservation_status_logs
        (reservation_id, customer_id, vendor_id, old_status, new_status)
      VALUES
        (NEW.reservation_id, NEW.customer_id, reservation_vendor_id, OLD.status, NEW.status);

      RETURN NEW;
    END;
    $$;

    DROP TRIGGER IF EXISTS reservation_status_history_trigger ON reservations;
    CREATE TRIGGER reservation_status_history_trigger
    AFTER UPDATE OF status ON reservations
    FOR EACH ROW
    WHEN (OLD.status IS DISTINCT FROM NEW.status)
    EXECUTE FUNCTION log_reservation_status_change();

    CREATE OR REPLACE FUNCTION validate_product_stock()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    AS $$
    BEGIN
      IF NEW.stock_qty IS NULL OR NEW.stock_qty < 0 THEN
        RAISE EXCEPTION 'Product stock_qty cannot be negative or NULL';
      END IF;

      RETURN NEW;
    END;
    $$;

    DROP TRIGGER IF EXISTS product_stock_validation_trigger ON products;
    CREATE TRIGGER product_stock_validation_trigger
    BEFORE INSERT OR UPDATE OF stock_qty ON products
    FOR EACH ROW
    EXECUTE FUNCTION validate_product_stock();

    CREATE OR REPLACE FUNCTION log_order_status_change()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    AS $$
    BEGIN
      INSERT INTO order_status_logs
        (order_id, old_status, new_status)
      VALUES
        (NEW.order_id, OLD.status, NEW.status);

      RETURN NEW;
    END;
    $$;

    DROP TRIGGER IF EXISTS order_status_history_trigger ON orders;
    CREATE TRIGGER order_status_history_trigger
    AFTER UPDATE OF status ON orders
    FOR EACH ROW
    WHEN (OLD.status IS DISTINCT FROM NEW.status)
    EXECUTE FUNCTION log_order_status_change();
    `);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

module.exports = pool;
module.exports.initializeCustomerTables = initializeCustomerTables;