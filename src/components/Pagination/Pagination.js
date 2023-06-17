import React from "react";
import "./Pagination.css";

const Pagination = ({ page, setPage }) => {
  const Previous = () => {
    if (page !== 1) {
      setPage(page - 1);
      window.scrollTo(0, 0);
    } else {
      setPage(page);
    }
  };

  const Next = () => {
    if (page < 10) {
      setPage(page + 1);
      window.scrollTo(0, 0);
    }
  };

  return (
    <>
      <div className="pagination-container">
        <button className="pagination-button" onClick={Previous}>
          Previous
        </button>
        <span className="page-number">Page {page}</span>
        <button className="pagination-button" onClick={Next}>
          Next
        </button>
      </div>
    </>
  );
};

export default Pagination;
