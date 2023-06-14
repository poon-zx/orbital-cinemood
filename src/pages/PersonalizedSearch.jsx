import stringSimilarity from 'string-similarity';
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Cards from "../components/Card/card.js";
import "../components/MovieList/movieList.css";

const PersonalizedSearch = () => {
  const [searchText, setSearchText] = useState("");
  const [movieList, setMovieList] = useState([]);
  const { type } = useParams();

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, [type]);

  const getData = async () => {
    // 1. Initiate similarity calculation
    try {
      const response = await fetch("/find_similarity/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: searchText }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      const taskId = data.task_id;
  
      // 2. Poll for results
      let resultData = null;
      while (resultData === null || resultData.status !== "SUCCESS") {
        await new Promise((resolve) => setTimeout(resolve, 1000));  // wait for 1 second
  
        const resultResponse = await fetch(`/results/${taskId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
  
        if (!resultResponse.ok) {
          throw new Error(`HTTP error! status: ${resultResponse.status}`);
        }
  
        resultData = await resultResponse.json();
      }
  
      const similarityResults = resultData.results;
  
      const moviePromises = similarityResults.map((result) =>
        fetch(
          `https://api.themoviedb.org/3/search/movie?query=${result.movie}&api_key=0d3e5f1c5b02f2f9d8de3dad573c9847&language=en-US`
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
  
      const filteredMovies = movieResults.map((result, index) => {
        if (!result) {
          return null;
        }
        // Only consider the first 3 results from TMDB
        const firstThreeMovies = result.results.slice(0, 3);
        const matchingMovie = firstThreeMovies.find(
          (movie) => stringSimilarity.compareTwoStrings(movie.title.toLowerCase(), similarityResults[index].movie.toLowerCase()) > 0.9
            && movie.release_date.slice(0, 4) === similarityResults[index].year
            && movie.poster_path
        );
  
        return matchingMovie;
      }).filter(movie => movie);  // Remove any undefined entries
  
      setMovieList(filteredMovies);
  
    } catch (error) {
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
      <h2 className="list__title">Movie Recommender</h2>
      <div className="container">
        <div className="search-container">
          <form onSubmit={(e) => { e.preventDefault(); search() }}>
            <input
              type="text"
              placeholder="I want to watch a ..."
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
    </div>
  );
};

export default PersonalizedSearch;
