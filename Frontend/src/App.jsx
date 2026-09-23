import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";

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

import AdminDashboard from "./pages/AdminDashboard";
import AddProduct from "./pages/AddProduct";
import VendorDashboard from "./pages/VendorDashboard";

import OrderSuccess from "./pages/OrderSuccess";

import Review from "./pages/Review";

function AdminSessionGuard({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (user?.role === "ADMIN" && location.pathname !== "/admin/dashboard") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
}


function App() {

  return (

    <AuthProvider>

      <CartProvider>

        <WishlistProvider>

          <BrowserRouter>

            <AdminSessionGuard>
            <Routes>


              {/* PUBLIC ROUTES */}

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
                path="/login"
                element={<Login />}
              />


              <Route
                path="/register"
                element={<Register />}
              />





              {/* CUSTOMER ROUTES */}


              <Route
                path="/cart"
                element={
                  <ProtectedRoute roles={["CUSTOMER"]}>
                    <Cart />
                  </ProtectedRoute>
                }
              />



              <Route
                path="/checkout"
                element={
                  <ProtectedRoute roles={["CUSTOMER"]}>
                    <Checkout />
                  </ProtectedRoute>
                }
              />



              <Route
                path="/orders"
                element={
                  <ProtectedRoute roles={["CUSTOMER"]}>
                    <Orders />
                  </ProtectedRoute>
                }
              />

              <Route
  path="/review/:id"
  element={
    <ProtectedRoute roles={["CUSTOMER"]}>
      <Review />
    </ProtectedRoute>
  }
/>



              {/* ORDER SUCCESS PAGE */}

              <Route
                path="/order-success/:id"
                element={
                  <ProtectedRoute roles={["CUSTOMER"]}>
                    <OrderSuccess />
                  </ProtectedRoute>
                }
              />



              <Route
                path="/reservations"
                element={
                  <ProtectedRoute roles={["CUSTOMER"]}>
                    <Reservations />
                  </ProtectedRoute>
                }
              />



              <Route
                path="/wishlist"
                element={
                  <ProtectedRoute roles={["CUSTOMER"]}>
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






              {/* VENDOR ROUTES */}


              <Route
                path="/seller/dashboard"
                element={
                  <ProtectedRoute roles={["VENDOR"]}>
                    <VendorDashboard />
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






              {/* ADMIN ROUTE */}


              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute roles={["ADMIN"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<Navigate to="/" replace />} />



            </Routes>
            </AdminSessionGuard>


          </BrowserRouter>

        </WishlistProvider>

      </CartProvider>

    </AuthProvider>

  );

}


export default App;
