import React, { useEffect, useState } from "react";
import "../AdminStyles/UpdateOrder.css";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { fetchAllOrders, updateOrderStatus, removeErrors, removeSuccess } from "../features/admin/adminSlice";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

function UpdateOrderStatus() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { orders, loading } = useSelector((state) => state.admin);

  const [status, setStatus] = useState("");

  const order = orders.find((o) => o._id === id);

  useEffect(() => {
    if (!orders || orders.length === 0) {
      dispatch(fetchAllOrders());
    }
  }, [dispatch, orders]);

  useEffect(() => {
    if (order) {
      setStatus(order.orderStatus || "");
    }
  }, [order]);

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(updateOrderStatus({ id, status }))
      .unwrap()
      .then(() => {
        toast.success(t("admin.orders.statusUpdated"), {
          position: "top-center",
          autoClose: 3000,
        });
        dispatch(removeSuccess());
        navigate("/admin/orders");
      })
      .catch(() => {
        toast.error(t("admin.orders.statusUpdateFailed"), {
          position: "top-center",
          autoClose: 3000,
        });
        dispatch(removeErrors());
      });
  };

  if (loading) return <Loader />

  return (
    <>
      <Navbar />
      <PageTitle title={t("admin.orders.updateStatus")} />

      <div className="order-container">
        <h1>{t("admin.orders.updateStatus")}</h1>
        {order ? (
          <form className="update-order-status-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="id">{t("orders.orderId")}</label>
              <input type="text" id="id" readOnly value={order._id} />
            </div>

            <div className="form-group">
              <label htmlFor="status">{t("orders.status")}</label>
              <select
                id="status"
                required
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">{t("admin.orders.selectStatus")}</option>
                <option value="Processing">{t("orders.processing")}</option>
                <option value="Delivered">{t("orders.delivered")}</option>
              </select>
            </div>

            <button className="btn btn-primary">{t("admin.orders.updateStatus")}</button>
          </form>
        ) : (
          <p>{t("admin.orders.noOrderFound")}</p>
        )}
      </div>
    </>
  );
}

export default UpdateOrderStatus;
