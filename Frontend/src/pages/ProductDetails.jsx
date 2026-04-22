import React, { useEffect, useState } from "react";
import "../pageStyles/ProductDetails.css";
import PageTitle from "../components/PageTitle";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Rating from "../components/Rating";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getProductDetails, createReview, removeSuccess, removeErrors } from "../features/products/productSlice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import MetaTags from "../components/MetaTags";
import { addItemsToCart, removeMessage, removeErrors as removeCartErrors } from "../features/cart/cartSlice";

function ProductDetails() {
  const [quantity, setQuantity] = useState(1);
  const [comment, setComment] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [userRating, setUserRating] = useState(0);

  const dispatch = useDispatch();
  const { id } = useParams();
  const { t } = useTranslation();

  const { loading, error, product, reviewSuccess, reviewLoading } = useSelector((state) => state.product);
  const { loading: cartLoading, message, error: cartError } = useSelector((state) => state.cart);

  const increase = () => {
    if (quantity >= product.stock) {
      toast.error(t("productDetails.quantityStock"), { position: "top-center", autoClose: 3000 });
    } else {
      setQuantity((prev) => prev + 1);
    }
  };

  const decrease = () => {
    if (quantity <= 1) {
      toast.error(t("productDetails.quantityMin"), { position: "top-center", autoClose: 3000 });
    } else {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleRatingChange = (newRating) => setUserRating(newRating || 0);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!userRating) {
      toast.error(t("productDetails.selectRating"), { position: "top-center", autoClose: 3000 });
      return;
    }
    dispatch(createReview({ rating: userRating, comment, productId: id }));
  };

  const addToCart = () => {
    if (!product || product.stock === 0) {
      toast.error(t("productDetails.outOfStock"), { position: "top-center", autoClose: 3000 });
      return;
    }
    dispatch(addItemsToCart({ id, quantity }));
  };

  useEffect(() => {
    if (id) dispatch(getProductDetails(id));
    return () => dispatch(removeErrors());
  }, [dispatch, id]);

  useEffect(() => {
    if (error) {
      toast.error(t("productDetails.loadFailed"), { position: "top-center", autoClose: 3000 });
      dispatch(removeErrors());
    }
  }, [dispatch, error, t]);

  useEffect(() => {
    if (message) {
      toast.success(message, { position: "top-center", autoClose: 3000 });
      dispatch(removeMessage());
    }
  }, [message, dispatch]);

  useEffect(() => {
    if (cartError) {
      toast.error(cartError, { position: "top-center", autoClose: 3000 });
      dispatch(removeCartErrors());
    }
  }, [cartError, dispatch]);

  useEffect(() => {
    if (reviewSuccess) {
      toast.success(t("productDetails.reviewSuccess"), { position: "top-center", autoClose: 3000 });
      setUserRating(0);
      setComment("");
      dispatch(removeSuccess());
      dispatch(getProductDetails(id));
    }
  }, [reviewSuccess, id, dispatch, t]);

  useEffect(() => {
    if (product && product.image && product.image.length > 0) {
      setSelectedImage(product.image[0].url);
    }
  }, [product]);

  if (loading || cartLoading || reviewLoading) return <Loader />;
  if (error || !product) {
    return (
      <>
        <PageTitle title={t("productDetails.pageTitle")} />
        <Navbar />
        <Footer />
      </>
    );
  }

  return (
    <>
      <PageTitle title={`${product?.name} - ${t("productDetails.pageSuffix")}`} />
      <MetaTags
        title={`${product?.name} | Store`}
        description={product?.description}
        keywords={product?.keywords || product?.name}
      />
      <Navbar />

      <div className="product-details-container">
        <div className="product-detail-container">
          <div className="product-image-container">
            <img src={selectedImage} alt={product?.name || t("productDetails.productAlt")} className="product-detail-image" />

            {product.image.length > 1 && (
              <div className="product-thumbnails">
                {product.image.map((img, index) => (
                  <img src={img.url} alt={`${t("productDetails.thumbnail")} ${index + 1}`} className="thumbnail-image" onClick={() => setSelectedImage(img.url)} key={img.url} />
                ))}
              </div>
            )}
          </div>

          <div className="product-info">
            <h2>{product.name}</h2>
            <p className="product-description">{product.description}</p>
            <p className="product-price">{t("product.price")} : {product.price}</p>

            <div className="product-rating">
              <Rating value={product.ratings} disabled={true} />
              <span className="productCardSpan">({product.numOfReviews} {product.numOfReviews === 1 ? t("product.review") : t("product.reviews")})</span>
            </div>

            <div className="stock-status">
              <span className="in-stock" style={{ color: product.stock === 0 ? "#B12704" : "#02bf02" }}>
                {product.stock === 0 ? t("productDetails.outOfStockLabel") : t("productDetails.inStock", { count: product.stock })}
              </span>
            </div>

            {product.stock > 0 && (
              <div className="quantity-controls">
                <span className="quantity-label">{t("productDetails.quantity")}:</span>
                <button className="quantity-button" onClick={decrease}>-</button>
                <input type="text" value={quantity} className="quantity-value" readOnly />
                <button className="quantity-button" onClick={increase}>+</button>
              </div>
            )}

            <button className="add-to-cart-btn" onClick={addToCart}>{t("product.addToCart")}</button>

            <form className="review-form" onSubmit={handleReviewSubmit}>
              <h3>{t("productDetails.writeReview")}</h3>
              <Rating value={userRating || 0} onRatingChange={handleRatingChange} disabled={false} />
              <textarea placeholder={t("productDetails.reviewPlaceholder")} required className="review-input" value={comment} onChange={(e) => setComment(e.target.value)}></textarea>
              <button className="submit-review-btn" disabled={reviewLoading}>{t("productDetails.submitReview")}</button>
            </form>
          </div>
        </div>
      </div>

      <div className="reviews-container">
        <h3>{t("productDetails.customerReviews")} :</h3>
        {product.reviews && product.reviews.length > 0 ? (
          <div className="review-section">
            {product.reviews.map((review, index) => (
              <div className="review-item" key={index}>
                <div className="review-header">
                  <p className="review-name">{review.name}</p>
                  <Rating value={review.rating} disabled={true} />
                </div>
                <p>{t("productDetails.comment")} :</p>
                <p className="review-comment">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-reviews">{t("productDetails.noReviews")}</p>
        )}
      </div>

      <Footer />
    </>
  );
}

export default ProductDetails;
