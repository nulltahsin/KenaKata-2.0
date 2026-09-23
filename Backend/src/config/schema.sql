

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,

    CHECK (role IN ('CUSTOMER', 'VENDOR', 'ADMIN'))
);


CREATE TABLE customers (
    user_id INTEGER PRIMARY KEY,
    delivery_address TEXT,

    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);


CREATE TABLE vendors (
    user_id INTEGER PRIMARY KEY,
    business_name VARCHAR(150) NOT NULL,

    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);




CREATE TABLE markets (
    market_id SERIAL PRIMARY KEY,
    market_name VARCHAR(150) NOT NULL,
    location VARCHAR(255) NOT NULL
);


CREATE TABLE stores (
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



CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE
);


CREATE TABLE products (
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




CREATE TABLE payments (
    pay_id SERIAL PRIMARY KEY,
    method VARCHAR(30) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    transaction_id VARCHAR(100) UNIQUE,

    CHECK (method IN ('bKash', 'Cash', 'Card')),
    CHECK (amount >= 0)
);




CREATE TABLE reservations (
    reservation_id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    store_id INTEGER NOT NULL,
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



CREATE TABLE orders (
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


CREATE TABLE order_items (
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




CREATE TABLE wishlists (
    wishlist_id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,

    FOREIGN KEY (customer_id)
        REFERENCES customers(user_id)
        ON DELETE CASCADE,

    FOREIGN KEY (product_id)
        REFERENCES products(product_id)
        ON DELETE CASCADE,

    UNIQUE (customer_id, product_id)
);




CREATE TABLE reviews (
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