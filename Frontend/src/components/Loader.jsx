import React from "react";
import "../componentStyles/Loader.css";
import { useTranslation } from "react-i18next";


function Loader() {
  const { t } = useTranslation();
  return (
    <div className="loader-container">

        <div className="loader">

          <div className='ring'></div>
          <span className='Loding-span'>{t("common.loading")}</span>

        </div>

    </div>
  )
}

export default Loader
