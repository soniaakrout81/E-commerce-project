return (
  <nav className="navbar">
    
    {/* 🔹 الصف الأول */}
    <div className="navbar-top">
      
      {/* اللوجو */}
      <div className="navbar-logo">
        <Link
          className="Navbar-button navbar-brand-link"
          to="/"
          onClick={() => setIsMenuOpen(false)}
        >
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

      {/* 🔍 السيرش (في النص) */}
      <div className="navbar-search-center">
        <form
          className={`search-form ${isSearchOpen ? "active" : ""}`}
          onSubmit={handleSearchSubmit}
        >
          <input
            type="text"
            className="search-input"
            placeholder={t("navbar.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            className="search-button2"
            onClick={toggleSearch}
          >
            <SearchIcon className="search-icon" />
          </button>
        </form>
      </div>

      {/* 🔸 الأيقونات */}
      <div className="navbar-icons">
        
        {/* اللغة */}
        <button
          type="button"
          className="lang-switch-btn"
          onClick={toggleLanguage}
          aria-label={t("navbar.language")}
        >
          {nextLanguage.toUpperCase()}
        </button>

        {/* السلة */}
        <div className="cart-container">
          <Link to="/cart">
            <ShoppingCartIcon className="icon" />
            <span className="cart-badge">{cartItems.length}</span>
          </Link>
        </div>

        {/* المستخدم */}
        {isAuthenticated ? (
          isTinyScreen ? (
            <div>
              <div
                className={`overlay ${isProfileMenuOpen ? "show" : ""}`}
                onClick={toggleProfileMenu}
              ></div>

              <button
                type="button"
                className="register-link"
                onClick={toggleProfileMenu}
                style={{ background: "transparent", padding: 0 }}
              >
                <img
                  src={user?.avatar?.url || "/images/profile.png"}
                  alt={user?.name}
                  className="navbar-profile-avatar"
                />
              </button>

              {isProfileMenuOpen && (
                <div className="menu-options">
                  {user?.role === "admin" && (
                    <button
                      className="menu-option-btn"
                      onClick={() => goTo("/admin/dashboard")}
                    >
                      {t("navbar.adminDashboard")}
                    </button>
                  )}

                  <button
                    className="menu-option-btn"
                    onClick={() => goTo("/profile")}
                  >
                    {t("navbar.account")}
                  </button>

                  <button
                    className="menu-option-btn"
                    onClick={() => goTo("/orders/user")}
                  >
                    {t("navbar.orders")}
                  </button>

                  <button
                    className="menu-option-btn"
                    onClick={() => goTo("/cart")}
                  >
                    {t("navbar.cart", { count: cartItems.length })}
                  </button>

                  <button
                    className="menu-option-btn"
                    onClick={logoutUser}
                  >
                    {t("navbar.logout")}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/profile" className="profile-link">
              <img
                src={user?.avatar?.url || "/images/profile.png"}
                alt={user?.name}
                className="navbar-profile-avatar"
              />
              <span className="navbar-profile-name">
                {user?.name}
              </span>
            </Link>
          )
        ) : (
          <Link to="/register" className="register-link">
            <PersonAddIcon className="icon" />
          </Link>
        )}

        {/* المينيو (موبايل) */}
        <div className="navbar-hamburger" onClick={toggleMenu}>
          {isMenuOpen ? (
            <CloseIcon className="icon" />
          ) : (
            <MenuIcon className="icon" />
          )}
        </div>
      </div>
    </div>

    {/* 🔻 الصف الثاني (اللينكات) */}
    <div className={`navbar-links-bottom ${isMenuOpen ? "active" : ""}`}>
      <ul>
        <li><Link to="/">{t("navbar.home")}</Link></li>
        <li><Link to="/products">{t("navbar.products")}</Link></li>
        <li><Link to="/about-us">{t("navbar.aboutUs")}</Link></li>
        <li><Link to="/contact-us">{t("navbar.contactUs")}</Link></li>
      </ul>
    </div>

  </nav>
);