const express = require("express");

const router = express.Router();

const pool = require("../config/db");

const verifyToken = require("../middleware/authMiddleware");

const checkRole = require("../middleware/roleMiddleware");
const withTransaction = require("../config/transaction");


router.post("/",

    verifyToken,

checkRole("VENDOR"),

 async (req, res) => {

  try {

    const { market_id, store_name, address, description, logo_url, category, categories } = req.body;
    const categoryTags = [...new Set(
      (Array.isArray(categories) ? categories : String(category || '').split(','))
        .map((tag) => String(tag).trim())
        .filter(Boolean)
    )];

    const vendor_id = req.user.user_id;  //logged in vendor er id, onno vendor er jonno store create korte parbe na


    const result = await withTransaction(pool, (client) => client.query(

      `

      INSERT INTO stores

      (

          vendor_id,

          market_id,

          store_name,

          address,
          description,
          logo_url,
          category

      )

      VALUES($1,$2,$3,$4,$5,$6,$7)

      RETURNING *

      `,

      [vendor_id, market_id, store_name, address, description, logo_url, categoryTags.join(', ')]

    ));

    res.status(201).json(result.rows[0]);

  } 

  catch (error) {

    console.error(error);

    res.status(500).json({ message: error.message });

  }

});





router.get("/", async (req, res) => {

  try {

    const { market_id } = req.query;

    const result = market_id
      ? await pool.query(
          `SELECT * FROM stores WHERE market_id = $1 ORDER BY store_id`,
          [market_id]
        )
      : await pool.query(`SELECT * FROM stores ORDER BY store_id`);

    res.json(result.rows);

  } 

  catch (error) {

    console.error(error);

    res.status(500).json({ message: "Failed to fetch stores" });

  }

});

router.get("/vendor/me", verifyToken, checkRole("VENDOR"), async (req, res) => {
  try {
    let result = await pool.query(
      `SELECT s.*, m.market_name
       FROM stores s
       LEFT JOIN markets m ON s.market_id = m.market_id
       WHERE s.vendor_id=$1
       ORDER BY s.store_id
       LIMIT 1`,
      [req.user.user_id]
    );

    if (result.rows.length === 0) {
      result = await withTransaction(pool, (client) => client.query(
        `INSERT INTO stores
           (vendor_id, market_id, store_name, address, description, logo_url, category)
         SELECT v.user_id, m.market_id, v.business_name, 'Not provided', '', '', ''
         FROM vendors v
         CROSS JOIN LATERAL (
           SELECT market_id
           FROM markets
           ORDER BY market_id
           LIMIT 1
         ) m
         WHERE v.user_id=$1
         RETURNING *`,
        [req.user.user_id]
      ));

      if (result.rows.length > 0) {
        const store = await pool.query(
          `SELECT s.*, m.market_name
           FROM stores s
           LEFT JOIN markets m ON s.market_id = m.market_id
           WHERE s.store_id=$1`,
          [result.rows[0].store_id]
        );
        result = store;
      }
    }

    res.json(result.rows[0] || null);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});





router.get("/:id", async (req, res) => {

  try {

    const store_id = req.params.id;

    const result = await pool.query(

      `

      SELECT

            s.store_id,

            s.vendor_id,

            s.store_name,

          s.address,

          u.name AS vendor_name

      FROM stores s

      JOIN vendors v

      ON s.vendor_id = v.user_id

      JOIN users u

      ON v.user_id = u.user_id

      WHERE s.store_id=$1

      `,

      [store_id]

    );

    if (result.rows.length === 0) {

      return res.status(404).json({ message: "Store not found" });

    }

    res.json(result.rows[0]);

  } 

  catch (error) {

    console.error(error);

    res.status(500).json({ message: error.message });

  }

});





router.patch("/:id",

    verifyToken,

checkRole("VENDOR"),

    async (req, res) => {

  try {

    const store_id = req.params.id;

    const { store_name, address, description, logo_url, category, categories, market_id } = req.body;
    const categoryTags = [...new Set(
      (Array.isArray(categories) ? categories : String(category || '').split(','))
        .map((tag) => String(tag).trim())
        .filter(Boolean)
    )];

    const vendor_id = req.user.user_id;  //logged in vendor er id


    const result = await withTransaction(pool, (client) => client.query(

      `

      UPDATE stores

      SET

          store_name=$1,

          address=$2,

          description=$3,

          logo_url=$4,

          category=$5,

          market_id=$6

      WHERE store_id=$7

      AND vendor_id=$8

      RETURNING *

      `,

      [

        store_name,

        address,

        description,

        logo_url,

        categoryTags.join(', '),

        market_id,

        store_id,

        vendor_id

      ]

    ));


    if (result.rows.length === 0) {

      return res.status(403).json({

        message:"You cannot update this store"

      });

    }


    res.json({

      message: "Store updated successfully",

      store: result.rows[0],

    });

  } 

  catch (error) {

    console.error(error);

    res.status(500).json({ message: error.message });

  }

});







router.delete("/:id", 

    verifyToken,

checkRole("VENDOR"),

    async (req, res) => {

  try {

    const store_id = req.params.id;

    const vendor_id = req.user.user_id;  //logged in vendor er id



    const products = await pool.query(

      `

      SELECT product_id

      FROM products

      WHERE store_id=$1

      `,

      [store_id]
    );


    if (products.rows.length > 0) {

      return res.status(400).json({

        message: "Cannot delete store because products exist under this store",

      });

    }




    const result = await withTransaction(pool, (client) => client.query(
      `
      DELETE FROM stores
      WHERE store_id=$1
      AND vendor_id=$2
      RETURNING *
      `,
      [store_id, vendor_id]
    ));


    if (result.rows.length === 0) {

      return res.status(403).json({

        message:"You cannot delete this store"

      });

    }


    res.json({

      message: "Store deleted successfully",

      store: result.rows[0],

    });

  } 

  catch (error) {

    console.error(error);

    res.status(500).json({ message: error.message });

  }

});


module.exports = router;