import React, { useEffect } from "react";
import "../OrderStyles/MyOrders.css";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import Footer from "../components/Footer";
import { LaunchOutlined } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { getAllMyOrders, removeErrors } from "../features/Order/orderSlice";
import { toast } from "react-toastify";

function MyOrders() {
  const { orders, error } = useSelector((state) => state.order);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(getAllMyOrders());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(t("orders.fetchFailed"), { position: "top-center", autoClose: 3000 });
      dispatch(removeErrors());
    }
  }, [error, dispatch, t]);

  if (orders.length === 0) {
    return (
      <>
        <Navbar />
        <PageTitle title={t("orders.pageTitle")} />
        <div className="empty-cart-container">
          <p className="empty-cart-message">{t("orders.empty")}</p>
          <Link to="/products" className="viewProducts">{t("cart.viewProducts")}</Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <PageTitle title={t("orders.pageTitle")} />

      <div className="my-orders-container">
        <h1>{t("orders.title")}</h1>
        <div className="table-responsive">
          <table className="orders-table">
            <thead>
              <tr>
                <th>{t("orders.orderId")}</th>
                <th>{t("orders.itemCount")}</th>
                <th>{t("orders.status")}</th>
                <th>{t("orders.totalPrice")}</th>
                <th>{t("orders.viewOrder")}</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.orderItems.length}</td>
                  <td>{order.orderStatus}</td>
                  <td>{order.totalPrice}</td>
                  <td><Link to={`/order/${order._id}`} className="order-link"><LaunchOutlined /></Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default MyOrders;
