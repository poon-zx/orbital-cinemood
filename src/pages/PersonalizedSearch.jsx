import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Cards from "../components/Card/card.js";
import "../components/MovieList/movieList.css";
import Pagination from "../components/Pagination/Pagination.js";

const PersonalizedSearch = () => {
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [movieList, setMovieList] = useState([]);
  const { type } = useParams();

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, [type, page]);

  const getData = async () => {
    try {
      const response = await fetch("http://localhost:8000/find_similarity/", {
        mode: 'no-cors',
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: searchText }),
      });
  
      if (response.ok) {
        console.log("yay");
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const similarityResults = await response.json();
  
          const moviePromises = similarityResults.results.map((result) =>
            fetch(
              `https://api.themoviedb.org/3/search/movie?query=${result.movie}&api_key=0d3e5f1c5b02f2f9d8de3dad573c9847&language=en-US&page=${page}`
            )
          );
  
          const movieResponses = await Promise.all(moviePromises);
          const movieResults = await Promise.all(
            movieResponses.map((response) => {
              if (response.ok) {
                return response.json();
              } else {
                return null;
              }
            })
          );
  
          const filteredMovies = movieResults.filter(
            (result) => result && result.results.length > 0
          );
  
          const finalMovieList = filteredMovies.map((result) => result.results[0]);
          setMovieList(finalMovieList);
        } else {
          console.error("Invalid response format. Expected JSON.");
        }
      } else {
        console.log("nay");
        console.error("Error searching for movies:", response.status);
      }
    } catch (error) {
      console.log("yayyy");
      console.error("Error searching for movies:", error);
    }
  };
  

  const search = () => {
    getData();
  };

  const trigger = (e) => {
    setSearchText(e.target.value);
  };

  return (
    <div className="movie__list">
      <h2 className="list__title">Search</h2>
      <div className="container">
        <div className="search-container">
          <form onSubmit={(e) => { e.preventDefault(); search() }}>
            <input
              type="text"
              placeholder="search movie name..."
              onChange={trigger}
              className="search-bar"
            />
            <button className="search-button" type="submit">
              {" "}
              &#128269;
            </button>
          </form>
        </div>
        <div className="list__cards">
          {movieList.map((movie) => (
            <Cards key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
      {movieList.length > 0 && <Pagination page={page} setPage={setPage} />}
    </div>
  );
};

export default PersonalizedSearch;
