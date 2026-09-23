const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const verifyToken = require("../middleware/authMiddleware");
const checkRole = require("../middleware/roleMiddleware");
const withTransaction = require("../config/transaction");



router.post("/", async (req, res) => {

  const client = await pool.connect();

  try {

    const {

      name,

      email,

      phone,

      password_hash,

      delivery_address,

    } = req.body;


    await client.query("BEGIN");


    const userResult = await client.query(

      `

      INSERT INTO users

      (

          name,

          email,

          phone,

          password_hash,

          role

      )

      VALUES($1,$2,$3,$4,'CUSTOMER')

      RETURNING user_id

      `,

      [name, email, phone, password_hash]

    );


    const user_id = userResult.rows[0].user_id;


    const customerResult = await client.query(

      `

      INSERT INTO customers

      (

          user_id,

          delivery_address

      )

      VALUES($1,$2)

      RETURNING *

      `,

      [user_id, delivery_address]

    );


    await client.query("COMMIT");


    res.status(201).json({

      message: "Customer created successfully",

      customer: customerResult.rows[0],

    });


  } catch (error) {

    await client.query("ROLLBACK").catch(() => {});
    console.error(error);

    res.status(500).json({ message: error.message });

  } finally {

    client.release();

  }

});



//customer nijer profile dekhte parbe

//onno customer er information access korte parbe na

router.get("/:id",

verifyToken,

checkRole("CUSTOMER"),

async (req, res) => {


  try {


    const user_id = req.params.id;

    const logged_user_id = req.user.user_id;

    //postman e onno customer id dile block korbo

    if( Number(user_id) !==logged_user_id ){

      return res.status(403).json({

        message:"You cannot access another customer's profile"

      });

    }



    const result = await pool.query(

      `

      SELECT

          u.user_id,

          u.name,

          u.email,

          u.phone,

          u.role,

          c.delivery_address

      FROM users u

      JOIN customers c

      ON u.user_id = c.user_id

      WHERE u.user_id=$1

      `,

      [user_id]

    );


    if (result.rows.length === 0) {

      return res.status(404).json({ message: "Customer not found" });

    }


    res.json(result.rows[0]);


  } catch (error) {

    console.error(error);

    res.status(500).json({ message: error.message });

  }

});



//customer nijer profile update korte parbe

//onnoder customer profile change kora jabe na

router.patch("/:id",

verifyToken,

checkRole("CUSTOMER"),

async (req, res) => {


  try {


    const user_id = req.params.id;
    const logged_user_id = req.user.user_id;

    //ownership check

    if(Number(user_id)!==logged_user_id){

      return res.status(403).json({

        message:"You cannot update another customer's profile"

      });

    }



    const { name, phone, delivery_address } = req.body;


    const result = await withTransaction(pool, async (client) => {
      await client.query(

      `

      UPDATE users

      SET

          name=$1,

          phone=$2

      WHERE user_id=$3

      `,

      [name, phone, user_id]

      );



      return client.query(

      `

      UPDATE customers

      SET

          delivery_address=$1

      WHERE user_id=$2

      RETURNING *

      `,

      [delivery_address, user_id]

      );
    });



    if (result.rows.length === 0) {

      return res.status(404).json({ message: "Customer not found" });

    }


    res.json({

      message: "Customer profile updated successfully",

      customer: result.rows[0],

    });


  } catch (error) {

    console.error(error);

    res.status(500).json({ message: error.message });

  }

});


module.exports = router;