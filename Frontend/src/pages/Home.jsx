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
  const { settings } = useSelector((state) => state.settings);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const featuredProducts = products.slice(0, 8);

  useEffect(() => {
    dispatch(getProduct({}));
  }, [dispatch]);

  return (
    <>
      <Navbar />
      <PageTitle title={t("home.pageTitle")} />
      <ImageSlider />

      <div className="home-container">
        <section className="home-intro-card">
          <p className="home-kicker">{settings?.tagline}</p>
          <h2 className="home-heading">{t("home.trendingNow")}</h2>
          <p className="home-supporting-copy">{settings?.newsletterText}</p>
        </section>

        <h2 className="home-heading">{t("home.trendingNow")}</h2>
        <div className="home-product-container">
          {loading && <p>{t("home.loadingProducts")}</p>}
          {error && <p>{t("home.failedLoadProducts")}</p>}
          {!loading && products.length === 0 && <p>{t("home.noProductsFound")}</p>}
          {featuredProducts.map((product) => (<Product product={product} key={product._id} />))}
        </div>

        <section className="home-promo-grid">
          <article className="home-promo-card">
            <span>01</span>
            <h3>Brand-ready storefront</h3>
            <p>Swap logos, colors, and homepage copy to fit each new client quickly.</p>
          </article>
          <article className="home-promo-card">
            <span>02</span>
            <h3>Admin workflows included</h3>
            <p>Products, orders, customers, and store operations are already wired in.</p>
          </article>
          <article className="home-promo-card">
            <span>03</span>
            <h3>Deployment-friendly stack</h3>
            <p>Launch on Vercel, Railway, and MongoDB Atlas with minimal project edits.</p>
          </article>
        </section>
      </div>

      <Footer />
    </>
  );
}

export default Home;
