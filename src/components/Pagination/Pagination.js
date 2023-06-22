import React from "react";
import "./Pagination.css";

const Pagination = ({ page, setPage, totalResults }) => {
  const Previous = () => {
    if (page !== 1) {
      setPage(page - 1);
      window.scrollTo(0, 0);
    } else {
      setPage(page);
    }
  };

  const Next = () => {
    if (page < Math.ceil(totalResults / 20) && page < 10) { // If the current page is less than the total number of pages
      setPage(page + 1);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="pagination-container" data-testid="pagination">
      <button className="pagination-button" onClick={Previous} data-testid="previous-button">
        Previous
      </button>
      <span className="page-number">Page {page}</span>
      <button className="pagination-button" onClick={Next} data-testid="next-button">
        Next
      </button>
    </div>
  );
};


export default Pagination;
