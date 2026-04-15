import React, { useEffect, useState } from "react";
import "../componentStyles/Navbar.css";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SearchIcon from "@mui/icons-material/Search";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from "react-router-dom";
import "../pageStyles/Search.css";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useSearch } from "../context/SearchContext";
import { logout, removeSuccess } from "../features/user/userSlice";
import { toast } from "react-toastify";
import { CONFIG } from "../config/config";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isTinyScreen, setIsTinyScreen] = useState(window.innerWidth <= 450);
  const { isSearchOpen, setIsSearchOpen } = useSearch();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { cartItems } = useSelector((state) => state.cart);
  const { settings } = useSelector((state) => state.settings);
  const languageCycle = ["en", "ar", "fr"];
  const currentLanguage = i18n.resolvedLanguage || i18n.language || "en";
  const normalizedLanguage = currentLanguage.split("-")[0];
  const currentLanguageIndex = languageCycle.indexOf(normalizedLanguage);
  const nextLanguage = languageCycle[(currentLanguageIndex + 1 + languageCycle.length) % languageCycle.length];

  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);

  useEffect(() => {
    const handleResize = () => {
      const tiny = window.innerWidth <= 450;
      setIsTinyScreen(tiny);
      if (!tiny) {
        setIsProfileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const goTo = (path) => {
    navigate(path);
    setIsProfileMenuOpen(false);
  };

  const toggleLanguage = () => {
    i18n.changeLanguage(nextLanguage);
  };

  const logoutUser = () => {
    dispatch(logout())
      .unwrap()
      .then(() => {
        toast.success(t("navbar.logoutSuccess"), { position: "top-center", autoClose: 3000 });
        dispatch(removeSuccess());
        setIsProfileMenuOpen(false);
      })
      .catch(() => {
        toast.error(t("navbar.logoutFailed"), { position: "top-center", autoClose: 3000 });
      });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      navigate(`/products?keyword=${encodeURIComponent(query)}`);
      setSearchQuery("");
      if (isSearchOpen) toggleSearch();
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link className="Navbar-button navbar-brand-link" to="/" onClick={() => setIsMenuOpen(false)}>
            {settings?.logo ? (
              <img
                src={settings.logo}
                alt={settings?.storeName || CONFIG.appName}
                className="navbar-brand-logo"
              />
            ) : null}
            <span>{settings?.storeName || t("navbar.brand")}</span>
          </Link>
        </div>

        <div className={`navbar-links ${isMenuOpen ? "active" : ""}`}>
          <ul>
            <li><Link to="/" className="Navbar-button">{t("navbar.home")}</Link></li>
            <li><Link to="/products" className="Navbar-button">{t("navbar.products")}</Link></li>
            <li><Link to="/about-us" className="Navbar-button">{t("navbar.aboutUs")}</Link></li>
            <li><Link to="/contact-us" className="Navbar-button">{t("navbar.contactUs")}</Link></li>
          </ul>
        </div>

        <div className="navbar-icons">
          <button
            type="button"
            className="lang-switch-btn"
            onClick={toggleLanguage}
            aria-label={t("navbar.language")}
            title={t("navbar.language")}
          >
            {nextLanguage.toUpperCase()}
          </button>

          <div className="search-container">
            <form className={`search-form ${isSearchOpen ? "active" : ""}`} onSubmit={handleSearchSubmit}>
              <input
                type="text"
                className="search-input"
                placeholder={t("navbar.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="search-button2" onClick={toggleSearch}>
                <SearchIcon focusable="false" className="search-icon" />
              </button>
            </form>
          </div>

          <div className="cart-container">
            <Link to="/cart">
              <ShoppingCartIcon className="icon" />
              <span className="cart-badge">{cartItems.length}</span>
            </Link>
          </div>

          {isAuthenticated ? (
            isTinyScreen ? (
              <div>
                <div className={`overlay ${isProfileMenuOpen ? "show" : ""}`} onClick={toggleProfileMenu}></div>
                <button
                  type="button"
                  className="register-link"
                  aria-label={t("navbar.openProfileMenu")}
                  onClick={toggleProfileMenu}
                  style={{ background: "transparent", padding: 0 }}
                >
                  <img
                    src={user?.avatar?.url || "/images/profile.png"}
                    alt={user?.name || t("navbar.profileAlt")}
                    className="navbar-profile-avatar"
                  />
                </button>

                {isProfileMenuOpen && (
                  <div className="menu-options">
                    {user?.role === "admin" && <button type="button" className="menu-option-btn" onClick={() => goTo("/admin/dashboard")}>{t("navbar.adminDashboard")}</button>}
                    <button type="button" className="menu-option-btn" onClick={() => goTo("/profile")}>{t("navbar.account")}</button>
                    <button type="button" className="menu-option-btn" onClick={() => goTo("/orders/user")}>{t("navbar.orders")}</button>
                    <button type="button" className={`menu-option-btn ${cartItems.length > 0 ? "cart-not-empty" : ""}`} onClick={() => goTo("/cart")}>{t("navbar.cart", { count: cartItems.length })}</button>
                    <button type="button" className="menu-option-btn" onClick={logoutUser}>{t("navbar.logout")}</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/profile" className="profile-link" aria-label={t("navbar.myProfile")}>
                <img
                  src={user?.avatar?.url || "/images/profile.png"}
                  alt={user?.name || t("navbar.profileAlt")}
                  className="navbar-profile-avatar"
                />
                <span className="navbar-profile-name">{user?.name || t("navbar.myProfile")}</span>
              </Link>
            )
          ) : (
            <Link to="/register" className="register-link">
              <PersonAddIcon className="icon" />
            </Link>
          )}

          <div className="navbar-hamburger" onClick={toggleMenu}>
            {isMenuOpen ? <CloseIcon className="icon" /> : <MenuIcon className="icon" />}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
