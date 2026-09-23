const express = require("express");

const router = express.Router();

const pool = require("../config/db");

const verifyToken = require("../middleware/authMiddleware");

const checkRole = require("../middleware/roleMiddleware");
const withTransaction = require("../config/transaction");



//customer sudhu nijer order er jonno item add korte parbe

//tai order_id verify kora hocche

router.post("/",

    verifyToken,

checkRole("CUSTOMER"),

 async (req, res) => {

  try {


    const { order_id, product_id, quantity, price_at_purchase } = req.body;


    const customer_id = req.user.user_id;



    //check korchi order ta logged in customer er kina

    const orderCheck = await pool.query(

      `

      SELECT order_id

      FROM orders

      WHERE order_id=$1

      AND customer_id=$2

      `,

      [

        order_id,

        customer_id

      ]

    );



    if(orderCheck.rows.length===0){

      return res.status(403).json({

        message:"You cannot add item to this order"

      });

    }




    const result = await withTransaction(pool, (client) => client.query(

      `

      INSERT INTO order_items

      (

          order_id,

          product_id,

          quantity,

          price_at_purchase

      )

      VALUES($1,$2,$3,$4)

      RETURNING *

      `,

      [

        order_id,

        product_id,

        quantity,

        price_at_purchase

      ]

    ));


    res.status(201).json(result.rows[0]);


  } 

  catch (error) {

    console.error(error);

    res.status(500).json({ message: error.message });

  }

});







//customer sudhu nijer order item dekhbe

router.get("/",

    verifyToken,

checkRole("CUSTOMER"),

 async (req, res) => {

  try {


    const customer_id = req.user.user_id;



    const result = await pool.query(

      `

      SELECT

          oi.*

      FROM order_items oi

      JOIN orders o

      ON oi.order_id=o.order_id

      WHERE o.customer_id=$1

      ORDER BY oi.order_item_id

      `,

      [

        customer_id

      ]

    );


    res.json(result.rows);



  } 

  catch (error) {

    console.error(error);

    res.status(500).json({ message:error.message });

  }

});







//specific order er items

//order id change kore onno customer er item dekha jabe na

router.get("/order/:id",

    verifyToken,

checkRole("CUSTOMER"),

 async (req, res) => {

  try {


    const order_id = req.params.id;


    const customer_id = req.user.user_id;



    //check order ownership

    const orderCheck = await pool.query(

      `

      SELECT order_id

      FROM orders

      WHERE order_id=$1

      AND customer_id=$2

      `,

      [

        order_id,

        customer_id

      ]

    );



    if(orderCheck.rows.length===0){

      return res.status(403).json({

        message:"You cannot access this order items"

      });

    }




    const result = await pool.query(

      `

      SELECT

          oi.order_item_id,

          oi.order_id,

          oi.product_id,

          p.name AS product_name,

          oi.quantity,

          oi.price_at_purchase

      FROM order_items oi

      JOIN products p

      ON oi.product_id=p.product_id

      WHERE oi.order_id=$1

      ORDER BY oi.order_item_id ASC

      `,

      [

        order_id

      ]

    );




    if(result.rows.length===0){

      return res.status(404).json({

        message:"No items found for this order"

      });

    }



    res.json(result.rows);


  } 

  catch (error) {

    console.error(error);

    res.status(500).json({ message:error.message });

  }

});





module.exports = router;