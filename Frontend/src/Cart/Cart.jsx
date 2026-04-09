import React, { useEffect } from "react";
import "../CartStyles/Cart.css";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CartItem from "./CartItem";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import Loader from "../components/Loader";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Cart() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { cartItems, loading } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.user);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = 50;

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error(t("cart.mustLogin"), { position: "top-center", autoClose: 3000 });
      navigate("/");
    }
  }, [isAuthenticated, navigate, t]);

  if (loading) return <Loader />;

  const checkoutHandler = () => {
    navigate("/shipping");
  };

  return (
    <>
      <Navbar />
      <PageTitle title={t("cart.pageTitle")} />

      {cartItems.length === 0 ? (
        <div className="empty-cart-container">
          <p className="empty-cart-message">{t("cart.empty")}</p>
          <Link to="/products" className="viewProducts">
            {t("cart.viewProducts")}
          </Link>
        </div>
      ) : (
        <div className="cart-page">
          <div className="cart-items">
            <div className="cart-items-heading">{t("cart.yourCart")}</div>

            <div className="cart-table-header">
              <div className="header-product">{t("cart.product")}</div>
              <div className="header-quantity">{t("cart.quantity")}</div>
              <div className="header-total item-total-heading">{t("cart.itemTotalPrice")}</div>
              <div className="header-action item-total-heading">{t("cart.actions")}</div>
            </div>

            {cartItems && cartItems.map((item) => <CartItem key={item.product} item={item} />)}
          </div>

          <div className="price-summary">
            <h3 className="price-summary-heading">{t("cart.priceSummary")}</h3>
            <div className="summary-item">
              <p className="summary-label">{t("cart.subtotal")} :</p>
              <p className="summary-value">{subtotal}</p>
            </div>
            <div className="summary-item">
              <p className="summary-label">{t("cart.shipping")} :</p>
              <p className="summary-value">{shipping}</p>
            </div>
            <div className="summary-total">
              <p>{t("cart.total")} :</p>
              <p>{subtotal + shipping}</p>
            </div>
            <button className="checkout-btn" onClick={checkoutHandler}>{t("cart.proceedCheckout")}</button>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default Cart;
