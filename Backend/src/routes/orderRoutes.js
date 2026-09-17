const express = require("express");

const router = express.Router();

const pool = require("../config/db");

const verifyToken = require("../middleware/authMiddleware");

const checkRole = require("../middleware/roleMiddleware");


router.post("/", 

    verifyToken,

checkRole("CUSTOMER"),

 async (req, res) => {

  try {

   const { total_amount } = req.body;

   if(total_amount === undefined || total_amount < 0)

     {

          return res.status(400).json({

                message:"Invalid amount"

            });

    }     

     const customer_id = req.user.user_id;  //ekjon customer , onno customer er jonno order place korte parbe na

    const result = await pool.query(

      `

      INSERT INTO orders

      (

          customer_id,

          total_amount

      )

      VALUES($1,$2)

      RETURNING *

      `,

      [customer_id, total_amount]

    );

    res.status(201).json(result.rows[0]);



  } 

  catch (error) {

    console.error(error);

    res.status(500).json({ message: error.message });

  }

});



router.get("/", 

    verifyToken,

checkRole("CUSTOMER"), 

    async (req, res) => {

  try {

    const customer_id=req.user.user_id;

    const result = await pool.query(

      `

      SELECT *

      FROM orders

      WHERE customer_id=$1

      ORDER BY order_id

      `,

      [customer_id]

    );

    res.json(result.rows);

  }

   catch (error) {

    console.error(error);

    res.status(500).json({ message: error.message });

  }

});

router.get(["/vendor", "/vendor/me"], verifyToken, checkRole("VENDOR"), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT o.order_id, o.total_amount, o.status, o.customer_id,
              o.payment_id, oi.product_id, oi.quantity, oi.price_at_purchase,
              p.name AS product_name, s.store_name
       FROM orders o
       JOIN order_items oi ON o.order_id = oi.order_id
       JOIN products p ON oi.product_id = p.product_id
       JOIN stores s ON p.store_id = s.store_id
       WHERE s.vendor_id=$1
       ORDER BY o.order_id DESC`,
      [req.user.user_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});



router.get("/customer/:id", //logged in customer er id , onno customer er order dekhte parbe na

    verifyToken,

checkRole("CUSTOMER"),

async (req, res) => {

  try {

   const customer_id = req.user.user_id;  //api e customer//999 dileo labh nai..shudhu nijer order tai dekhbe*

   //logged in customer er id

    const result = await pool.query(

      `

      SELECT

          o.order_id,

          o.total_amount,

          o.status,

          O.customer_id,

          o.payment_id

      FROM orders o

      WHERE o.customer_id=$1

      ORDER BY o.order_id DESC

      `,

      [customer_id]

    );



    res.json(result.rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({ message: error.message });

  }

});





router.get("/:id",

    verifyToken,

checkRole("CUSTOMER"),

    async (req, res) => {

  try {

    const order_id = req.params.id;

    const customer_id = req.user.user_id;

    const order = await pool.query(

      `

      SELECT

          o.order_id,

          o.customer_id,

          o.payment_id,

          o.total_amount,

          o.status

      FROM orders o

        WHERE o.order_id=$1

       AND o.customer_id=$2

       `,

        [

    order_id,

    customer_id

          ]

    );



      if(order.rows.length===0){

    return res.status(403).json({

        message:"You cannot access this order"

         });

}



    const items = await pool.query(

      `

      SELECT

          oi.order_item_id,

          oi.product_id,

          p.name,

          oi.quantity,

          oi.price_at_purchase

      FROM order_items oi

      JOIN products p

      ON oi.product_id=p.product_id

      WHERE oi.order_id=$1

      `,

      [order_id]

    );

    res.json({

      order: order.rows[0],

      items: items.rows,

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({ message: error.message });

  }

});




router.patch("/:id/status",    //only vendor can update order status , as it is the sellers authority to do so

    verifyToken,

checkRole("VENDOR"),

 async (req, res) => {

  try {

    const order_id = req.params.id;

    const vendor_id = req.user.user_id;

    const { status } = req.body;


           const allowed=[

      "Pending",

     "Confirmed",

      "Shipped",

     "Delivered",

     "Cancelled"

          ]; 



      if(!allowed.includes(status))

     {

       return res.status(400).json({

      message:"Invalid status"

        });

     }


     //check vendor ownership of order

     const ownership = await pool.query(

      `

      SELECT

          o.order_id

      FROM orders o

      JOIN order_items oi

      ON o.order_id = oi.order_id

      JOIN products p

      ON oi.product_id = p.product_id

      JOIN stores s

      ON p.store_id = s.store_id

      WHERE o.order_id=$1

      AND s.vendor_id=$2

      `,

      [

        order_id,

        vendor_id

      ]

     );


     if(ownership.rows.length===0){

        return res.status(403).json({

          message:"You cannot update this order"

        });

     }



    const result = await pool.query(

      `

      UPDATE orders

      SET status=$1

      WHERE order_id=$2

      RETURNING *

      `,

      [status, order_id]

    );


    if (result.rows.length === 0) {

      return res.status(404).json({ message: "Order not found" });

    }


    res.json({

      message: "Order status updated successfully",

      order: result.rows[0],

    });

  } 

  catch (error) {

    console.error(error);

    res.status(500).json({ message: error.message });

  }

});

module.exports = router;