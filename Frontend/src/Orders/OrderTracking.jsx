import React, { useEffect, useMemo, useState } from "react";
import { LocalShipping, Search, Inventory2, CheckCircle } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageTitle from "../components/PageTitle";
import { getOrderDetails, removeErrors } from "../features/Order/orderSlice";
import "../OrderStyles/OrderTracking.css";

function OrderTracking() {
  const dispatch = useDispatch();
  const { order, loading, error } = useSelector((state) => state.order);
  const [orderId, setOrderId] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (error && hasSearched) {
      toast.error(error, { position: "top-center", autoClose: 3000 });
      dispatch(removeErrors());
    }
  }, [dispatch, error, hasSearched]);

  const trackingSteps = useMemo(() => {
    const status = order?.orderStatus;
    return [
      { label: "Order placed", active: Boolean(order?._id), icon: <Inventory2 /> },
      { label: "Processing", active: status === "Processing" || status === "Delivered", icon: <LocalShipping /> },
      { label: "Delivered", active: status === "Delivered", icon: <CheckCircle /> },
    ];
  }, [order]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!orderId.trim()) {
      toast.error("Enter an order id first.", { position: "top-center", autoClose: 2500 });
      return;
    }

    setHasSearched(true);
    dispatch(getOrderDetails(orderId.trim()));
  };

  return (
    <>
      <Navbar />
      <PageTitle title="Track Order" />

      <div className="order-tracking-page">
        <section className="tracking-hero-card">
          <p className="tracking-kicker">Order Tracking</p>
          <h1>Track your order in one place</h1>
          <p>Paste your order id to check the current fulfillment status and shipping details.</p>

          <form className="tracking-search-form" onSubmit={handleSubmit}>
            <input
              type="text"
              value={orderId}
              onChange={(event) => setOrderId(event.target.value)}
              placeholder="Enter your order id"
            />
            <button type="submit" disabled={loading}>
              <Search fontSize="small" />
              {loading ? "Checking..." : "Track order"}
            </button>
          </form>
        </section>

        {hasSearched && order?._id ? (
          <section className="tracking-result-card">
            <div className="tracking-top">
              <div>
                <span className="tracking-label">Order ID</span>
                <h2>{order._id}</h2>
              </div>
              <div className={`tracking-badge ${order.orderStatus === "Delivered" ? "delivered" : "processing"}`}>
                {order.orderStatus}
              </div>
            </div>

            <div className="tracking-steps">
              {trackingSteps.map((step) => (
                <div key={step.label} className={`tracking-step ${step.active ? "active" : ""}`}>
                  <div className="tracking-icon">{step.icon}</div>
                  <div>
                    <strong>{step.label}</strong>
                  </div>
                </div>
              ))}
            </div>

            <div className="tracking-summary-grid">
              <article>
                <h3>Shipping</h3>
                <p>{order?.shippingInfo?.address || "No address provided"}</p>
                <p>{order?.shippingInfo?.phoneNumber || "No phone number provided"}</p>
              </article>
              <article>
                <h3>Order summary</h3>
                <p>{order?.orderItems?.length || 0} items</p>
                <p>Total: {order?.totalPrice}</p>
                <p>Shipping: {order?.shippingPrice}</p>
              </article>
            </div>
          </section>
        ) : null}
      </div>

      <Footer />
    </>
  );
}

export default OrderTracking;
