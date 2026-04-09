import React, { useEffect } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Product from "../components/Product";
import ImageSlider from "../components/ImageSlider";
import PageTitle from "../components/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { getProduct } from "../features/products/productSlice";
import "../pageStyles/Home.css";

function Home() {
  const { loading, error, products } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(getProduct({}));
  }, [dispatch]);

  return (
    <>
      <Navbar />
      <PageTitle title={t("home.pageTitle")} />
      <ImageSlider />

      <div className="home-container">
        <h2 className="home-heading">{t("home.trendingNow")}</h2>
        <div className="home-product-container">
          {loading && <p>{t("home.loadingProducts")}</p>}
          {error && <p>{t("home.failedLoadProducts")}</p>}
          {!loading && products.length === 0 && <p>{t("home.noProductsFound")}</p>}
          {products.map((product) => (<Product product={product} key={product._id} />))}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Home;
