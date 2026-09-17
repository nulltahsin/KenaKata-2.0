const express = require("express");

const router = express.Router();

const pool = require("../config/db");

const verifyToken = require("../middleware/authMiddleware");

const checkRole = require("../middleware/roleMiddleware");



//customer nijer jonno reservation create korbe

//tai customer_id body theke nibo na, token theke nibo

router.post("/", verifyToken, checkRole("CUSTOMER"), async (req, res) => {
  try {
    const product_id = req.body.product_id || req.body.productId || null;
    let store_id = req.body.store_id || req.body.storeId || null;
    const payment_id = req.body.payment_id || req.body.paymentId || null;
    const deadline = req.body.deadline || new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();
    const customer_id = req.user.user_id;

    if (!product_id && !store_id) {
      return res.status(400).json({ message: "productId or storeId is required" });
    }

    if (product_id) {
      const productCheck = await pool.query(
        `SELECT store_id FROM products WHERE product_id = $1`,
        [product_id]
      );

      if (productCheck.rows.length === 0) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (!store_id) store_id = productCheck.rows[0].store_id;
      if (Number(productCheck.rows[0].store_id) !== Number(store_id)) {
        return res.status(400).json({ message: "This product does not belong to the selected store" });
      }
    }

    const result = await pool.query(
      `INSERT INTO reservations (customer_id, product_id, store_id, payment_id, deadline)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [customer_id, product_id, store_id, payment_id || null, deadline]
    );

    res.status(201).json({ message: "Reservation created successfully", reservation: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});




//customer sudhu nijer reservation dekhbe

router.get("/", verifyToken, checkRole("CUSTOMER"), async (req, res) => {
  try {
    const customer_id = req.user.user_id;
    const result = await pool.query(
      `SELECT r.*, p.name AS product_name, p.price AS product_price, p.image_url AS product_image,
          s.store_name, s.address AS store_location
       FROM reservations r
       LEFT JOIN products p ON r.product_id = p.product_id
       LEFT JOIN stores s ON r.store_id = s.store_id
       WHERE r.customer_id = $1
       ORDER BY r.reservation_id DESC`,
      [customer_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", verifyToken, checkRole("CUSTOMER"), async (req, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM reservations
       WHERE reservation_id = $1 AND customer_id = $2
       RETURNING *`,
      [req.params.id, req.user.user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    res.json({ message: "Reservation cancelled", reservation: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/my", verifyToken, checkRole("CUSTOMER"), async (req, res) => {
  return router.handle({ ...req, url: '/', method: 'GET' }, res);
});

router.get("/vendor/me", verifyToken, checkRole("VENDOR"), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.reservation_id, r.product_id, r.store_id, r.payment_id,
              r.deadline, r.status, r.customer_id,
              p.name AS product_name, s.store_name
       FROM reservations r
       JOIN products p ON r.product_id = p.product_id
       JOIN stores s ON r.store_id = s.store_id
       WHERE s.vendor_id=$1
         AND r.status IN ('Pending', 'Confirmed')
       ORDER BY r.reservation_id DESC`,
      [req.user.user_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});




//customer id change korleo onno customer er reservation dekhte parbe na

router.get("/customer/:id",

    verifyToken,

checkRole("CUSTOMER"),

async (req, res) => {

  try {


   const customer_id = req.user.user_id;



    const result = await pool.query(

      `

      SELECT 

          r.*,

          p.name AS product_name,

          s.store_name

      FROM reservations r

      JOIN products p

      ON r.product_id = p.product_id

      JOIN stores s

      ON r.store_id = s.store_id

      WHERE r.customer_id=$1

      ORDER BY r.reservation_id DESC

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





//specific reservation details

//ownership check kore dekha hocche reservation ta logged in customer er kina

router.get("/:id",

    verifyToken,

checkRole("CUSTOMER"),

 async (req, res) => {

  try {


    const reservation_id = req.params.id;

    const customer_id = req.user.user_id;



    const result = await pool.query(

      `

      SELECT 

          r.*,

          p.name AS product_name,

          s.store_name

      FROM reservations r

      JOIN products p

      ON r.product_id = p.product_id

      JOIN stores s

      ON r.store_id = s.store_id

      WHERE r.reservation_id=$1

      AND r.customer_id=$2

      `,

      [

        reservation_id,

        customer_id

      ]

    );



    if(result.rows.length===0){

      return res.status(403).json({

        message:"You cannot access this reservation"

      });

    }



    res.json(result.rows[0]);


  } 

  catch (error) {

    console.error(error);

    res.status(500).json({ message:error.message });

  }

});







//reservation status update sudhu vendor korbe

//vendor sudhu nijer store er reservation update korte parbe

router.patch("/:id/status",

    verifyToken,

checkRole("VENDOR"),

 async (req, res) => {


  try {


    const reservation_id = req.params.id;

    const vendor_id = req.user.user_id;


    const { status } = req.body;



    const allowed = ["Pending", "Collected", "Cancelled", "Expired"];




    if(!allowed.includes(status))

    {

      return res.status(400).json({

        message:"Invalid status"

      });

    }





    //check vendor ownership

    //je store er product er reservation, oi store ki ei vendor er?

    const ownership = await pool.query(

      `

      SELECT

          r.reservation_id

      FROM reservations r

      JOIN stores s

      ON r.store_id=s.store_id

      WHERE r.reservation_id=$1

      AND s.vendor_id=$2

      `,

      [

        reservation_id,

        vendor_id

      ]

    );





    if(ownership.rows.length===0){

      return res.status(403).json({

        message:"You cannot update this reservation"

      });

    }






    const result = await pool.query(

      `

      UPDATE reservations

      SET status=$1

      WHERE reservation_id=$2

      RETURNING *

      `,

      [

        status,

        reservation_id

      ]

    );




    if(result.rows.length===0){

      return res.status(404).json({

        message:"Reservation not found"

      });

    }




    res.json({

      message:"Reservation status updated successfully",

      reservation:result.rows[0]

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