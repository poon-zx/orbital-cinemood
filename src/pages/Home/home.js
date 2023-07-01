import React, { useEffect, useState } from "react";
import "./home.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import MovieList from "../../components/MovieList/movieList.js";
import "../../App.css";
const Home = () => {
  // eslint-disable-next-line
  const [popularMovies, setPopularMovies] = useState([]);

  useEffect(() => {
    fetch(
    `https://api.themoviedb.org/3/movie/550?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US`
    )
      .then((res) => res.json())
      .then((data) => setPopularMovies(data.results));
  }, []);

  return (
    <div className="poster">
      <Carousel
        showThumbs={false}
        autoPlay={true}
        transitionTime={3}
        infiniteLoop={true}
        showStatus={false}
      ></Carousel>
      <MovieList />
    </div>
  );
};

export default Home;
