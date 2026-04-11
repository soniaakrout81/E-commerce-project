import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/Home.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Products from "./pages/Products";
import Register from "./User/Register.jsx";
import Login from "./User/Login.jsx";
import { loadUser } from "./features/user/userSlice.js";
import UserDashboard from "./User/UserDashboard.jsx";
import Profile from "./User/Profile.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import UpdateProfile from "./User/UpdateProfile.jsx";
import UpdatePassword from "./User/UpdatePassword.jsx";
import ForgotPassword from "./User/ForgotPassword.jsx";
import ResetPassword from "./User/ResetPassword.jsx";
import Cart from "./Cart/Cart.jsx";
import Shipping from "./Cart/Shipping.jsx";
import OrderConfirm from "./Cart/OrderConfirm.jsx";
import MyOrders from "./Orders/MyOrders.jsx";
import OrderDetails from "./Orders/OrderDetails.jsx";
import Dashboard from "./Admin/Dashboard.jsx";
import ProductsList from "./Admin/ProductsList.jsx";
import CreateProduct from "./Admin/CreateProduct.jsx";
import UpdateProduct from "./Admin/UpdateProduct.jsx";
import UpdateRole from "./Admin/UpdateRole.jsx";
import OrdersList from "./Admin/OrdersList.jsx";
import UpdateOrderStatus from "./Admin/UpdateOrderStatus.jsx";
import UsersList from "./Admin/UsersList.jsx";
import Reviews from "./Admin/ReviewsList.jsx";
import { SearchProvider } from "./context/SearchContext.jsx";
import { CONFIG } from "../src/config/config.js";

function App() {
  const { isAuthenticated, user } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const { i18n } = useTranslation();

  useEffect(() => {

      dispatch(loadUser());
      
  }, [dispatch]);
  useEffect(() => {

    document.title = CONFIG.appName;

  })

  return (
    <SearchProvider>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/products" element={<Products />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
        <Route path="/profile/update" element={<ProtectedRoute element={<UpdateProfile />} />} />
        <Route path="/password/change" element={<ProtectedRoute element={<UpdatePassword />} />} />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/reset/:token" element={<ResetPassword />} />

        <Route path="/cart" element={<ProtectedRoute element={<Cart />} />} />
        <Route path="/shipping" element={<ProtectedRoute element={<Shipping />} />} />
        <Route path="/order/confirm" element={<ProtectedRoute element={<OrderConfirm />} />} />
        <Route path="/orders/user" element={<ProtectedRoute element={<MyOrders />} />} />
        <Route path="/order/:id" element={<ProtectedRoute element={<OrderDetails />} />} />

        {/* Admin */}
        <Route path="/admin/dashboard" element={<ProtectedRoute element={<Dashboard />} adminOnly />} />
        <Route path="/admin/products" element={<ProtectedRoute element={<ProductsList />} adminOnly />} />
        <Route path="/admin/create/product" element={<ProtectedRoute element={<CreateProduct />} adminOnly />} />
        <Route path="/admin/product/:id" element={<ProtectedRoute element={<UpdateProduct />} adminOnly />} />
        <Route path="/admin/usersList" element={<ProtectedRoute element={<UsersList />} adminOnly />} />
        <Route path="/admin/user/:id" element={<ProtectedRoute element={<UpdateRole />} adminOnly />} />
        <Route path="/admin/orders" element={<ProtectedRoute element={<OrdersList />} adminOnly />} />
        <Route path="/admin/orderUpdate/:id" element={<ProtectedRoute element={<UpdateOrderStatus />} adminOnly />} />
        <Route path="/admin/reviews" element={<ProtectedRoute element={<Reviews />} adminOnly />} />
      </Routes>

      {isAuthenticated && <UserDashboard user={user} />}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={i18n.dir() === "rtl"}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

    </SearchProvider>
  );
}

export default App;
