import React, { useEffect, useState } from "react";
import "../UserStyles/Form.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { login, removeSuccess, removeErrors } from "../features/user/userSlice";
import { toast } from "react-toastify";

function Login() {
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const { error, success, isAuthenticated } = useSelector((state) => state.user);
    const [loading, setLoading] = useState(false);
    const [justRegistered, setJustRegistered] = useState(false);
    const { t } = useTranslation();
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loginSubmit = (e) => {

        setLoading(true);

        e.preventDefault();
        dispatch(login({ email: loginEmail, password: loginPassword }))

    }
    useEffect(() => {

        setJustRegistered(false);

    }, []);

    useEffect(() => {

        dispatch(removeSuccess());
        
    }, [dispatch]);

    useEffect(() => {
      if (error) {
    
        toast.error(t("user.login.failed"), { position: "top-center", autoClose: 3000 });
        setLoading(false);
        dispatch(removeErrors());
            
      }
    }, [dispatch, error]);

    


    useEffect(() => {
        if (success) {

            toast.success(t("user.login.success"), { position: "top-center", autoClose: 3000 });
            dispatch(removeSuccess());
            setLoading(false);
            setJustRegistered(true);
            navigate("/");

        }else if (isAuthenticated && !justRegistered) {

            toast.success(t("user.login.alreadyLoggedIn"), { position: "top-center", autoClose: 3000 });
            setLoading(false);
            navigate("/");
            
        }
    }, [dispatch, success, isAuthenticated, navigate, justRegistered]);



  return (
    <div className="form-container container">

        <div className="form-content">

            <form className="form" onSubmit={loginSubmit}>

                <div className="input-group">
                    <input type="email" name="" placeholder={t("user.common.email")} value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required/>
                </div>

                <div className="input-group">
                    <input type="password" name="" placeholder={t("user.common.password")} value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required/>
                </div>
                <button className="authBtn">{loading ? t("user.login.signingIn") : t("user.login.signIn")}</button>
                <p className="form-links">{t("user.login.forgot")} <Link to="/password/forgot">{t("user.login.resetHere")}</Link></p>
                <p className="form-links">{t("user.login.noAccount")} <Link to="/register">{t("user.login.signUpHere")}</Link></p>


            </form>

        </div>

    </div>
  )
}

export default Login
