const express = require("express");

const router = express.Router();

const pool = require("../config/db");

const verifyToken = require("../middleware/authMiddleware");

const checkRole = require("../middleware/roleMiddleware");
const withTransaction = require("../config/transaction");

const wishlistTableReady = pool.query(`
  CREATE TABLE IF NOT EXISTS wishlist (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
  )
`);


//wishlist e product add korbe only CUSTOMER

//tai authentication ar role check korlam

//customer_id body theke nibo na, token theke nibo
//tai req.user.user_id
//jate ekjon customer onno customer er wishlist e add korte na pare

router.post("/",

    verifyToken,

checkRole("CUSTOMER"),

 async (req, res) => {

  try {
    await wishlistTableReady;


    const product_id = req.body.product_id || req.body.productId;


    const user_id = req.user.user_id || req.user.id;

    if (!Number(product_id)) {
      return res.status(400).json({ message: "product_id is required" });
    }
    //logged in customer er id
    //server nijer moto identify korbe, user fake id dite parbe na



    const result = await withTransaction(pool, (client) => client.query(
      `INSERT INTO wishlist (user_id, product_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, product_id) DO NOTHING
       RETURNING *`,
      [user_id, product_id]

    ));



    res.status(201).json({

      message: "Added to wishlist",
      wishlist: result.rows[0] || { user_id, product_id },

    });



  } 

  catch (error) {

    console.error(error);

    res.status(500).json({ message: error.message });

  }

});

router.get("/", verifyToken, checkRole("CUSTOMER"), async (req, res) => {
  try {
    await wishlistTableReady;
    const result = await pool.query(
      `SELECT w.id, w.user_id, w.product_id,
              p.name, p.price, p.stock_qty, p.image_url, s.store_name
       FROM wishlist w
       JOIN products p ON p.product_id = w.product_id
       LEFT JOIN stores s ON s.store_id = p.store_id
       WHERE w.user_id = $1
       ORDER BY w.id DESC`,
      [req.user.user_id || req.user.id]
    );

    res.json(result.rows.map((row) => ({
      ...row,
      wishlist_id: row.id,
      id: row.product_id,
      image: row.image_url,
      store: row.store_name,
      stock: row.stock_qty,
    })));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});







//customer sudhu nijer wishlist dekhte parbe

//postman e customer_id change kore onno customer er wishlist dekha jabe na

//tai id parameter use korchi na, token theke customer identify korchi

router.get("/customer/:id",

    verifyToken,

checkRole("CUSTOMER"),

 async (req, res) => {


  try {

    const requestedId = req.params.id === "me" ? req.user.user_id : Number(req.params.id);

    if (requestedId !== req.user.user_id) {
      return res.status(403).json({
        message: "Access denied. You can only access your own wishlist."
      });
    }

    const customer_id = req.user.user_id;
    //logged in customer er id



    const result = await pool.query(

      `

      SELECT 

          w.wishlist_id,

          w.customer_id,

          w.product_id,

          p.name,

          p.price,

          p.stock_qty

      FROM wishlist w

      JOIN products p

      ON w.product_id = p.product_id

      WHERE w.customer_id = $1

      ORDER BY w.wishlist_id DESC

      `,

      [

        customer_id

      ]

    );


    res.json(result.rows);



  } 

  catch (error) {

    console.error(error);

    res.status(500).json({ message: error.message });

  }

});






//wishlist item remove korbe only nijer wishlist theke

//onnno customer er wishlist item delete korte parbe na

router.delete("/:id",

    verifyToken,

checkRole("CUSTOMER"),

 async (req, res) => {


  try {

    await wishlistTableReady;


    const requested_id = req.params.id;


    const user_id = req.user.user_id || req.user.id;
    //logged in customer er id



    //check korbo wishlist item ta ei customer er kina

    const result = await withTransaction(pool, (client) => client.query(

      `

      DELETE FROM wishlist
      WHERE (id = $1 OR product_id = $1)
        AND user_id = $2

      RETURNING *

      `,

      [

        requested_id,

        user_id

      ]

    ));




    if(result.rows.length===0){

      return res.status(403).json({

        message:"You cannot delete this wishlist item"

      });

    }




    res.json({

      message:"Removed from wishlist",

      deleted:result.rows[0],

    });



  }


  catch(error){

    console.error(error);

    res.status(500).json({

      message:error.message

    });

  }

});



module.exports = router;