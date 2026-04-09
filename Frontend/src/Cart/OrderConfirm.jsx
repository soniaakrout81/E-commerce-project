import React from "react";
import "../CartStyles/OrderConfirm.css";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import shippingRates from "../utils/shippingRates";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createOrder, removeSuccess } from "../features/Order/orderSlice";
import { clearCart } from "../features/cart/cartSlice";

function OrderConfirm() {
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const { loading } = useSelector((state) => state.order);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = (shippingInfo && shippingRates[shippingInfo.selectedState]) || 0;
  const total = subtotal + shipping;

  const confirmOrder = () => {
    try {
      const orderData = {
        shippingInfo: {
          address: shippingInfo.address,
          city: shippingInfo.selectedCity,
          state: shippingInfo.selectedState,
          phoneNumber: shippingInfo.phoneNumber,
        },
        orderItems: cartItems.map((item) => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          product: item.product,
        })),
        itemPrice: subtotal,
        shippingPrice: shipping,
        totalPrice: total,
      };

      dispatch(createOrder(orderData))
        .unwrap()
        .then(() => {
          toast.success(t("orderConfirm.success"), { position: "top-center", autoClose: 3000 });
          dispatch(clearCart());
          dispatch(removeSuccess());
          navigate("/orders/user");
        })
        .catch(() => {
          toast.error(t("orderConfirm.createFailed"), { position: "top-center", autoClose: 3000 });
        });
    } catch (error) {
      toast.error(t("orderConfirm.confirmFailed"), { position: "top-center", autoClose: 3000 });
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Navbar />
          <PageTitle title={t("orderConfirm.pageTitle")} />

          <div className="confirm-container">
            <h1 className="confirm-header">{t("orderConfirm.title")}</h1>
            <div className="confirm-table-container">
              <table className="confirm-table">
                <caption>{t("orderConfirm.shippingDetails")}</caption>
                <thead>
                  <tr>
                    <th>{t("user.common.name")}</th>
                    <th>{t("cart.phoneNumber")}</th>
                    <th>{t("cart.address")}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{user.name}</td>
                    <td>{shippingInfo.phoneNumber}</td>
                    <td>{shippingInfo.address}, {shippingInfo.selectedCity}, {shippingInfo.selectedState}, {shippingInfo.pinCode}</td>
                  </tr>
                </tbody>
              </table>

              <table className="confirm-table">
                <caption>{t("orderConfirm.cartItems")}</caption>
                <thead>
                  <tr>
                    <th>{t("orderConfirm.image")}</th>
                    <th>{t("cart.product")}</th>
                    <th>{t("product.price")}</th>
                    <th>{t("cart.quantity")}</th>
                    <th>{t("orderConfirm.totalPrice")}</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.product}>
                      <td><img src={item.image} alt={item.name} className="order-product-image" /></td>
                      <td>{item.name}</td>
                      <td>{item.price}</td>
                      <td>{item.quantity}</td>
                      <td>{item.quantity * item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <table className="confirm-table">
                <caption>{t("orderConfirm.orderSummary")}</caption>
                <thead>
                  <tr>
                    <th>{t("cart.subtotal")}</th>
                    <th>{t("orderConfirm.shippingCharges")}</th>
                    <th>{t("cart.total")}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{subtotal}</td>
                    <td>{shipping}</td>
                    <td>{total}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <button className="proceed-button" onClick={confirmOrder}>{t("orderConfirm.confirmOrder")}</button>
          </div>

          <Footer />
        </>
      )}
    </>
  );
}

export default OrderConfirm;
