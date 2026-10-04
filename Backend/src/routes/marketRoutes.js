const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const withTransaction = require("../config/transaction");
const verifyToken = require("../middleware/authMiddleware");
const checkRole = require("../middleware/roleMiddleware");

router.post("/", verifyToken, checkRole("ADMIN"), async (req, res) => {
  try {
    const market_name = String(req.body.market_name || "").trim();
    const location = String(req.body.location || "").trim();
    if (!market_name || !location) {
      return res.status(400).json({ message: "Market name and location are required" });
    }
    if (market_name.length > 150 || location.length > 255) {
      return res.status(400).json({ message: "Market name or location is too long" });
    }

    const result = await withTransaction(pool, (client) => client.query(
      `INSERT INTO markets (market_name, location)
       VALUES ($1, $2)
       RETURNING *`,
      [market_name, location]
    ));
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create market" });
  }
});

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM markets ORDER BY market_id");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch markets" });
  }
});

module.exports = router;
