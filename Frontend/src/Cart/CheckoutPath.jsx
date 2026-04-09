import React from "react";
import "../CartStyles/CheckoutPath.css"
import { LibraryAddCheck, LocalShipping } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

function CheckoutPath({activePath}) {
    const { t } = useTranslation();

    const path = [

        {

            label: t("checkout.shippingDetails"),
            icon:<LocalShipping/>

        },
        {

            label: t("checkout.confirmOrder"),
            icon:<LibraryAddCheck/>

        }



    ]

  return (
    <div className='checkoutPath'>



        {path.map((item, index) => (
        
        <div className='checkoutPath-step' key={index} active={activePath === index?"true":"false"} completed={activePath >= index?"true":"false"} >

            <p className='checkoutPath-icon'>{item.icon}</p>
            <p className='checkoutPath-label'>{item.label}</p>

        </div>
    
        ))}



    </div>
  )
}

export default CheckoutPath
