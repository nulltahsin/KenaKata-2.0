const express = require("express");

const router = express.Router();

const pool = require("../config/db");
const withTransaction = require("../config/transaction");

const verifyToken = require("../middleware/authMiddleware");

const checkRole = require("../middleware/roleMiddleware");

const adminOnly = [verifyToken, checkRole("ADMIN")];



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


        const result = await withTransaction(pool, (client) =>
            client.query(
                `
                DELETE FROM users
                WHERE user_id = $1
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




router.get("/analytics/summary", ...adminOnly, async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM get_admin_sales_summary()"
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to load sales summary" });
    }
});

router.get("/analytics/customers/:id/total", ...adminOnly, async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT get_customer_order_total($1) AS total",
            [req.params.id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to load customer total" });
    }
});

router.post("/orders/:id/cancel", ...adminOnly, async (req, res) => {
    try {
        await pool.query("CALL cancel_order_and_restore_stock($1)", [
            req.params.id
        ]);
        res.json({ message: "Order cancelled and stock restored" });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
});



router.get("/analytics/top-products", ...adminOnly, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT p.product_id, p.name, s.store_name,
                   SUM(oi.quantity)::int AS units_sold,
                   SUM(oi.quantity * oi.price_at_purchase)::numeric AS revenue
            FROM order_items oi
            JOIN orders o ON o.order_id = oi.order_id
            JOIN products p ON p.product_id = oi.product_id
            JOIN stores s ON s.store_id = p.store_id
            WHERE o.status <> 'Cancelled'
            GROUP BY p.product_id, p.name, s.store_name
            ORDER BY revenue DESC, units_sold DESC
            LIMIT 10
        `);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to load top products" });
    }
});

router.get("/analytics/top-vendors", ...adminOnly, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT u.user_id, u.name AS vendor_name,
                   v.business_name,
                   COUNT(DISTINCT o.order_id)::int AS order_count,
                   COALESCE(SUM(oi.quantity * oi.price_at_purchase), 0)::numeric AS revenue
            FROM vendors v
            JOIN users u ON u.user_id = v.user_id
            JOIN stores s ON s.vendor_id = v.user_id
            JOIN products p ON p.store_id = s.store_id
            JOIN order_items oi ON oi.product_id = p.product_id
            JOIN orders o ON o.order_id = oi.order_id
            WHERE o.status <> 'Cancelled'
            GROUP BY u.user_id, u.name, v.business_name
            ORDER BY revenue DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to load top vendors" });
    }
});

router.get("/analytics/customer-spending", ...adminOnly, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT u.user_id, u.name, u.email,
                   COUNT(o.order_id)::int AS order_count,
                   COALESCE(SUM(o.total_amount), 0)::numeric AS total_spent,
                   COALESCE(AVG(o.total_amount), 0)::numeric AS average_order_value
            FROM users u
            JOIN customers c ON c.user_id = u.user_id
            LEFT JOIN orders o
              ON o.customer_id = c.user_id
             AND o.status <> 'Cancelled'
            GROUP BY u.user_id, u.name, u.email
            HAVING COUNT(o.order_id) > 0
            ORDER BY total_spent DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to load customer spending" });
    }
});

router.get("/analytics/markets", ...adminOnly, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT m.market_id, m.market_name,
                   COUNT(DISTINCT s.store_id)::int AS store_count,
                   COUNT(DISTINCT p.product_id)::int AS product_count,
                   COALESCE(
                       SUM(
                           CASE
                               WHEN o.order_id IS NOT NULL
                               THEN oi.quantity * oi.price_at_purchase
                               ELSE 0
                           END
                       ),
                       0
                   )::numeric AS revenue
            FROM markets m
            LEFT JOIN stores s ON s.market_id = m.market_id
            LEFT JOIN products p ON p.store_id = s.store_id
            LEFT JOIN order_items oi ON oi.product_id = p.product_id
            LEFT JOIN orders o
              ON o.order_id = oi.order_id
             AND o.status <> 'Cancelled'
            GROUP BY m.market_id, m.market_name
            ORDER BY revenue DESC, store_count DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to load market analytics" });
    }
});



module.exports = router;
