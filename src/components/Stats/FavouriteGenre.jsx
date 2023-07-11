import React, { useState, useEffect } from "react";
import { getSupabaseInstance } from "../../supabase";
import Cards from "../Card/card";
import "../../pages/Profile/Watchhistory.css";

const FavouriteGenreCard = ({ userId }) => {
  const [favouriteGenre, setFavouriteGenre] = useState(null);
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);

  // function to return data from TMDB API
  const fetchMovieDetails = async (movieId) => {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US`
    );

    if (!response.ok) {
      throw new Error(`Error fetching details for movie with ID ${movieId}`);
    }

    const data = await response.json();

    return data;
  };

  useEffect(() => {
    const fetchFavouriteGenre = async () => {
      const { data: userData, error } = await getSupabaseInstance()
        .from("user")
        .select("watched")
        .eq("id", userId)
        .single();

        console.log(userData);

      if (error) {
        console.error("Error fetching user data:", error.message);
        return;
      }

      const watchedList = userData.watched;

      console.log(userData.watched);

      // Fetch all the movie details
      const moviesDetails = await Promise.all(
        watchedList.map((movie) => fetchMovieDetails(movie))
      );

      setMovies(moviesDetails);

      const genreCounts = {};
      let genreList = new Set();

      for (let movieDetails of moviesDetails) {
        for (let genre of movieDetails.genres) {
          genreCounts[genre.name] = genreCounts[genre.name]
            ? genreCounts[genre.name] + 1
            : 1;
          genreList.add(genre.name);
        }
      }

      let sortedGenres = Object.keys(genreCounts).sort(
        (a, b) => genreCounts[b] - genreCounts[a]
      );

      let top5Genres = sortedGenres.slice(0, 4);

      // Check for ties at the 5th position
      let i = 4;
      while (
        sortedGenres[i] &&
        genreCounts[sortedGenres[i]] === genreCounts[top5Genres[3]]
      ) {
        top5Genres.push(sortedGenres[i]);
        i++;
      }

      const maxCount = Math.max(...Object.values(genreCounts));
      const favouriteGenres = Object.keys(genreCounts).filter(
        (genre) => genreCounts[genre] === maxCount
      );

      console.log(favouriteGenres);

      setFavouriteGenre(favouriteGenres.join(", "));

      // Convert Set to Array
      genreList = Array.from(genreList);
      setGenres(top5Genres);
    };

    fetchFavouriteGenre();
  }, [userId]);

  return (
    <div>
      {movies.length > 0 ? (
        <>
          <p className="header-textt">
            When it comes to movies, your favourite{" "}
            {favouriteGenre.split(", ").length > 1 ? "genres are" : "genre is"}{" "}
            <span style={{ color: "blue" }}>{favouriteGenre}</span>.
          </p>
          <p className="header-textt">
            Here are your watched movies from your top watched genres:
          </p>
          <div className="genre-list">
            {genres.sort().map((genre) => (
              <div className="genre-section" key={genre}>
                <h3>{genre}</h3>
                <div className="movie-list">
                  {movies
                    .filter((movieDetails) =>
                      movieDetails.genres.some((g) => g.name === genre)
                    )
                    .map((movieDetails) => (
                      <Cards
                        key={movieDetails.id}
                        movie={movieDetails}
                        className="small-card"
                      />
                    ))}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="header-textt">
          {" "}
          Watch at least 1 movie to unlock genre insights!
        </p>
      )}
    </div>
  );
};

export default FavouriteGenreCard;
