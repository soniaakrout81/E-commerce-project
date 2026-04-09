import React from "react";
import { Phone, Mail, Instagram } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import "../componentStyles/Footer.css";

function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section contact">
          <h3>{t("footer.contactUs")}</h3>
          <p><Phone fontSize="small" />{t("footer.phone")} : 99152163</p>
          <p><Mail fontSize="small" />{t("footer.email")} : soniaakrout81@gmail.com</p>
        </div>

        <div className="footer-section social">
          <h3>{t("footer.followMe")}</h3>
          <div className="social-links">
            <a href="https://www.instagram.com/abdousas_/b" target="_blank" rel="noreferrer">
              <Instagram className="social-icon" />
            </a>
          </div>
        </div>

        <div className="footer-section about">
          <h3>{t("footer.aboutUs")}</h3>
          <p>{t("footer.sellingProducts")}</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {t("footer.copyright", { year })}</p>
      </div>
    </footer>
  );
}

export default Footer;
