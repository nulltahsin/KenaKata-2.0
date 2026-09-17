const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const verifyToken = require("../middleware/authMiddleware");
const checkRole = require("../middleware/roleMiddleware");

async function releaseExpiredHolds(client) {
  await client.query(
    `UPDATE product_holds
     SET status = 'expired'
     WHERE status = 'active'
       AND expires_at <= NOW()`
  );
}

async function getProductReservedQty(client, productId) {
  const result = await client.query(
    `SELECT COALESCE(SUM(quantity), 0)::int AS reserved_qty
     FROM product_holds
     WHERE product_id = $1
       AND status = 'active'
       AND expires_at > NOW()`,
    [productId]
  );

  return Number(result.rows[0].reserved_qty || 0);
}

const HOLD_MINUTES = 60;

router.get("/", verifyToken, checkRole("CUSTOMER"), async (req, res) => {
  try {
    const client = await pool.connect();
    try {
      await releaseExpiredHolds(client);

      const result = await client.query(
        `SELECT h.hold_id, h.product_id, h.quantity, h.expires_at,
                p.name, p.price, p.image_url, p.stock_qty,
                s.store_name
         FROM product_holds h
         JOIN products p ON p.product_id = h.product_id
         JOIN stores s ON s.store_id = p.store_id
         WHERE h.customer_id = $1 AND h.status = 'active'
         ORDER BY h.expires_at ASC`,
        [req.user.user_id]
      );

      res.json(result.rows.map((row) => ({
        id: row.product_id,
        product_id: row.product_id,
        hold_id: row.hold_id,
        name: row.name,
        price: Number(row.price),
        image: row.image_url,
        store: row.store_name,
        quantity: Number(row.quantity),
        expires_at: row.expires_at,
        stock_qty: Number(row.stock_qty)
      })));
    } finally {
      client.release();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.post("/add", verifyToken, checkRole("CUSTOMER"), async (req, res) => {
  const { product_id, quantity = 1 } = req.body;

  if (!product_id || Number(quantity) <= 0) {
    return res.status(400).json({ message: "Valid product_id and quantity are required" });
  }

  const customer_id = req.user.user_id;
  const itemQty = Number(quantity);

  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await releaseExpiredHolds(client);

    const productResult = await client.query(
      `SELECT product_id, stock_qty
       FROM products
       WHERE product_id = $1
       FOR UPDATE`,
      [product_id]
    );

    if (productResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Product not found" });
    }

    const product = productResult.rows[0];
    const reservedQty = await getProductReservedQty(client, product_id);
    const availableQty = Number(product.stock_qty) - reservedQty;

    if (availableQty < itemQty) {
      await client.query("ROLLBACK");
      return res.status(409).json({
        message: `Only ${availableQty} item(s) available for this product right now.`
      });
    }

    const existingHold = await client.query(
      `SELECT hold_id, quantity
       FROM product_holds
       WHERE customer_id = $1
         AND product_id = $2
         AND status = 'active'
         AND expires_at > NOW()
       FOR UPDATE`,
      [customer_id, product_id]
    );

    let hold;

    if (existingHold.rows.length > 0) {
      const currentQty = Number(existingHold.rows[0].quantity);
      const nextQty = currentQty + itemQty;

      const nextAvailableAfterThisAdd = Number(product.stock_qty) - reservedQty + currentQty - nextQty;
      if (nextAvailableAfterThisAdd < 0) {
        await client.query("ROLLBACK");
        return res.status(409).json({ message: "Not enough stock remaining for this product." });
      }

      hold = await client.query(
        `UPDATE product_holds
         SET quantity = $1,
             expires_at = NOW() + INTERVAL '${HOLD_MINUTES} minutes'
         WHERE hold_id = $2
         RETURNING *`,
        [nextQty, existingHold.rows[0].hold_id]
      );
    } else {
      hold = await client.query(
        `INSERT INTO product_holds (customer_id, product_id, quantity, expires_at, status)
         VALUES ($1, $2, $3, NOW() + INTERVAL '${HOLD_MINUTES} minutes', 'active')
         RETURNING *`,
        [customer_id, product_id, itemQty]
      );
    }

    await client.query("COMMIT");

    res.status(201).json({
      message: "Product reserved in cart for 1 hour.",
      hold: hold.rows[0]
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    res.status(500).json({ message: error.message });
  } finally {
    client.release();
  }
});

router.delete("/remove/:product_id", verifyToken, checkRole("CUSTOMER"), async (req, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM product_holds
       WHERE customer_id = $1
         AND product_id = $2
         AND status = 'active'
       RETURNING *`,
      [req.user.user_id, req.params.product_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.json({ message: "Item removed from cart", deleted: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.delete("/clear", verifyToken, checkRole("CUSTOMER"), async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE product_holds
       SET status = 'expired'
       WHERE customer_id = $1 AND status = 'active'
       RETURNING *`,
      [req.user.user_id]
    );

    res.json({ message: "Cart cleared", cleared: result.rowCount || 0 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.post("/release-expired", async (req, res) => {
  try {
    const client = await pool.connect();
    try {
      await releaseExpiredHolds(client);
      res.json({ message: "Expired cart holds released" });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
