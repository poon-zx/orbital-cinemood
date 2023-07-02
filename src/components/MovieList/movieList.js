import React, { useEffect, useState } from "react";
import "./movieList.css";
import { useParams } from "react-router-dom";
import Cards from "../Card/card.js";
import Pagination from "../Pagination/Pagination.js";

const MovieList = () => {
  const [movieList, setMovieList] = useState([]);
  const { type } = useParams();
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // Reset page number to 1 when changing types
    setPage(1);
    getData();
    // eslint-disable-next-line
  }, [type]);

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, [page]);

  const getData = () => {
    fetch(
      `https://api.themoviedb.org/3/movie/${
        type ? type : "popular"
      }?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US&page=${page}`
    )
      .then((res) => res.json())
      .then((data) => {
        setMovieList(data.results);
        setTotalResults(200); // Set total pages here
      });
      
  };
  return (
    <div className="movie__list" data-testid="movie-list">
      <h2 className="list__title">
        {(() => {
          if (type === "top_rated") {
            return "Top Rated";
          } else if (type === "upcoming") {
            return "Upcoming";
          } else {
            return "Popular";
          }
        })()}
      </h2>
      <div className="list__cards">
        {movieList.map((movie) => (movie.poster_path &&
          <Cards movie={movie} />
        ))}
      </div>
      {movieList.length > 0 && <Pagination page={page} setPage={setPage} totalResults={totalResults} />}
    </div>
  );
};

export default MovieList;
