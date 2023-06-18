import React, { useEffect, useState, useContext } from "react";
import { SearchContext } from '../context/SearchContext';
import Cards from "../components/Card/card.js";
import "../components/MovieList/movieList.css";
import Pagination from "../components/Pagination/Pagination.js";

const Search = () => {
  const { searchText } = useContext(SearchContext);
  const [page, setPage] = useState(1);
  const [movieList, setMovieList] = useState([]);

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, [page, searchText]);

  const getData = () => {
    fetch(
      `https://api.themoviedb.org/3/search/movie?query=${searchText.toLowerCase()}}&api_key=0d3e5f1c5b02f2f9d8de3dad573c9847&language=en-US&page=${page}`
    )
      .then((res) => res.json())
      .then((data) => {
        const moviesWithPoster = data.results.filter(
          (movie) => movie.poster_path
        );
        setMovieList(moviesWithPoster);
      });
  };

  return (
    <div className="movie__list">
      <h2 className="list__title">Search Results</h2>
        <div className="list__cards">
          {movieList.map((movie, index) => (
            <Cards key={index} movie={movie} />
          ))}
        </div>
      {movieList.length > 0 && <Pagination page={page} setPage={setPage} />}
    </div>
  );
};

export default Search;
