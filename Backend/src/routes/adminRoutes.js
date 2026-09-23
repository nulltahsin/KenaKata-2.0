const express = require("express");

const router = express.Router();

const pool = require("../config/db");

const verifyToken = require("../middleware/authMiddleware");

const checkRole = require("../middleware/roleMiddleware");
const withTransaction = require("../config/transaction");



//admin can see all users
//karon system er shob user manage korar permission only admin er thakbe

router.get("/users",

    verifyToken,

checkRole("ADMIN"),

async (req,res)=>{

    try{

        const result = await pool.query(

            `
            SELECT

                user_id,

                name,

                email,

                phone,

                role

            FROM users

            ORDER BY user_id

            `

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



//admin can see all orders
//karon admin pura system monitor korbe

router.get("/orders",

    verifyToken,

checkRole("ADMIN"),

async(req,res)=>{


    try{


        const result = await pool.query(

            `

            SELECT *

            FROM orders

            ORDER BY order_id DESC

            `

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




//admin can see all vendors
//vendor der activity manage korar jonno

router.get("/vendors",

verifyToken,

checkRole("ADMIN"),

async(req,res)=>{


    try{


        const result = await pool.query(

            `

            SELECT

                u.user_id,

                u.name,

                u.email,

                u.phone

            FROM users u

            WHERE u.role='VENDOR'

            ORDER BY u.user_id

            `

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




//admin can delete user
//important: customer/vendor remove korar permission only admin er

router.delete("/users/:id",

verifyToken,

checkRole("ADMIN"),

async(req,res)=>{


    try{


        const user_id = req.params.id;


        const result = await withTransaction(pool, (client) => client.query(
            `
            DELETE FROM users
            WHERE user_id=$1
            RETURNING *
            `,
            [user_id]
        ));

        if(result.rows.length===0){

            return res.status(404).json({
                message:"User not found"

            });

        }


        res.json({

            message:"User deleted successfully",

            user:result.rows[0]

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