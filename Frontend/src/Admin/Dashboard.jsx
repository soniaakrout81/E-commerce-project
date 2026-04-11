import React, { useEffect, useState, useMemo } from "react";
import "../AdminStyles/Dashboard.css";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import {
  Inventory,
  Star,
  AttachMoney,
  Error,
  CheckCircle,
  Dashboard as DashboardIcon,
  ShoppingCart,
  People,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { fetchAdminProducts, fetchAllOrders } from "../features/admin/adminSlice";

function Dashboard() {
  const dispatch = useDispatch();
  const { products, orders, loading: loadingAdmin } = useSelector(
    (state) => state.admin
  );

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isTinyScreen, setIsTinyScreen] = useState(window.innerWidth <= 450);
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(fetchAdminProducts());
    dispatch(fetchAllOrders());
  }, [dispatch]);

  useEffect(() => {
    const handleResize = () => {
      const tiny = window.innerWidth <= 450;
      setIsTinyScreen(tiny);
      if (!tiny) setIsSidebarOpen(true);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalRevenue = useMemo(() => {
    return orders
      .filter((order) => order.orderStatus === "Delivered")
      .reduce((acc, order) => acc + order.totalPrice, 0);
  }, [orders]);

  const totalReviews = useMemo(() => {
    return products.reduce((acc, p) => acc + (p.reviews?.length || 0), 0);
  }, [products]);

  const outOfStock = products.filter((p) => p.stock <= 0).length;
  const inStock = products.filter((p) => p.stock > 0).length;

  return (
    <>
      <Navbar />
      <PageTitle title={t("admin.dashboard.pageTitle")} />

      <div
        className={`dashboard-container ${
          isTinyScreen && isSidebarOpen ? "sidebar-open" : "sidebar-closed"
        }`}
      >
        {isTinyScreen && (
          <button
            type="button"
            className={`sidebar-toggle ${isSidebarOpen ? "open" : "closed"}`}
            onClick={() => setIsSidebarOpen((prev) => !prev)}
          >
            {isSidebarOpen ? (
              <KeyboardArrowLeft />
            ) : (
              <KeyboardArrowRight />
            )}
          </button>
        )}

        {/* SIDEBAR */}
        <div
          className={`sidebar ${
            isTinyScreen && !isSidebarOpen ? "closed" : "open"
          }`}
        >
          <div className="logo">
            <DashboardIcon /> {t("admin.dashboard.title")}
          </div>

          <nav className="nav-menu">
            <div className="nav-section">
              <h3>{t("admin.products.section")}</h3>
              <Link to="/admin/products">
                <Inventory className="nav-icon" />
                {t("admin.products.allProducts")}
              </Link>
              <Link to="/admin/create/product">
                <Inventory className="nav-icon" />
                {t("admin.products.createProduct")}
              </Link>
            </div>

            <div className="nav-section">
              <h3>{t("admin.users.section")}</h3>
              <Link to="/admin/usersList">
                <People className="nav-icon" />
                {t("admin.users.allUsers")}
              </Link>
            </div>

            <div className="nav-section">
              <h3>{t("admin.orders.section")}</h3>
              <Link to="/admin/orders">
                <ShoppingCart className="nav-icon" />
                {t("admin.orders.allOrders")}
              </Link>
            </div>

            <div className="nav-section">
              <h3>{t("admin.reviews.section")}</h3>
              <Link to="/admin/reviews">
                <Star className="nav-icon" />
                {t("admin.reviews.allReviews")}
              </Link>
            </div>
          </nav>
        </div>

        {/* MAIN */}
        <div
          className={`main-content ${
            isTinyScreen && !isSidebarOpen
              ? "sidebar-collapsed"
              : "sidebar-expanded"
          }`}
        >
          {/* TOPBAR */}
          <div className="dashboard-topbar">
            <h2>Welcome back 👋 Admin</h2>
            <p>Here’s what’s happening with your store today</p>
          </div>

          {/* STATS */}
          <div className="stats-grid">
            <div className="stat-box">
              <Inventory className="icon" />
              <h3>Total Products</h3>
              <p>{products.length}</p>
              <span className="trend up">+5% this week</span>
            </div>

            <div className="stat-box">
              <Star className="icon" />
              <h3>Total Reviews</h3>
              <p>{totalReviews}</p>
              <span className="trend up">+2% this week</span>
            </div>

            <div className="stat-box revenue">
              <AttachMoney className="icon" />
              <h3>Total Revenue</h3>
              <p>{totalRevenue.toLocaleString()} TND</p>
              <span className="trend up">+12% this month</span>
            </div>

            <div className="stat-box">
              <Error className="icon" />
              <h3>Out of Stock</h3>
              <p>{outOfStock}</p>
              <span className="trend down">-1%</span>
            </div>

            <div className="stat-box">
              <CheckCircle className="icon" />
              <h3>In Stock</h3>
              <p>{inStock}</p>
              <span className="trend up">+3%</span>
            </div>
          </div>

          {/* CHART PLACEHOLDER */}
          <div className="chart-placeholder">
            📊 Revenue Overview (Chart coming soon)
          </div>

          {/* TABLE */}
          <div className="products-section">
            <h2 className="products-title">
              {t("admin.dashboard.latestProducts")}
            </h2>

            {loadingAdmin ? (
              <p>{t("common.loading")}...</p>
            ) : (
              <table className="product-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Stock</th>
                  </tr>
                </thead>

                <tbody>
                  {products.slice(0, 10).map((product, index) => (
                    <tr key={product._id} className="table-row">
                      <td>{index + 1}</td>
                      <td>{product.name}</td>
                      <td>${product.price}</td>
                      <td>
                        <span
                          className={
                            product.stock > 0 ? "stock-good" : "stock-bad"
                          }
                        >
                          {product.stock}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;