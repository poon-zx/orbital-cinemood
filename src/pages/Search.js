import React, { useEffect, useState, useContext } from "react";
import { SearchContext } from "../context/SearchContext";
import Cards from "../components/Card/card.js";
import "../components/MovieList/movieList.css";
import Pagination from "../components/Pagination/Pagination.js";

const Search = () => {
  const { searchText } = useContext(SearchContext);
  const [page, setPage] = useState(1);
  const [movieList, setMovieList] = useState([]);
  const [totalResults, setTotalResults] = useState(0); // New state

  useEffect(() => {
    getData();
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
        setTotalResults(data.total_results); // set the total results here
      });
  };

  // Pass totalResults to the Pagination component
  return (
    <div className="movie__list">
      <h2 className="list__title">Search Results</h2>
      <div className="list__cards">
        {movieList.length > 0 ? (
          movieList.map((movie, index) => <Cards key={index} movie={movie} />)
        ) : (
          <p>No search results found.</p>
        )}
      </div>
      {movieList.length > 0 && (
        <Pagination page={page} setPage={setPage} totalResults={totalResults} />
      )}
    </div>
  );
};

export default Search;
