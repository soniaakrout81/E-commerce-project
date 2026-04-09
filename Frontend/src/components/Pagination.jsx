import React from "react";
import "../componentStyles/Pagination.css";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

function Pagination({ currentPage, onPageChange, activeClass = "active", nextPageText, prevPageText, firstPageText, lastPgeText }) {

  const { t } = useTranslation();
  const { totalPages, products } = useSelector((state) => state.product);
  if (products.length === 0 || totalPages <= 1) return null;
  const resolvedNext = nextPageText || t("pagination.next");
  const resolvedPrev = prevPageText || t("pagination.prev");
  const resolvedFirst = firstPageText || t("pagination.first");
  const resolvedLast = lastPgeText || t("pagination.last");


  const getPageNumbers = () => {

    const pageNumbers = [];
    const pageWindow = 2;
    for (let i = Math.max(1, currentPage - pageWindow); i <= Math.min(totalPages, currentPage + pageWindow); i++) {

      pageNumbers.push(i);

    }

    return pageNumbers;

  }

  return (
    

    <div className='pagination'>

      {

        currentPage > 1 &&(

          <>

            <button className='pagination-btn' onClick={() => onPageChange(1)}>{resolvedFirst}</button>
            <button className='pagination-btn' onClick={() => onPageChange(currentPage - 1)}>{resolvedPrev}</button>

          </>

        )

      }

      {

        getPageNumbers().map((number) => (

          <button className={`pagination-btn ${currentPage === number ? activeClass : ""}`} key={number} onClick={() => onPageChange(number)}>{number}</button>

        ))

      }

      {

        currentPage < totalPages &&(

          <>

            <button className='pagination-btn' onClick={() => onPageChange(currentPage + 1)}>{resolvedNext}</button>
            <button className='pagination-btn' onClick={() => onPageChange(totalPages)}>{resolvedLast}</button>

          </>

        )

      }

    </div>

  )

}
export default Pagination
