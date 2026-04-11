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

  /* ===================== */
  /* 🧠 REAL STATS */
  /* ===================== */

  const stats = useMemo(() => {
    const totalProducts = products.length;

    const totalReviews = products.reduce(
      (acc, p) => acc + (p.reviews?.length || 0),
      0
    );

    const inStock = products.filter((p) => p.stock > 0).length;
    const outOfStock = products.filter((p) => p.stock <= 0).length;

    const totalRevenue = orders
      .filter((o) => o.orderStatus === "Delivered")
      .reduce((acc, o) => acc + o.totalPrice, 0);

    return {
      totalProducts,
      totalReviews,
      inStock,
      outOfStock,
      totalRevenue,
    };
  }, [products, orders]);

  /* ===================== */
  /* 📊 TIME RANGE (7 DAYS) */
  /* ===================== */

  const now = new Date();
  const last7Days = new Date();
  last7Days.setDate(now.getDate() - 7);

  const last14Days = new Date();
  last14Days.setDate(now.getDate() - 14);

  /* ===================== */
  /* 📈 GROWTH CALCULATION */
  /* ===================== */

  const productGrowth = useMemo(() => {
    const thisWeek = products.filter(
      (p) => new Date(p.createdAt) > last7Days
    ).length;

    const lastWeek = products.filter((p) => {
      const d = new Date(p.createdAt);
      return d < last7Days && d > last14Days;
    }).length;

    if (lastWeek === 0) return 100;
    return ((thisWeek - lastWeek) / lastWeek) * 100;
  }, [products]);

  const revenueGrowth = useMemo(() => {
    const thisWeekRevenue = orders
      .filter(
        (o) =>
          o.orderStatus === "Delivered" &&
          new Date(o.createdAt) > last7Days
      )
      .reduce((acc, o) => acc + o.totalPrice, 0);

    const lastWeekRevenue = orders
      .filter(
        (o) =>
          o.orderStatus === "Delivered" &&
          new Date(o.createdAt) <= last7Days
      )
      .reduce((acc, o) => acc + o.totalPrice, 0);

    if (lastWeekRevenue === 0) return 100;
    return ((thisWeekRevenue - lastWeekRevenue) / lastWeekRevenue) * 100;
  }, [orders]);

  const reviewGrowth = useMemo(() => {
    const thisWeek = products
      .flatMap((p) => p.reviews || [])
      .filter((r) => new Date(r.createdAt) > last7Days).length;

    const lastWeek = products
      .flatMap((p) => p.reviews || [])
      .filter((r) => {
        const d = new Date(r.createdAt);
        return d < last7Days && d > last14Days;
      }).length;

    if (lastWeek === 0) return 100;
    return ((thisWeek - lastWeek) / lastWeek) * 100;
  }, [products]);

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
              <p>{stats.totalProducts}</p>
              <span className={`trend ${productGrowth >= 0 ? "up" : "down"}`}>
                {productGrowth.toFixed(1)}%
              </span>
            </div>

            <div className="stat-box">
              <Star className="icon" />
              <h3>Total Reviews</h3>
              <p>{stats.totalReviews}</p>
              <span className={`trend ${reviewGrowth >= 0 ? "up" : "down"}`}>
                {reviewGrowth.toFixed(1)}%
              </span>
            </div>

            <div className="stat-box">
              <AttachMoney className="icon" />
              <h3>Total Revenue</h3>
              <p>{stats.totalRevenue.toLocaleString()} TND</p>
              <span className={`trend ${revenueGrowth >= 0 ? "up" : "down"}`}>
                {revenueGrowth.toFixed(1)}%
              </span>
            </div>

            <div className="stat-box">
              <Error className="icon" />
              <h3>Out of Stock</h3>
              <p>{stats.outOfStock}</p>
            </div>

            <div className="stat-box">
              <CheckCircle className="icon" />
              <h3>In Stock</h3>
              <p>{stats.inStock}</p>
            </div>
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