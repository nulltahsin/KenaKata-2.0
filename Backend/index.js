const express = require("express");
const cors = require("cors");
const pool = require("./src/config/db");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;

app.get("/", (req, res) => {
  res.send("KenaKata Backend is running!");
});

app.get("/db-test", async (req, res) => {
  try {
    const pool = require("./src/config/db");
    const result = await pool.query("SELECT NOW()");
    res.json({
      message: "Database connected successfully!",
      time: result.rows[0].now,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Database connection failed!",
    });
  }
});

app.use("/api/users", require("./src/routes/userRoutes"));
app.use("/api/markets", require("./src/routes/marketRoutes"));
app.use("/api/customers", require("./src/routes/customerRoutes"));
app.use("/api/vendors", require("./src/routes/vendorRoutes"));
app.use("/api/stores", require("./src/routes/storeRoutes"));
app.use("/api/categories", require("./src/routes/categoryRoutes"));
app.use("/api/orders", require("./src/routes/orderRoutes"));
app.use("/api/order-items", require("./src/routes/orderItemRoutes"));
app.use("/api/reservations", require("./src/routes/reservationRoutes"));
app.use("/api/wishlist", require("./src/routes/wishlistRoutes"));
app.use("/api/cart", require("./src/routes/cartRoutes"));
app.use("/api/payments", require("./src/routes/paymentRoutes"));

app.use("/api/products", require("./src/routes/productRoutes"));
app.use("/api/auth", require("./src/routes/authRoutes"));

app.use("/api/reviews", require("./src/routes/reviewRoutes"));
app.use("/api/admin", require("./src//routes/adminRoutes"));

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

