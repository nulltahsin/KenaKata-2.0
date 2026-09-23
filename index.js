const express = require("express");
const cors = require("cors");

// The root entry point runs with the project root as its working directory.
// Load the backend's config explicitly so DB credentials are available here too.
require("dotenv").config({ path: require("path").join(__dirname, "Backend", ".env") });

const pool = require("./Backend/src/config/db");

const app = express();


// middleware
app.use(cors());
app.use(express.json());


// PORT
const PORT = 5000;



// test route
app.get("/", (req, res) => {

    res.send("KenaKata Backend is running!");

});



app.get("/db-test", async (req,res)=>{

    try{

        const result = await pool.query(
            "SELECT NOW()"
        );


        res.json({

            message:"Database connected successfully!",
            time:result.rows[0].now

        });


    }
    catch(error){

        console.error(error);

        res.status(500).json({

            message:"Database connection failed!"

        });

    }

});





// ===============================
// ROUTES
// ===============================


const authRoutes = require("./Backend/src/routes/authRoutes");
const productRoutes = require("./Backend/src/routes/productRoutes");
const cartRoutes = require("./Backend/src/routes/cartRoutes");
const orderRoutes = require("./Backend/src/routes/orderRoutes");
const reservationRoutes = require("./Backend/src/routes/reservationRoutes");
const wishlistRoutes = require("./Backend/src/routes/wishlistRoutes");
const marketRoutes = require("./Backend/src/routes/marketRoutes");
const storeRoutes = require("./Backend/src/routes/storeRoutes");
const reviewRoutes = require("./Backend/src/routes/reviewRoutes");



// mount routes

app.use(
    "/api/auth",
    authRoutes
);


app.use(
    "/api/products",
    productRoutes
);


app.use(
    "/api/cart",
    cartRoutes
);


app.use(
    "/api/orders",
    orderRoutes
);


app.use(
    "/api/reservations",
    reservationRoutes
);


app.use(
    "/api/wishlist",
    wishlistRoutes
);


app.use(
    "/api/markets",
    marketRoutes
);


app.use(
    "/api/stores",
    storeRoutes
);

app.use(
    "/api/reviews",
    reviewRoutes
);







// server start

app.use("/api/admin", require("./Backend/src/routes/adminRoutes"));
async function startServer() {
    try {
        await pool.initializeCustomerTables();
        app.listen(PORT, () => {
            console.log(`KenaKata backend running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Database initialization failed:", error);
        process.exitCode = 1;
    }
}

startServer();
