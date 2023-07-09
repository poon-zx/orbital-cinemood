import React, { useState, useEffect } from "react";
import { getSupabaseInstance } from "../../supabase";
import CardsUser from "../Card/cardUser";
import { fontSize } from "@mui/system";

const YourRating = ({ userId }) => {
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [lowestRatedMovies, setLowestRatedMovies] = useState([]);
  const [movies, setMovies] = useState([]);
  const [mostAgreedMovie, setMostAgreedMovie] = useState(null);
  const [leastAgreedMovie, setLeastAgreedMovie] = useState(null);

  // function to return data from TMDB API
  const fetchMovieDetails = async (movieId) => {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US`
    );
    const movieData = await response.json();

    const { data, error } = await getSupabaseInstance()
      .from("review")
      .select("*")
      .eq("user_id", userId)
      .eq("movie_id", movieId);

    if (error) {
      console.error("Error fetching review:", error.message);
      return movieData;
    }

    if (data && data.length > 0) {
      const updatedData = {
        ...movieData,
        rating: data[0].rating,
        review_title: data[0].title,
        review_content: data[0].content,
      };
      return updatedData;
    }

    return movieData;
  };

  useEffect(() => {
    const fetchRatings = async () => {
      const { data, error } = await getSupabaseInstance()
        .from("review")
        .select("*")
        .eq("user_id", userId);

      if (error) {
        console.error("Error fetching user data:", error.message);
        return;
      }

      // filter out entries with null ratings
      const ratedData = data.filter((item) => item.rating !== null);

      let movieDetails = await Promise.all(
        ratedData.map((item) => fetchMovieDetails(item.movie_id))
      );

      setMovies(movieDetails);

      // Compute difference between user rating and TMDB vote average
      movieDetails = movieDetails.map((movie) => ({
        ...movie,
        ratingDifference: Math.abs(movie.rating - movie.vote_average),
      }));

      // Sort movies based on user rating
      movieDetails.sort((a, b) => b.rating - a.rating);
      setTopRatedMovies(movieDetails.slice(0, 3));
      setLowestRatedMovies(movieDetails.slice(-3).reverse());

      // Sort movies based on rating difference
      movieDetails.sort((a, b) => a.ratingDifference - b.ratingDifference);
      setMostAgreedMovie(movieDetails[0]);
      setLeastAgreedMovie(movieDetails[movieDetails.length - 1]);
    };

    fetchRatings();
  }, [userId]);

  const averageRating =
    topRatedMovies
      .concat(lowestRatedMovies)
      .reduce((total, movie) => total + movie.rating, 0) /
    (topRatedMovies.length + lowestRatedMovies.length);

  return (
    <div>
      {movies.length > 0 ? (
        <>
          <p className="header-textt" style={{ fontSize: "30px" }}>
            Your average rating is {averageRating.toFixed(2)} ⭐
          </p>
          <div>
          {topRatedMovies.length === lowestRatedMovies.length &&
  topRatedMovies.every(
    (value, index) => value.id === [...lowestRatedMovies].reverse()[index].id
  )
 ? (
              <p className="header-textt">
                (It appears that you have the same rating for all movies..)
              </p>
            ) : null}

            <p className="header-textt">Top 3 rated movies:</p>
            {topRatedMovies.map((movie) => (
              <CardsUser key={movie.id} movie={movie} />
            ))}
            <p className="header-textt">Lowest 3 rated movies:</p>
            {lowestRatedMovies.map((movie) => (
              <CardsUser key={movie.id} movie={movie} />
            ))}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              paddingTop: "20px",
            }}
          >
            <div
              style={{
                borderRight: "1px solid black",
                width: "50%",
                padding: "10px",
              }}
            >
              <p className="header-textt">Mainstream Opinion</p>
              <p>
                You gave this movie {mostAgreedMovie.rating} stars, and the TMDB
                vote average was {mostAgreedMovie.vote_average}.
              </p>
              <CardsUser key={mostAgreedMovie.id} movie={mostAgreedMovie} />
            </div>
            <div style={{ width: "50%", padding: "10px" }}>
              <p className="header-textt">Who's Correct?</p>
              <p>
                You gave this movie {leastAgreedMovie.rating} {leastAgreedMovie.rating === 1 ? "star" : "stars"}, but the
                TMDB vote average was {leastAgreedMovie.vote_average}.
              </p>
              <CardsUser key={leastAgreedMovie.id} movie={leastAgreedMovie} />
            </div>
          </div>
        </>
      ) : (
        <p className="header-textt">
          {" "}
          Rate at least 1 movie to unlock rating insights!
        </p>
      )}
    </div>
  );
};

export default YourRating;
