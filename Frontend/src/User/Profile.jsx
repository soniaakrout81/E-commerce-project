import React, { useEffect } from "react";
import "../UserStyles/Profile.css"
import { Link, useNavigate } from "react-router-dom";
import PageTitle from "../components/PageTitle";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import Loader from "../components/Loader";




function Profile() {

  const { loading, isAuthenticated, user } = useSelector((state) => state.user)
  const navigate = useNavigate();
  const { t } = useTranslation();


  useEffect(() => {

    if(isAuthenticated === false){

      navigate("/");

    }

  })

  return (

    <>

     { loading?(<Loader/>): (   <div className='profile-container'>

      <PageTitle title={`${user.name} ${t("user.profile.pageTitleSuffix")}`} />
        
        <div className='profile-image'>

          <h1>{t("user.profile.title")}</h1>
          <img src={ user.avatar.url ? user.avatar.url : "/images/profile.png" } alt={t("user.profile.userProfileAlt")} className='profile-image2' />
          <Link to="/profile/update">{t("user.profile.editProfile")}</Link>

        </div>
        <div className='profile-details'>

            <div className='profile-detail'>

                <h2>{t("user.profile.username")}: </h2>
                <p>{user.name}</p>

            </div>
            <div className='profile-detail'>

                <h2>{t("user.profile.email")}: </h2>
                <p>{user.email}</p>

            </div>
            <div className='profile-detail'>

                <h2>{t("user.profile.joinedOn")}: </h2>
                <p>{user.createdAt ? String(user.createdAt).substring(0, 10) : t("user.profile.na")}</p>

            </div>


        </div>
        <div className='profile-buttons'>

          <Link to="/orders/user">{t("user.profile.myOrders")}</Link>
          <Link to="/password/change">{t("user.profile.changePassword")}</Link>

        </div>
        
    </div>)}

    </>
    

  )
}

export default Profile
