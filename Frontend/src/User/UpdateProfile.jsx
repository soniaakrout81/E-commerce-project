import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../UserStyles/Form.css";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile } from "../features/user/userSlice";
import { toast } from "react-toastify";
import imageCompression from "browser-image-compression";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function UpdateProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.user);
  const { t } = useTranslation();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar.url || "/images/profile.png");

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const options = { maxSizeMB: 1, maxWidthOrHeight: 800, useWebWorker: true };
      const compressedFile = await imageCompression(file, options);
      const base64 = await imageCompression.getDataUrlFromFile(compressedFile);

      setAvatar(base64);
      setAvatarPreview(base64);
    } catch {
      toast.error(t("user.updateProfile.avatarProcessFailed"), { position: "top-center", autoClose: 3000 });
    }
  };

  const updateSubmit = (e) => {
    e.preventDefault();

    if (!name || !email) {
      toast.error(t("user.common.fillRequired"), { position: "top-center", autoClose: 3000 });
      return;
    }

    if (name.length < 3) {
      toast.error(t("user.common.nameMin"), { position: "top-center", autoClose: 3000 });
      return;
    }

    const formData = { name, email, avatar };

    dispatch(updateProfile(formData))
      .unwrap()
      .then(() => {
        toast.success(t("user.updateProfile.success"), { position: "top-center", autoClose: 3000 });
        navigate("/profile");
      })
      .catch(() => {
        toast.error(t("user.updateProfile.failed"), { position: "top-center", autoClose: 3000 });
      });
  };

  return (
    <>
      <Navbar />
      {loading && <Loader />}
      <div className="container-group-update">
        <div className="container2">
          <div className="form-content">
            <form className="form" onSubmit={updateSubmit}>
              <h2>{t("user.updateProfile.title")}</h2>

              <div className="input-group">
                <input
                  type="text"
                  placeholder={t("user.common.name")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="input-group">
                <input
                  type="email"
                  placeholder={t("user.common.email")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="file-input-wrapper">
                <input type="file" id="file" onChange={handleAvatarChange} />
                <label htmlFor="file" className="file-input-label">{t("user.common.chooseProfilePicture")}</label>
              </div>
              <div className="input-group">
                <img src={avatarPreview || "/images/profile.png"} alt={t("user.updateProfile.avatarPreview")} className="avatar" />
              </div>

              <button type="submit" className="authBtn">{loading ? t("user.updateProfile.updating") : t("user.updateProfile.updateBtn")}</button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default UpdateProfile;
