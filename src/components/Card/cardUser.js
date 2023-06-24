import React, { useEffect, useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "./card.css";
import { Link } from "react-router-dom";
import StarIcon from '@mui/icons-material/Star';

const CardsUser = ({ movie }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="cards" data-testid="movie-card">
          <SkeletonTheme color="#202020" highlightColor="#444">
            <Skeleton height={300} duration={2} data-testid="skeleton-loader" />
          </SkeletonTheme>
        </div>
      ) : (
        <Link
          to={`/movie/${movie.id}`}
          style={{ textDecoration: "none", color: "white" }}
        >
          <div className="cards">
            <img
              className="cards__img"
              src={`https://image.tmdb.org/t/p/original${
                movie ? movie.poster_path : ""
              }`}
              alt={movie ? movie.original_title : ""}
            />
            <div className="cards__overlay">
              <div className="card__title">
                {movie ? movie.original_title : ""}
              </div>
              <div className="card__runtime">
                {movie.rating ? (
                  <>
                    {movie.rating}
                    <StarIcon sx={{ fontSize: 20 }} style={{marginLeft: "3px", marginTop:"-3px" }} />
                  </>
                ) : (
                  "No rating"
                )}
              </div>
              <div className="card__review-title">
                {movie ? movie.review_title : ""}
              </div>
              <div className="card__description">
                {movie.review_content ? movie.review_content.slice(0, 118) + (movie.review_content.length <= 118 ? "" : "...") : "No review"}
              </div>
            </div>
          </div>
        </Link>
      )}
    </>
  );
};

export default CardsUser;
