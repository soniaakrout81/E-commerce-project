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

        <section className="home-featured-strip">
          <div>
            <span>Premium positioning</span>
            <h3>Built to feel like a high-end client delivery, not a generic starter.</h3>
          </div>
          <div className="home-featured-metrics">
            <strong>Fast branding</strong>
            <strong>Reusable admin</strong>
            <strong>Easy handoff</strong>
          </div>
        </section>

        <section className="home-testimonials-grid">
          <article className="home-testimonial-card">
            <p>"The storefront looked custom from day one and gave us a polished launch presence."</p>
            <strong>Fashion Boutique Client</strong>
          </article>
          <article className="home-testimonial-card">
            <p>"We were able to update products, banners, and messaging without touching core code."</p>
            <strong>Electronics Store Owner</strong>
          </article>
          <article className="home-testimonial-card">
            <p>"Exactly the kind of premium reusable setup that makes freelance delivery faster."</p>
            <strong>Furniture Brand Team</strong>
          </article>
        </section>

        <section className="home-newsletter-card">
          <div>
            <p className="home-kicker">Newsletter</p>
            <h3>Capture leads before your client adds advanced email tools.</h3>
            <p className="home-supporting-copy">{settings?.newsletterText}</p>
          </div>
          <form className="home-newsletter-form">
            <input type="email" placeholder="Enter your email address" />
            <button type="button">Subscribe</button>
          </form>
        </section>

        <section className="home-contact-strip">
          <div>
            <p className="home-kicker">Contact</p>
            <h3>{settings?.contactEmail || "hello@example.com"}</h3>
          </div>
          <div className="home-contact-meta">
            <span>{settings?.contactPhone || "+000 000 000"}</span>
            <span>{settings?.address || "Your branded store address"}</span>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}

export default Home;
