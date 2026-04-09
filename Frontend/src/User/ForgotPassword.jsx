import React, { useState } from "react";
import "../UserStyles/Form.css";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { forgotPassword, removeSuccess } from "../features/user/userSlice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";






function ForgotPassword() {

  const { loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const { t } = useTranslation();
  const forgotPasswordEmail = (e) => {

    e.preventDefault();
    const myForm = new FormData();
    myForm.set("email", email);
    dispatch(forgotPassword(myForm))
      .unwrap()
      .then(() => {
      toast.success(t("user.forgotPassword.emailSent", { email }), { position: "top-center", autoClose: 3000 });
        dispatch(removeSuccess());
      })
      .catch(() => {
        toast.error(t("user.forgotPassword.failed"), { position: "top-center", autoClose: 3000 });
      });
      setEmail("");

  }

  return (

    <>

    { loading? <Loader/> : ( <>
    
        
        <PageTitle title={t("user.forgotPassword.pageTitle")} />
        <Navbar/>

        <div className='container update-container'>

            <div className='form-content email-group'>

                <form className='form' onSubmit={forgotPasswordEmail}>

                <h2>{t("user.forgotPassword.title")}</h2>
                <div className='input-group'>

                    <input type="email" name="email" className='input-email' placeholder={t("user.forgotPassword.emailPlaceholder")} value={email} onChange={(e) => setEmail(e.target.value)}/>
                    <button className='authBtn'>{loading ? t("user.forgotPassword.sending") : t("user.forgotPassword.send")}</button>

                </div>

                </form>

            </div>

        </div>



        <Footer/>
    
    </>)}
   
  

  </>
  )
}

export default ForgotPassword
