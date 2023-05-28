import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Header from '../Header/header.tsx';
import Home from '../Home/home.js';
import MovieList from '../MovieList/movieList.js';
import Movie from '../Movie/movie.js';

function Homepage() {
  return (
    <div className="Homepage">
          <Header />
            <Routes>
                <Route index element={<Home />}></Route>
                <Route path="movie/:id" element={<Movie />}></Route>
                <Route path="movies/:type" element={<MovieList />}></Route>
                <Route path="/*" element={<h1>Error Page</h1>}></Route>
            </Routes>
    </div>
  );
  
}

export default Homepage;