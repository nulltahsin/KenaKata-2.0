const express = require("express");

const router = express.Router();

const pool = require("../config/db");

const verifyToken = require("../middleware/authMiddleware");

const checkRole = require("../middleware/roleMiddleware");
const withTransaction = require("../config/transaction");




//payment create korbe only CUSTOMER
//karon customer nijer order er jonno payment korbe
//payment anr order dui table e eksathe changes ani tai commit , rollback usage , karon ekta fail korle arekta hobe na
router.post("/",

    verifyToken,

checkRole("CUSTOMER"),

async (req, res) => {


  const client = await pool.connect();


  try {


    const { method, amount, transaction_id, order_id } = req.body;


    if(!method || !amount || !order_id){

      return res.status(400).json({

        message:"Required fields missing"

      });

    }



    const customer_id = req.user.user_id;

    //logged in customer er id
    //jate ekjon customer onno customer er order e payment korte na pare



    //transaction start korlam
    //ekhon er porer shob database operation ekshathe execute hobe

    await client.query("BEGIN");


    //first check korbo order ta ei customer er kina

    const orderCheck = await client.query(

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


      //transaction cancel korlam

      await client.query("ROLLBACK");


      return res.status(403).json({

        message:"You cannot make payment for this order"

      });

    }




    //payment table e data insert korbo

    const result = await client.query(

      `

      INSERT INTO payments

      (

          method,

          amount,

          transaction_id

      )

      VALUES($1,$2,$3)

      RETURNING *

      `,

      [

        method,

        amount,

        transaction_id

      ]

    );





    const pay_id = result.rows[0].pay_id;





    //payment create howar por order table update korbo

    //order er sathe payment id attach korbo

    const order = await client.query(

      `

      UPDATE orders

      SET payment_id=$1

      WHERE order_id=$2

      RETURNING *

      `,

      [

        pay_id,

        order_id

      ]

    );


    //duita operation successful hole permanently save korbo

    await client.query("COMMIT");



    res.status(201).json({

      message:"Payment created and order updated successfully",

      payment:result.rows[0],

      order:order.rows[0]

    });



  }


  catch(error){


    //kono error hole payment insert/update duitai cancel hobe

    await client.query("ROLLBACK");


    console.error(error);


    res.status(500).json({

      message:error.message

    });

  }



  finally{


    //database connection release korlam

    client.release();


  }


});






//sob payment dekhar permission dibo na
//customer sudhu nijer payment dekhte parbe
router.get("/",

    verifyToken,

checkRole("CUSTOMER"),

 async (req, res) => {

  try {


    const customer_id=req.user.user_id;


    const result = await pool.query(

      `

      SELECT

          p.pay_id,

          p.method,

          p.amount,

          p.transaction_id,

          o.order_id,

          o.status

      FROM payments p

      JOIN orders o

      ON p.pay_id=o.payment_id

      WHERE o.customer_id=$1

      ORDER BY p.pay_id DESC

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








//specific customer er payment dekhano lagbe na
//karone URL e id change kore onno customer er payment dekha possible hote pare
//tai logged in customer er id token theke nibo

router.get("/customer/:id",

    verifyToken,

checkRole("CUSTOMER"),

 async (req, res) => {


  try {


    const customer_id=req.user.user_id;


    const result = await pool.query(

      `

      SELECT

          p.pay_id,

          p.method,

          p.amount,

          p.transaction_id,

          o.order_id,

          o.status

      FROM payments p

      JOIN orders o

      ON p.pay_id=o.payment_id

      WHERE o.customer_id=$1

      ORDER BY p.pay_id DESC

      `,

      [

        customer_id

      ]

    );


    res.json(result.rows);


  }


  catch(error){

    console.error(error);

    res.status(500).json({

      message:error.message

    });

  }

});







//single payment dekhar jonno
//check korbo ei payment logged in customer er kina

router.get("/:id",

    verifyToken,

checkRole("CUSTOMER"),

 async (req, res) => {


  try {


    const pay_id=req.params.id;


    const customer_id=req.user.user_id;



    const result = await pool.query(

      `

      SELECT

          p.*

      FROM payments p

      JOIN orders o

      ON p.pay_id=o.payment_id

      WHERE p.pay_id=$1

      AND o.customer_id=$2

      `,

      [

        pay_id,

        customer_id

      ]

    );



    if(result.rows.length===0){

      return res.status(403).json({

        message:"You cannot access this payment"

      });

    }



    res.json(result.rows[0]);


  }


  catch(error){

    console.error(error);

    res.status(500).json({

      message:error.message

    });

  }

});








//payment delete korbe only nijer payment
//onno customer er payment delete korte parbe na

router.delete("/:id",

    verifyToken,

checkRole("CUSTOMER"),

 async (req,res)=>{


  try{


    const pay_id=req.params.id;


    const customer_id=req.user.user_id;



    const result = await withTransaction(pool, (client) => client.query(

      `

      DELETE FROM payments p

      USING orders o

      WHERE p.pay_id=$1

      AND p.pay_id=o.payment_id

      AND o.customer_id=$2

      RETURNING p.*

      `,

      [

        pay_id,

        customer_id

      ]

    ));



    if(result.rows.length===0){

      return res.status(403).json({

        message:"You cannot delete this payment"

      });

    }



    res.json({

      message:"Payment deleted successfully",

      payment:result.rows[0]

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