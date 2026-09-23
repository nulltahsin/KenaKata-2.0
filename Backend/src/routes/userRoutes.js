const express = require("express");

const router = express.Router();

const pool = require("../config/db");

const verifyToken = require("../middleware/authMiddleware");
const withTransaction = require("../config/transaction");



//ekjon user jeno onno user er profile dekhte na pare
//tai token user_id er sathe requested id match korbo

router.get("/:id",

verifyToken,

async (req, res) => {

  try {

    const user_id = req.params.id;


    //logged in user er id
    const logged_user_id = req.user.user_id;



    if(Number(user_id)!==logged_user_id){

      return res.status(403).json({

        message:"You cannot access another user's profile"

      });

    }



    const result = await pool.query(

      `

      SELECT

          user_id,

          name,

          email,

          phone,

          role

      FROM users

      WHERE user_id=$1

      `,

      [user_id]

    );

    if (result.rows.length === 0) {

      return res.status(404).json({ message: "User not found" });

    }

    res.json(result.rows[0]);

  } catch (error) {

    console.error(error);

    res.status(500).json({ message: error.message });

  }

});




//user nijer profile update korte parbe
//onnoder profile update kora block korlam

router.patch("/:id",

verifyToken,

async (req, res) => {

  try {


    const user_id = req.params.id;


    const logged_user_id = req.user.user_id;



    if(Number(user_id)!==logged_user_id){

      return res.status(403).json({

        message:"You cannot update another user's profile"

      });

    }



    const { name, phone } = req.body;

    const result = await withTransaction(pool, (client) => client.query(

      `

      UPDATE users

      SET

          name=$1,

          phone=$2

      WHERE user_id=$3

      RETURNING

          user_id,

          name,

          email,

          phone,

          role

      `,

      [name, phone, user_id]

    ));


    if (result.rows.length === 0) {

      return res.status(404).json({ message: "User not found" });

    }


    res.json({

      message: "Profile updated successfully",

      user: result.rows[0],

    });

  } 
  catch (error) {

    console.error(error);

    res.status(500).json({ message: error.message });

  }

});


module.exports = router;