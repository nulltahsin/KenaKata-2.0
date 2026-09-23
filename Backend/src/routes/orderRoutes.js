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
async (req,res)=> {

  try {

    const customer_id = req.user.user_id;

    const orders = await pool.query(
      `
      SELECT 
  o.order_id,
  o.total_amount,
  o.status,
  o.payment_id,
  o.delivery_name,
  o.delivery_phone,
  o.delivery_address,
  o.delivery_notes,
  o.payment_method
FROM orders o
      WHERE o.customer_id=$1
      ORDER BY o.order_id DESC
      `,
      [customer_id]
    );


    const result = [];

    for (const order of orders.rows) {

      const items = await pool.query(
        `
       SELECT
  oi.order_item_id,
  oi.product_id,
  p.name,
  p.image_url,
  oi.quantity,
  oi.price_at_purchase
FROM order_items oi
        JOIN products p
        ON oi.product_id=p.product_id
        WHERE oi.order_id=$1
        `,
        [order.order_id]
      );


      result.push({

        ...order,
items: items.rows.map(item=>({
    order_item_id:item.order_item_id,
    product_id:item.product_id,
    name:item.name,
    image:item.image_url,
    quantity:item.quantity,
    price:Number(item.price_at_purchase),
    reviewed: !!item.review_id
}))


      });

    }


    res.json(result);


  } catch(error){

    console.error(error);

    res.status(500).json({
      message:error.message
    });

  }

});

router.get(["/vendor", "/vendor/me"], verifyToken, checkRole("VENDOR"), async (req, res) => {
  console.log("LOGIN VENDOR ID =", req.user.user_id);
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


    if(status === "Delivered"){

  const items = await pool.query(
    `
    SELECT product_id, quantity
    FROM order_items
    WHERE order_id=$1
    `,
    [order_id]
  );


  for(const item of items.rows){

    await pool.query(
      `
      UPDATE products
      SET stock_qty = stock_qty - $1
      WHERE product_id=$2
      `,
      [
        item.quantity,
        item.product_id
      ]
    );

  }

}


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





// Complete checkout API
// Customer order place korar main route

router.post(
  "/checkout",
  verifyToken,
  checkRole("CUSTOMER"),
  async (req, res) => {

    const client = await pool.connect();

    try {

      const customer_id = req.user.user_id;


      const {
        delivery_name,
        delivery_phone,
        delivery_address,
        delivery_notes,
        payment_method
      } = req.body;



      // basic validation
      if (
        !delivery_name ||
        !delivery_phone ||
        !delivery_address
      ) {
        return res.status(400).json({
          message:"Delivery information required"
        });
      }



      // only COD allowed
      if(payment_method !== "Cash on Delivery"){
        return res.status(400).json({
          message:"Only Cash on Delivery available"
        });
      }



      await client.query("BEGIN");



      // cart theke active hold gula nibo
      const cartItems = await client.query(
        `
        SELECT 
          h.product_id,
          h.quantity,
          p.price

        FROM product_holds h

        JOIN products p
        ON h.product_id=p.product_id

        WHERE h.customer_id=$1
        AND h.status='active'
        `,
        [
          customer_id
        ]
      );



      if(cartItems.rows.length===0){

        await client.query("ROLLBACK");

        return res.status(400).json({
          message:"Cart is empty"
        });

      }



      // total calculate
      let total_amount = 60;


      cartItems.rows.forEach(item=>{

        total_amount +=
          Number(item.price) *
          Number(item.quantity);

      });



      // order create
      const orderResult =
      await client.query(
        `
        INSERT INTO orders
        (
          customer_id,
          total_amount,
          status,
          delivery_name,
          delivery_phone,
          delivery_address,
          delivery_notes,
          payment_method
        )

        VALUES
        (
          $1,$2,'Pending',
          $3,$4,$5,$6,$7
        )

        RETURNING *
        `,
        [
          customer_id,
          total_amount,
          delivery_name,
          delivery_phone,
          delivery_address,
          delivery_notes,
          payment_method
        ]
      );



      const order =
      orderResult.rows[0];




      // order_items insert
      for(const item of cartItems.rows){


        await client.query(
          `
          INSERT INTO order_items
          (
            order_id,
            product_id,
            quantity,
            price_at_purchase
          )

          VALUES($1,$2,$3,$4)

          `,
          [
            order.order_id,
            item.product_id,
            item.quantity,
            item.price
          ]
        );


      }




      // cart hold remove kore dibo
      await client.query(
        `
        DELETE FROM product_holds

        WHERE customer_id=$1
        AND status='active'
        `,
        [
          customer_id
        ]
      );




      await client.query("COMMIT");



      res.status(201).json({

        message:
        "Order placed successfully",

        order_id:
        order.order_id,

        status:
        order.status

      });



    } 
    catch(error){


      await client.query("ROLLBACK");


      console.error(error);


      res.status(500).json({
        message:error.message
      });


    }
    finally{

      client.release();

    }

  }
);









module.exports = router;