const express = require("express");
const cors = require("cors");

const pool = require("./src/config/db");

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


const authRoutes = require("./src/routes/authRoutes");
const productRoutes = require("./src/routes/productRoutes");
const cartRoutes = require("./src/routes/cartRoutes");
const orderRoutes = require("./src/routes/orderRoutes");
const reservationRoutes = require("./src/routes/reservationRoutes");
const wishlistRoutes = require("./src/routes/wishlistRoutes");
const marketRoutes = require("./src/routes/marketRoutes");
const storeRoutes = require("./src/routes/storeRoutes");
const reviewRoutes = require("./src/routes/reviewRoutes");



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

app.listen(PORT,()=>{

    console.log(
        `KenaKata backend running on http://localhost:${PORT}`
    );

});