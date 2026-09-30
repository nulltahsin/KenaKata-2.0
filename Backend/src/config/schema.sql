CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,

    CHECK (role IN ('CUSTOMER', 'VENDOR', 'ADMIN'))
);




CREATE TABLE IF NOT EXISTS customers (
    user_id INTEGER PRIMARY KEY,
    delivery_address TEXT,

    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);




CREATE TABLE IF NOT EXISTS vendors (
    user_id INTEGER PRIMARY KEY,
    business_name VARCHAR(150) NOT NULL,

    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);




CREATE TABLE IF NOT EXISTS markets (
    market_id SERIAL PRIMARY KEY,
    market_name VARCHAR(150) NOT NULL,
    location VARCHAR(255) NOT NULL
);



CREATE TABLE IF NOT EXISTS stores (
    store_id SERIAL PRIMARY KEY,
    vendor_id INTEGER NOT NULL,
    market_id INTEGER NOT NULL,
    store_name VARCHAR(150) NOT NULL,
    address TEXT NOT NULL,
    description TEXT,
    logo_url TEXT,
    category VARCHAR(100),

    FOREIGN KEY (vendor_id)
        REFERENCES vendors(user_id)
        ON DELETE CASCADE,

    FOREIGN KEY (market_id)
        REFERENCES markets(market_id)
        ON DELETE CASCADE
);





CREATE TABLE IF NOT EXISTS categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE
);




CREATE TABLE IF NOT EXISTS products (
    product_id SERIAL PRIMARY KEY,
    store_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    category_names TEXT[],
    name VARCHAR(150) NOT NULL,
    description TEXT,
    image_url TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock_qty INTEGER NOT NULL DEFAULT 0,

    FOREIGN KEY (store_id)
        REFERENCES stores(store_id)
        ON DELETE CASCADE,

    FOREIGN KEY (category_id)
        REFERENCES categories(category_id)
        ON DELETE RESTRICT,

    CHECK (price >= 0),
    CHECK (stock_qty >= 0)
);




CREATE TABLE IF NOT EXISTS payments (
    pay_id SERIAL PRIMARY KEY,
    method VARCHAR(30) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    transaction_id VARCHAR(100) UNIQUE,

    CHECK (method IN ('bKash', 'Cash', 'Card')),
    CHECK (amount >= 0)
);




CREATE TABLE IF NOT EXISTS reservations (
    reservation_id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL,


    product_id INTEGER,
    store_id INTEGER,

    payment_id INTEGER,
    status VARCHAR(20) NOT NULL DEFAULT 'Pending',
    deadline TIMESTAMP NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,

    FOREIGN KEY (customer_id)
        REFERENCES customers(user_id)
        ON DELETE CASCADE,

    FOREIGN KEY (product_id)
        REFERENCES products(product_id)
        ON DELETE CASCADE,

    FOREIGN KEY (store_id)
        REFERENCES stores(store_id)
        ON DELETE CASCADE,

    FOREIGN KEY (payment_id)
        REFERENCES payments(pay_id)
        ON DELETE SET NULL,

    CHECK (
        status IN (
            'Pending',
            'Completed',
            'Collected',
            'Cancelled',
            'Expired'
        )
    ),

    CHECK (quantity > 0)
);




CREATE TABLE IF NOT EXISTS orders (
    order_id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL,
    payment_id INTEGER,
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'Pending',

    FOREIGN KEY (customer_id)
        REFERENCES customers(user_id)
        ON DELETE CASCADE,

    FOREIGN KEY (payment_id)
        REFERENCES payments(pay_id)
        ON DELETE SET NULL,

    CHECK (total_amount >= 0),

    CHECK (
        status IN (
            'Pending',
            'Confirmed',
            'Shipped',
            'Delivered',
            'Cancelled'
        )
    )
);




CREATE TABLE IF NOT EXISTS order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price_at_purchase DECIMAL(10,2) NOT NULL,

    FOREIGN KEY (order_id)
        REFERENCES orders(order_id)
        ON DELETE CASCADE,

    FOREIGN KEY (product_id)
        REFERENCES products(product_id)
        ON DELETE RESTRICT,

    CHECK (quantity > 0),
    CHECK (price_at_purchase >= 0)
);



CREATE TABLE IF NOT EXISTS product_holds (
    hold_id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,

    FOREIGN KEY (customer_id)
        REFERENCES customers(user_id)
        ON DELETE CASCADE,

    FOREIGN KEY (product_id)
        REFERENCES products(product_id)
        ON DELETE CASCADE,

    CHECK (quantity > 0),

    CHECK (
        status IN (
            'active',
            'completed',
            'cancelled',
            'expired'
        )
    ),

    UNIQUE (customer_id, product_id, status)
);




CREATE TABLE IF NOT EXISTS wishlist (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    FOREIGN KEY (product_id)
        REFERENCES products(product_id)
        ON DELETE CASCADE,

    UNIQUE (user_id, product_id)
);




CREATE TABLE IF NOT EXISTS reviews (
    review_id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    order_item_id INTEGER NOT NULL,
    rating INTEGER NOT NULL,
    comment TEXT,

    FOREIGN KEY (customer_id)
        REFERENCES customers(user_id)
        ON DELETE CASCADE,

    FOREIGN KEY (product_id)
        REFERENCES products(product_id)
        ON DELETE CASCADE,

    FOREIGN KEY (order_item_id)
        REFERENCES order_items(order_item_id)
        ON DELETE CASCADE,

    CHECK (rating BETWEEN 1 AND 5),

    UNIQUE (order_item_id)
);




CREATE TABLE IF NOT EXISTS reservation_status_logs (
    reservation_status_log_id SERIAL PRIMARY KEY,
    reservation_id INTEGER NOT NULL,
    customer_id INTEGER,
    vendor_id INTEGER,
    old_status VARCHAR(20) NOT NULL,
    new_status VARCHAR(20) NOT NULL,
    changed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (reservation_id)
        REFERENCES reservations(reservation_id)
        ON DELETE CASCADE,

    FOREIGN KEY (customer_id)
        REFERENCES customers(user_id)
        ON DELETE SET NULL,

    FOREIGN KEY (vendor_id)
        REFERENCES vendors(user_id)
        ON DELETE SET NULL
);




CREATE TABLE IF NOT EXISTS order_status_logs (
    order_status_log_id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL,
    old_status VARCHAR(20) NOT NULL,
    new_status VARCHAR(20) NOT NULL,
    changed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (order_id)
        REFERENCES orders(order_id)
        ON DELETE CASCADE
);




CREATE OR REPLACE FUNCTION log_reservation_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    reservation_vendor_id INTEGER;
BEGIN

    IF NEW.store_id IS NOT NULL THEN

        SELECT vendor_id
        INTO reservation_vendor_id
        FROM stores
        WHERE store_id = NEW.store_id;

    ELSE

        reservation_vendor_id := NULL;

    END IF;


    INSERT INTO reservation_status_logs
        (
            reservation_id,
            customer_id,
            vendor_id,
            old_status,
            new_status
        )
    VALUES
        (
            NEW.reservation_id,
            NEW.customer_id,
            reservation_vendor_id,
            OLD.status,
            NEW.status
        );

    RETURN NEW;

END;
$$;



DROP TRIGGER IF EXISTS reservation_status_history_trigger
ON reservations;

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
        RAISE EXCEPTION
            'Product stock_qty cannot be negative or NULL';
    END IF;

    RETURN NEW;

END;
$$;



DROP TRIGGER IF EXISTS product_stock_validation_trigger
ON products;

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
        (
            order_id,
            old_status,
            new_status
        )
    VALUES
        (
            NEW.order_id,
            OLD.status,
            NEW.status
        );

    RETURN NEW;

END;
$$;



DROP TRIGGER IF EXISTS order_status_history_trigger
ON orders;

CREATE TRIGGER order_status_history_trigger
AFTER UPDATE OF status ON orders
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM NEW.status)
EXECUTE FUNCTION log_order_status_change();




CREATE OR REPLACE FUNCTION get_admin_sales_summary()
RETURNS TABLE (
    total_sales NUMERIC,
    total_orders INTEGER,
    average_order_value NUMERIC
)
LANGUAGE SQL
STABLE
AS $$
    SELECT
        COALESCE(SUM(o.total_amount), 0)::numeric
            AS total_sales,

        COUNT(o.order_id)::integer
            AS total_orders,

        COALESCE(AVG(o.total_amount), 0)::numeric
            AS average_order_value

    FROM orders o

    WHERE o.status <> 'Cancelled';
$$;




CREATE OR REPLACE FUNCTION get_customer_order_total(
    p_customer_id INTEGER
)
RETURNS NUMERIC
LANGUAGE SQL
STABLE
AS $$
    SELECT
        COALESCE(SUM(o.total_amount), 0)::numeric

    FROM orders o

    WHERE o.customer_id = p_customer_id
      AND o.status <> 'Cancelled';
$$;




CREATE OR REPLACE PROCEDURE cancel_order_and_restore_stock(
    p_order_id INTEGER
)
LANGUAGE plpgsql
AS $$
DECLARE
    current_status VARCHAR(20);
BEGIN

    -- Lock the order
    SELECT status
    INTO current_status
    FROM orders
    WHERE order_id = p_order_id
    FOR UPDATE;


    -- Order does not exist
    IF NOT FOUND THEN
        RAISE EXCEPTION
            'Order % does not exist',
            p_order_id;
    END IF;


    -- Already cancelled
    IF current_status = 'Cancelled' THEN
        RAISE EXCEPTION
            'Order % is already cancelled',
            p_order_id;
    END IF;


    -- Only Pending or Confirmed orders can be cancelled
    IF current_status NOT IN ('Pending', 'Confirmed') THEN
        RAISE EXCEPTION
            'Order % cannot be cancelled because its current status is %',
            p_order_id,
            current_status;
    END IF;


    -- Restore stock.
    -- SUM() handles multiple order_items
    -- for the same product correctly.
    UPDATE products p
    SET stock_qty =
        p.stock_qty + stock_restore.total_quantity

    FROM (
        SELECT
            product_id,
            SUM(quantity) AS total_quantity
        FROM order_items
        WHERE order_id = p_order_id
        GROUP BY product_id
    ) AS stock_restore

    WHERE p.product_id = stock_restore.product_id;


    -- Finally cancel the order
    UPDATE orders
    SET status = 'Cancelled'
    WHERE order_id = p_order_id;

END;
$$;