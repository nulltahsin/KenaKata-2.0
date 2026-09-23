const express = require("express");

const router = express.Router();

const pool = require("../config/db");

const verifyToken = require("../middleware/authMiddleware");

const checkRole = require("../middleware/roleMiddleware");

const withTransaction = require("../config/transaction");

const adminOnly = [verifyToken, checkRole("ADMIN")];



// ===============================
// ADMIN DASHBOARD SUMMARY
// ===============================

router.get("/summary", ...adminOnly, async (req, res) => {

    try {

        const [markets, shops, members, products, sales] = await Promise.all([

            pool.query(
                "SELECT COUNT(*)::int AS total FROM markets"
            ),

            pool.query(
                "SELECT COUNT(*)::int AS total FROM stores"
            ),

            pool.query(
                "SELECT COUNT(*)::int AS total FROM users WHERE role='CUSTOMER'"
            ),

            pool.query(
                "SELECT COUNT(*)::int AS total FROM products"
            ),

            pool.query(
                `
                SELECT 
                    COALESCE(SUM(total_amount),0)::numeric AS total,
                    COUNT(*)::int AS orders
                FROM orders
                WHERE status <> 'Cancelled'
                `
            )

        ]);


        res.json({

            markets: markets.rows[0].total,

            shops: shops.rows[0].total,

            members: members.rows[0].total,

            products: products.rows[0].total,

            sales: sales.rows[0]

        });


    } catch(error){

        console.error(error);

        res.status(500).json({
            message:"Failed to load admin summary"
        });

    }

});




// ===============================
// VIEW ALL SHOPS
// ===============================

router.get("/shops", ...adminOnly, async(req,res)=>{


    try{


        const result = await pool.query(

            `
            SELECT 
                s.store_id,
                s.store_name,
                u.name AS owner_name,
                m.market_name,
                COUNT(p.product_id)::int AS product_count

            FROM stores s

            JOIN users u 
            ON u.user_id = s.vendor_id

            JOIN markets m 
            ON m.market_id = s.market_id

            LEFT JOIN products p
            ON p.store_id = s.store_id

            GROUP BY 
                s.store_id,
                s.store_name,
                u.name,
                m.market_name

            ORDER BY s.store_id DESC
            `

        );


        res.json(result.rows);


    }
    catch(error){

        console.error(error);

        res.status(500).json({
            message:"Failed to load shops"
        });

    }


});




// ===============================
// VIEW ALL CUSTOMERS
// ===============================


router.get("/members", ...adminOnly, async(req,res)=>{


    try{


        const result = await pool.query(

            `
            SELECT

                u.user_id,
                u.name,
                u.email,
                u.phone,

                COALESCE(
                    c.delivery_address,
                    'Not provided'
                ) AS area


            FROM users u

            LEFT JOIN customers c

            ON c.user_id=u.user_id


            WHERE u.role='CUSTOMER'


            ORDER BY u.user_id DESC

            `

        );


        res.json(result.rows);


    }
    catch(error){

        console.error(error);

        res.status(500).json({
            message:"Failed to load members"
        });

    }


});




// ===============================
// SALES DATA
// ===============================


router.get("/sales", ...adminOnly, async(req,res)=>{


    try{


        const result = await pool.query(

            `
            SELECT

                o.order_id,
                o.total_amount,
                o.status,
                u.name AS customer_name


            FROM orders o


            JOIN users u

            ON u.user_id=o.customer_id


            WHERE o.status <> 'Cancelled'


            ORDER BY o.order_id DESC


            LIMIT 8

            `

        );


        res.json(result.rows);


    }
    catch(error){

        console.error(error);

        res.status(500).json({
            message:"Failed to load sales"
        });

    }


});




// ===============================
// VIEW ALL USERS
// ===============================


router.get("/users",
    ...adminOnly,

async(req,res)=>{


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




// ===============================
// VIEW ALL ORDERS
// ===============================


router.get("/orders",
    ...adminOnly,

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




// ===============================
// VIEW ALL VENDORS
// ===============================


router.get("/vendors",
    ...adminOnly,

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




// ===============================
// DELETE USER (TRANSACTION SAFE)
// ===============================


router.delete("/users/:id",

    ...adminOnly,

async(req,res)=>{


    try{


        const user_id = req.params.id;



        const result = await withTransaction(

            pool,

            (client)=>

            client.query(

                `
                DELETE FROM users

                WHERE user_id=$1

                RETURNING *

                `,

                [user_id]

            )

        );



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