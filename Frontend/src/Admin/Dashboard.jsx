import React, { useEffect, useState } from "react";
import "../AdminStyles/Dashboard.css";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import { Inventory, Star, AttachMoney, Error, CheckCircle, Dashboard as DashboardIcon, ShoppingCart, People, KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { fetchAdminProducts, fetchAllOrders } from "../features/admin/adminSlice";

function Dashboard() {
  const dispatch = useDispatch();
  const { products, orders, loading: loadingAdmin } = useSelector((state) => state.admin);
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

  const totalRevenue = orders.filter((order) => order.orderStatus === "Delivered").reduce((acc, order) => acc + order.totalPrice, 0);

  return (
    <>
      <Navbar />
      <PageTitle title={t("admin.dashboard.pageTitle")} />

      <div className={`dashboard-container ${(isTinyScreen && isSidebarOpen) ? "sidebar-open" : "sidebar-closed"}`}>
        {isTinyScreen && (
          <button
            type="button"
            className={`sidebar-toggle ${isSidebarOpen ? "open" : "closed"}`}
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            aria-label={isSidebarOpen ? t("admin.dashboard.closeMenu") : t("admin.dashboard.openMenu")}
          >
            {isSidebarOpen ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
          </button>
        )}

        <div className={`sidebar ${(isTinyScreen && !isSidebarOpen) ? "closed" : "open"}`}>
          <div className="logo">
            <DashboardIcon /> {t("admin.dashboard.title")}
          </div>

          <nav className="nav-menu">
            <div className="nav-section">
              <h3>{t("admin.products.section")}</h3>
              <Link to="/admin/products"><Inventory className="nav-icon" />{t("admin.products.allProducts")}</Link>
              <Link to="/admin/create/product"><Inventory className="nav-icon" />{t("admin.products.createProduct")}</Link>
            </div>
            <div className="nav-section">
              <h3>{t("admin.users.section")}</h3>
              <Link to="/admin/usersList"><People className="nav-icon" />{t("admin.users.allUsers")}</Link>
            </div>
            <div className="nav-section">
              <h3>{t("admin.orders.section")}</h3>
              <Link to="/admin/orders"><ShoppingCart className="nav-icon" />{t("admin.orders.allOrders")}</Link>
            </div>
            <div className="nav-section">
              <h3>{t("admin.reviews.section")}</h3>
              <Link to="/admin/reviews"><Star className="nav-icon" />{t("admin.reviews.allReviews")}</Link>
            </div>
          </nav>
        </div>

        <div className={`main-content ${(isTinyScreen && !isSidebarOpen) ? "sidebar-collapsed" : "sidebar-expanded"}`}>
          <div className="stats-grid">
            <div className="stat-box">
              <Inventory className="icon" />
              <h3>{t("admin.dashboard.totalProducts")}</h3>
              <p>{products.length}</p>
            </div>
            <div className="stat-box">
              <Star className="icon" />
              <h3>{t("admin.dashboard.totalReviews")}</h3>
              <p>{products.reduce((acc, p) => acc + (p.reviews?.length || 0), 0)}</p>
            </div>
            <div className="stat-box">
              <AttachMoney className="icon" />
              <h3>{t("admin.dashboard.totalRevenue")}</h3>
              <p>{totalRevenue} TND</p>
            </div>
            <div className="stat-box">
              <Error className="icon" />
              <h3>{t("admin.dashboard.outOfStock")}</h3>
              <p>{products.filter((p) => p.stock === 0).length}</p>
            </div>
            <div className="stat-box">
              <CheckCircle className="icon" />
              <h3>{t("admin.dashboard.inStock")}</h3>
              <p>{products.filter((p) => p.stock > 0).length}</p>
            </div>
          </div>

          <div className="products-section">
            <h2 className="products-title">{t("admin.dashboard.latestProducts")}</h2>

            {loadingAdmin ? (
              <p>{t("common.loading")}...</p>
            ) : (
              <table className="product-table">
                <thead>
                  <tr>
                    <th>{t("admin.common.no")}</th>
                    <th>{t("admin.common.name")}</th>
                    <th className="Price">{t("product.price")}</th>
                    <th>{t("admin.common.stock")}</th>
                  </tr>
                </thead>
                <tbody>
                  {products.slice(0, 10).map((product, index) => (
                    <tr key={product._id}>
                      <td>{index + 1}</td>
                      <td>{product.name}</td>
                      <td className="Price">${product.price}</td>
                      <td className="Count">{product.stock}</td>
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
