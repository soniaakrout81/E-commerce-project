import React, { useState, useEffect } from "react";
import "../UserStyles/Form.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { register, removeErrors, removeSuccess } from "../features/user/userSlice";
import imageCompression from "browser-image-compression";
import Loader from "../components/Loader";


function Register() {
    const [user, setUser] = useState({ name: "", email: "", password: "" });
    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState("/images/profile.png");
    const [loading, setLoading] = useState(false);

    const { name, email, password } = user;
    const { success, error, isAuthenticated } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        console.log("📸 Original file:", file);
        console.log("📏 Original size (KB):", file.size / 1024);

        try {
            const options = {
                maxSizeMB: 1,
                maxWidthOrHeight: 800,
                useWebWorker: true,
            };

            const compressedFile = await imageCompression(file, options);
            console.log("📦 Compressed file:", compressedFile);
            console.log("📏 Compressed size (KB):", compressedFile.size / 1024);

            const base64 = await imageCompression.getDataUrlFromFile(compressedFile);

            console.log("🧬 Base64 preview:", base64.substring(0, 50));
            console.log("🧬 Base64 length:", base64.length);

            setAvatar(base64);
            setAvatarPreview(base64);

        } catch (error) {
            console.error("❌ Image compression error:", error);
        }
    };


    const registerDataChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const registerSubmit = (e) => {
        e.preventDefault();
        if (!name || !email || !password) {
            toast.error(t("user.common.fillRequired"), { position: "top-center", autoClose: 3000 });
            return;
        }

        if (password.length < 8) {

            toast.error(t("user.common.passwordMin"), { position: "top-center", autoClose: 3000 });
            return;

        }

        if (name.length < 3) {

            toast.error(t("user.common.nameMin"), { position: "top-center", autoClose: 3000 });
            return;

        }
        if (name.length > 25) {

            toast.error(t("user.common.nameMax"), { position: "top-center", autoClose: 3000 });
            return;

        }

        setLoading(true);

        console.log("📤 Register submit clicked");
        console.log("👤 User data:", { name, email, password });
        console.log("🖼 Avatar exists?", !!avatar);
        console.log("🧬 Avatar length:", avatar?.length);


        const myForm = { name, email, password, avatar };
        dispatch(register(myForm)).finally(() => setLoading(false));

    };


    useEffect(() => {
        if (error) {
            toast.error(t("user.register.failed"), { position: "top-center", autoClose: 3000 });
            dispatch(removeErrors());
        }

        if (success && isAuthenticated) {

            toast.success(t("user.register.success"), { position: "top-center", autoClose: 3000 });
            dispatch(removeSuccess());
            navigate("/");

        }
    }, [error, success, isAuthenticated, dispatch, navigate]);


    return (
        <div className="container container2">
            {loading && <Loader />}
            <div className='form-content'>
                <div className="form-container">
                    <form className="form" onSubmit={registerSubmit}>
                        <h2>{t("user.register.title")}</h2>

                        <div className="input-group">
                            <input
                                type="text"
                                placeholder={t("user.common.username")}
                                name="name"
                                value={name}
                                onChange={registerDataChange}
                            />
                        </div>

                        <div className="input-group">
                            <input
                                type="email"
                                placeholder={t("user.common.email")}
                                name="email"
                                value={email}
                                onChange={registerDataChange}
                            />
                        </div>

                        <div className="input-group">
                            <input
                                type="password"
                                placeholder={t("user.common.password")}
                                name="password"
                                value={password}
                                onChange={registerDataChange}
                            />
                        </div>

                        <div className="file-input-wrapper">
                            <input type="file" id="file" onChange={handleAvatarChange} name="avatar" />
                            <label htmlFor="file" className="file-input-label">{t("user.common.chooseProfilePicture")}</label>
                        </div>

                        <div className="input-group">
                            <img
                                src={avatarPreview || "/images/profile.png"}
                                className="avatar"
                            />
                        </div>

                        <button type="submit" className="authBtn">{loading ? t("user.register.signingUp") : t("user.register.signUp")}</button>
                        <p className="form-links">
                            {t("user.register.alreadyHave")} <Link to="/login">{t("user.register.signInHere")}</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;
