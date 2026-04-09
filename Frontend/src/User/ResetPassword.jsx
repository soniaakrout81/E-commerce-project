import React from "react";
import "../UserStyles/Form.css";
import PageTitle from "../components/PageTitle";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { removeSuccess, resetPassword } from "../features/user/userSlice";
import { toast } from "react-toastify";





function ResetPassword() {


    const { loading } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { token } = useParams();

    const resetPasswordSubmit = (e) => {

        e.preventDefault();
        const data = {

            password: newPassword,
            confirmPassword: confirmPassword

        }

        dispatch(resetPassword({
            token,
            passwords: {
                password: newPassword,
                confirmPassword
            }
        }))
            .unwrap()
            .then((res) => {
                toast.success(t("user.resetPassword.success"), { position: "top-center", autoClose: 3000 });
                navigate("/login");
                dispatch(removeSuccess());
            })
            .catch(() => {
                toast.error(t("user.resetPassword.failed"), { position: "top-center", autoClose: 3000 });
            });

    };



    return (

        <>

            <PageTitle title={t("user.resetPassword.pageTitle")} />
            <div className='container form-container'>

                <div className='form-content'>
                    <form className='form' onSubmit={resetPasswordSubmit}>
                        <h2>{t("user.resetPassword.title")}</h2>

                        <div className='input-group'>
                            <input type="password" placeholder={t("user.resetPassword.newPassword")} required name='newPassword' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                        </div>

                        <div className='input-group'>
                            <input type="password" placeholder={t("user.resetPassword.confirmPassword")} required name='confirmPassword' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        </div>


                        <button type="submit" className="authBtn">{loading ? t("user.resetPassword.setting") : t("user.resetPassword.setPassword")}</button>


                    </form>


                </div>

            </div>

        </>

    )
}

export default ResetPassword
