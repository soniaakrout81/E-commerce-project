import React from "react";
import {
  Dashboard as DashboardIcon,
  Inventory,
  ShoppingCart,
  People,
  Star,
  Settings,
  ViewCarousel,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

function AdminSidebar() {
  return (
    <div className="sidebar open">
      <div className="logo">
        <DashboardIcon /> Dashboard
      </div>

      <nav className="nav-menu">
        <div className="nav-section">
          <h3>Products</h3>
          <Link to="/admin/products">
            <Inventory /> All Products
          </Link>
          <Link to="/admin/create/product">
            <Inventory /> Create Product
          </Link>
        </div>

        <div className="nav-section">
          <h3>Users</h3>
          <Link to="/admin/usersList">
            <People /> Users
          </Link>
        </div>

        <div className="nav-section">
          <h3>Orders</h3>
          <Link to="/admin/orders">
            <ShoppingCart /> Orders
          </Link>
        </div>

        <div className="nav-section">
          <h3>Reviews</h3>
          <Link to="/admin/reviews">
            <Star /> Reviews
          </Link>
        </div>

        <div className="nav-section">
          <h3>Store</h3>
          <Link to="/admin/settings">
            <Settings /> Settings
          </Link>
          <Link to="/admin/banners">
            <ViewCarousel /> Banners
          </Link>
        </div>
      </nav>
    </div>
  );
}

export default AdminSidebar;
