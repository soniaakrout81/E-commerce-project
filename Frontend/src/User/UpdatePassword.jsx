import React, { useState } from "react";
import "../UserStyles/Form.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useDispatch, useSelector } from "react-redux";
import PageTitle from "../components/PageTitle";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { changePassword, removeSuccess } from "../features/user/userSlice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";

function UpdatePassword() {


  const { loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();


  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const updatePasswordSubmit = (e) => {

    e.preventDefault();
    const formData = { oldPassword, newPassword, confirmPassword };

    dispatch(changePassword(formData))
      .unwrap()
      .then(() => {
        toast.success(t("user.updatePassword.success"), { position: "top-center", autoClose: 3000 });
        navigate("/profile");
        dispatch(removeSuccess());
      })
      .catch(() => {
        toast.error(t("user.updatePassword.failed"), { position: "top-center", autoClose: 3000 });
      });
    };

  

  return (

    <>

      { loading? (<Loader />) : ( <>
        <Navbar/>
        <PageTitle title={t("user.updatePassword.pageTitle")} />

          <div className='container update-container'>

                <div className='form-content'>
                  <form className='form' onSubmit={updatePasswordSubmit}>
                    <h2>{t("user.updatePassword.title")}</h2>

                    <div className='input-group'>
                      <input type="password" placeholder={t("user.updatePassword.oldPassword")} name='oldPassword' value={oldPassword} onChange={(e) => setOldPassword(e.target.value)}/>
                    </div>

                    <div className='input-group'>
                      <input type="password" placeholder={t("user.updatePassword.newPassword")} name='newPassword' value={newPassword} onChange={(e) => setNewPassword(e.target.value)}/>
                    </div>

                    <div className='input-group'>
                      <input
                        type="password" placeholder={t("user.updatePassword.confirmPassword")} name='confirmPassword' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
                    </div>

                    
                    

                    <button type="submit" className="authBtn">{loading ? t("user.updatePassword.updating") : t("user.updatePassword.updateButton")}</button>
                  </form>
                </div>

          </div>

        <Footer/>
        </>)}

    </>


  )
}

export default UpdatePassword
