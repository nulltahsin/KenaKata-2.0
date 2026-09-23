const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const withTransaction = require("../config/transaction");

router.post("/", async (req, res) => {
  try {
    const { category_name } = req.body;
    const result = await withTransaction(pool, (client) => client.query(
      `
      INSERT INTO categories
      (
          category_name
      )
      VALUES($1)
      RETURNING *
      `,
      [category_name]
    ));
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    let result;
    result = await pool.query(
      `
      SELECT *
      FROM categories
      ORDER BY category_id
      `
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const category_id = req.params.id;
    const { category_name } = req.body;
    const result = await withTransaction(pool, (client) => client.query(
      `
      UPDATE categories
      SET
    category_name=$1
      WHERE category_id=$2
      RETURNING *
      `,
      [category_name, category_id]
    ));
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json({
      message: "Category updated successfully",
      category: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    if (error.code === "23505") {
      return res.status(400).json({ message: "Category name already exists" });
    }
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
