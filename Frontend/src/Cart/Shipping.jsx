import React, { useEffect, useState } from "react";
import "../CartStyles/Shipping.css";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CheckoutPath from "./CheckoutPath";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { saveShippingInfo } from "../features/cart/cartSlice";
import { useNavigate } from "react-router-dom";

function Shipping() {
  const { shippingInfo } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [selectedState, setSelectedState] = useState(shippingInfo.selectedState || "");
  const [selectedCity, setSelectedCity] = useState(shippingInfo.selectedCity || "");
  const [cities, setCities] = useState([]);
  const [address, setAddress] = useState(shippingInfo.address || "");
  const [pincode, setPincode] = useState(shippingInfo.pincode || "");
  const [phoneNumber, setPhoneNumber] = useState(shippingInfo.phoneNumber || "");

  const statesAndCities = {
    Tunis: ["Tunis", "Carthage", "Sidi Bou Said", "La Marsa", "Le Kram", "El Menzah", "El Omrane"],
    Ariana: ["Ariana City", "Mnihla", "Raoued", "Ghazela", "La Soukra", "Ettadhamen"],
    "Ben Arous": ["Ben Arous City", "Mornag", "Ezzahra", "Rades", "Hammam Chott", "Bou Mhel"],
    Manouba: ["Manouba City", "Douar Hicher", "Oued Ellil", "Tebourba", "El Battan", "Mornaguia"],
    Nabeul: ["Nabeul City", "Hammamet", "Kelibia", "Beni Khalled", "Korba", "El Haouaria", "Dar Chaabane"],
    Zaghouan: ["Zaghouan City", "Bir Mcherga", "Nadhour", "Zriba", "El Fahs"],
    Bizerte: ["Bizerte City", "Mateur", "Ras Jebel", "Menzel Bourguiba", "Ghar El Melh", "Sejenane"],
    Beja: ["Beja City", "Teboursouk", "Testour", "Medjez El Bab", "Goubellat"],
    Jendouba: ["Jendouba City", "Ghardimaou", "Ain Draham", "Oued Meliz", "Bousalem"],
    Kef: ["Kef City", "El Ksour", "Sakiet Sidi Youssef", "Nebeur", "Tejerouine"],
    Siliana: ["Siliana City", "Bouarada", "El Aroussa", "Gaafour", "Kesra"],
    Sousse: ["Sousse City", "Hammam Sousse", "Akouda", "Enfidha", "Kalaa Kebira", "Kalaa Seghira"],
    Monastir: ["Monastir City", "Bekalta", "Ksibet El Mediouni", "Ksar Hellal", "Teboulba"],
    Mahdia: ["Mahdia City", "Chebba", "El Jem", "Ksour Essef", "Chorbane"],
    Kairouan: ["Kairouan City", "Chebika", "Oueslatia", "Sbikha", "Haffouz"],
    Kasserine: ["Kasserine City", "Foussana", "Sbeitla", "Ezzouhour", "Thala"],
    "Sidi Bouzid": ["Sidi Bouzid City", "Cebbala", "Meknassy", "Bir El Hafey"],
    Sfax: ["Sfax City", "Sakiet Ezzit", "Agareb", "Thyna", "Skhira", "El Ain"],
    Gabes: ["Gabes City", "Mareth", "Matmata", "Ghannouch", "El Hamma"],
    Mednine: ["Mednine City", "Ben Gardane", "Djerba", "Beni Khedache", "Hremta"],
    Tataouine: ["Tataouine City", "Dhiba", "Ghomrassen", "Remada", "Bir Lahmar"],
    Gafsa: ["Gafsa City", "Metlaoui", "Mdhilla", "El Ksar", "Redeyef"],
    Tozeur: ["Tozeur City", "Degache", "Nefta", "Tamerza", "Chebika"],
    Kebili: ["Kebili City", "Douz", "El Faouar", "Kebili Sud", "Souk Lahad"],
  };

  const handleStateChange = (e) => {
    const state = e.target.value;
    setSelectedState(state);
    setCities(statesAndCities[state] || []);
    setSelectedCity("");
  };

  const shippingInfoSubmit = (e) => {
    e.preventDefault();

    if (phoneNumber.length !== 8) {
      toast.error(t("cart.invalidPhone"), { position: "top-center", autoClose: 3000 });
      return;
    }

    if (!selectedState || !selectedCity || !address || !pincode) {
      toast.error(t("cart.fillRequired"), { position: "top-center", autoClose: 3000 });
      return;
    }

    dispatch(saveShippingInfo({ address, pincode, phoneNumber, selectedState, selectedCity }));
    toast.success(t("cart.shippingSaved"), { position: "top-center", autoClose: 3000 });
    navigate("/order/confirm");
  };

  useEffect(() => {
    if (selectedState) {
      setCities(statesAndCities[selectedState] || []);
    }
  }, [selectedState]);

  return (
    <>
      <PageTitle title={t("cart.shippingInfo")} />
      <Navbar />
      <CheckoutPath activePath={0} />

      <div className="shipping-form-container">
        <h1 className="shipping-form-header">{t("cart.shippingDetails")}</h1>
        <form className="shipping-form" onSubmit={shippingInfoSubmit}>
          <div className="shipping-section">
            <div className="shipping-form-group">
              <label htmlFor="address">{t("cart.address")}</label>
              <input type="text" required name="address" id="address" placeholder={t("cart.enterAddress")} value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>

            <div className="shipping-form-group">
              <label htmlFor="pinCode">{t("cart.pinCode")}</label>
              <input type="password" required name="pinCode" id="pinCode" placeholder={t("cart.enterPinCode")} value={pincode} onChange={(e) => setPincode(e.target.value)} />
            </div>

            <div className="shipping-form-group">
              <label htmlFor="phoneNumber">{t("cart.phoneNumber")}</label>
              <input type="number" required name="phoneNumber" id="phoneNumber" placeholder={t("cart.enterPhoneNumber")} value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
            </div>
          </div>

          <div className="shipping-section">
            <div className="shipping-form-group">
              <label htmlFor="state">{t("cart.state")}</label>
              <select name="state" id="state" required value={selectedState} onChange={handleStateChange}>
                <option value="">{t("cart.selectState")}</option>
                {Object.keys(statesAndCities).map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            <div className="shipping-form-group">
              <label htmlFor="city">{t("cart.city")}</label>
              {selectedState ? (
                <select name="city" id="city" required value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
                  <option value="">{t("cart.selectCity")}</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              ) : (
                <select name="city" id="city" disabled>
                  <option value="">{t("cart.selectStateFirst")}</option>
                </select>
              )}
            </div>
          </div>

          <button className="shipping-submit-btn" type="submit">{t("common.continue")}</button>
        </form>
      </div>

      <Footer />
    </>
  );
}

export default Shipping;
