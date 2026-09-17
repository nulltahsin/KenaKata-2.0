import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Markets from "./pages/Markets";
import Stores from "./pages/Stores";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Reservations from "./pages/Reservations";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/admindashboard";
import AddProduct from "./pages/AddProduct";
import VendorDashboard from "./pages/VendorDashboard";


function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>

          <Routes>

            {/* =========================
                PUBLIC ROUTES
            ========================= */}

            <Route
              path="/"
              element={<Home />}
            />

            <Route
              path="/products"
              element={<Products />}
            />

            <Route
              path="/products/:id"
              element={<ProductDetails />}
            />

            <Route
              path="/markets"
              element={<Markets />}
            />

            <Route
              path="/stores"
              element={<Stores />}
            />

            <Route
              path="/cart"
              element={
                <ProtectedRoute roles={['CUSTOMER']}>
                  <Cart />
                </ProtectedRoute>
              }
            />

            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/register"
              element={<Register />}
            />


            {/* =========================
                CUSTOMER PROTECTED ROUTES
            ========================= */}

            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />

            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />

            <Route
              path="/reservations"
              element={
                <ProtectedRoute>
                  <Reservations />
                </ProtectedRoute>
              }
            />

            <Route
              path="/wishlist"
              element={
                <ProtectedRoute roles={['CUSTOMER']}>
                  <Wishlist />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />


            {/* =========================
                SELLER ROUTE
            ========================= */}

            <Route
              path="/seller/dashboard"
              element={
                <ProtectedRoute roles={["VENDOR"]}>
                  <VendorDashboard />
                </ProtectedRoute>
              }
            />


            {/* =========================
                ADMIN ROUTE
            ========================= */}

            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute roles={["ADMIN"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/add-product"
              element={
                <ProtectedRoute roles={["VENDOR"]}>
                  <AddProduct />
                </ProtectedRoute>
              }
            />

          </Routes>

        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}


export default App;