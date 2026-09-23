const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const withTransaction = require("../config/transaction");

router.post("/", async (req, res) => {
  try {
    const { market_name, location } = req.body;
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
