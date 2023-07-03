import React, { useEffect, useState } from "react";
import Cards from "../../components/Card/card";
import { getSupabaseInstance } from "../../supabase";
import "./Watchhistory.css";
import stringSimilarity from "string-similarity";
import CircularProgress from "@mui/material/CircularProgress";
import { useLocation } from "react-router-dom";
import Box from '@mui/material/Box';

const Recommendations = ({ user_ids }) => {
  const [recommendations, setRecommendations] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const userDataPromises = user_ids.map(async (user_id) => {
        const { data, error } = await getSupabaseInstance()
          .from("user")
          .select("watched")
          .eq("id", user_id);

        if (error) {
          console.error("Error fetching profile:", error.message);
          return;
        }
        return data;
      });

      const resolvedUserData = await Promise.all(userDataPromises);

      // Combine all watched movies into one array
      const movieIds = resolvedUserData.map((data) => data[0].watched).flat();

      const timesWatched = resolvedUserData.map((data) => data[0].watched.length).flat();

      const filteredTimesWatched = timesWatched.filter((length) => length > 0);

      const movieData = await getData(movieIds, user_ids, filteredTimesWatched);
      setRecommendations(movieData);
    } catch (error) {
      console.error("Error fetching profile:", error.message);
    }
    setIsLoading(false);
  };

  const getData = async (movie_id_list, user_ids, timesWatched) => {
    // for each movie in movie_id_list, fetch the rating
    const moviePromises = movie_id_list.map(async (movie_id) => {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movie_id}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US`
      );
      const movieData = await response.json();

      const cast = await fetch(
        `https://api.themoviedb.org/3/movie/${movie_id}/credits?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US`
      );
      const castData = await cast.json();
      const reviewPromises = user_ids.map(async (user_id) => {
        const { data, error } = await getSupabaseInstance()
          .from("review")
          .select("*")
          .eq("user_id", user_id)
          .eq("movie_id", movie_id);

        if (error) {
          console.error("Error fetching review:", error.message);
          return movieData;
        }
        return data && data.length > 0 && data[0].rating
          ? data[0].rating
          : null;
      });
      const ratings = await Promise.all(reviewPromises);
      // Determine the average rating
      const validRatings = ratings.filter((rating) => rating !== null);
      let averageRating = 5;
      if (validRatings.length === 1) {
        averageRating = validRatings[0];
      } else if (validRatings.length > 1) {
        averageRating =
          Math.floor(validRatings.reduce((a, b) => a + b, 0) / validRatings.length);
      }

      // get directors names
      const directors = castData.crew
        .filter((person) => person.job === "Director")
        .map((person) => person.name);

      // get actors names
      const actors = castData.cast.slice(0, 3).map((person) => person.name);

      // concat movie name, Year of Release, Watch Time, Movie Rating, Director, Genre, Cast, Description as one text
      const movieText =
        movieData.title +
        " " +
        movieData.release_date.slice(0, 4) +
        " " +
        movieData.runtime +
        " " +
        movieData.vote_average +
        " " +
        directors +
        " " +
        movieData.genres.map((genre) => genre.name) +
        " " +
        actors +
        " " +
        movieData.overview;
      // return array of movieText and rating
      return [movieText, averageRating];
    });

    const resolvedPromises = await Promise.all(moviePromises);

    resolvedPromises.push(timesWatched);

    console.log(resolvedPromises);

    const response = await fetch("/give_recommendations/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input: resolvedPromises }),
    });

    if (response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const similarityResults = await response.json();

        const moviePromises = similarityResults.results.map((result) =>
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

        const filteredMovies = movieResults
          .map((result, index) => {
            console.log(result);
            if (!result) {
              return null;
            }
            // Only consider the first 3 results from TMDB
            const firstThreeMovies = result.results.slice(0, 3);
            const matchingMovie = firstThreeMovies.find(
              (movie) =>
                stringSimilarity.compareTwoStrings(
                  movie.title.toLowerCase(),
                  similarityResults.results[index].movie.toLowerCase()
                ) > 0.9 &&
                movie.release_date.slice(0, 4) ===
                  similarityResults.results[index].year &&
                movie.poster_path &&
                movie.vote_count >= 1
            );

            return matchingMovie;
          })
          .filter(
            (movie) => movie && !movie_id_list.includes(String(movie.id))
          ); // Remove any undefined entries
        return filteredMovies;
      } else {
        console.error("Invalid response format. Expected JSON.");
      }
    } else {
      console.error("Error searching for movies:", response.status);
    }
  };

  return (
    <div
      className="row__posters"
      style={{ height: recommendations?.length > 0 ? "372px" : "auto" }}
    >
      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "10vh",
          }}
        >
          <CircularProgress />
        </div>
      ) : recommendations ? (
        recommendations.map((movie) => (
          <div key={movie.id} className="row__poster row__posterLarge">
            <Cards key={movie.id} movie={movie} />
          </div>
        ))
      ) : location.pathname.startsWith("/blend/") ? (
        <Box sx={{ textAlign: 'center', width:"1800px" }}>
        Both of you don't have any movies in your watch histories, try adding some!
        </Box>
      ) : (
        "Add movies to your watch history to see movies you may like!"
      )}
    </div>
  );
};
export default Recommendations;
