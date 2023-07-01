import React, {useEffect} from "react";
import "./App.css";
import Login from "./pages/Login.js";
import Profile from "./pages/Profile/Profile.js";
import Header from "./components/Header/header.js";
import MovieList from "./components/MovieList/movieList.js";
import Movie from "./components/Movie/movie.js";
import { Routes, Route, useLocation } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import PasswordReset from "./pages/UpdatePassword/UpdatePassword.jsx";
import NotFound from "./pages/NotFound";
import Search from "./pages/Search.js";
import PersonalizedSearch from "./pages/PersonalizedSearch.jsx";
import { SearchProvider } from './context/SearchContext';
import "bootstrap/dist/css/bootstrap.min.css";
import ConfirmationPage from "./pages/UpdatePassword/Confirmation";
import MovieBlend from "./pages/Profile/MovieBlend.js";

export default function App() {
  const location = useLocation();

  useEffect(() => {
    // Define the paths where you want to keep the localStorage data
    const paths = ["/movie/", "/home"];

    if (!paths.some((path) => location.pathname.startsWith(path))) {
      localStorage.removeItem("searchText");
      localStorage.removeItem("movieList");
    }
  }, [location]);

  const showHeader =
    location.pathname === "/home" ||
    location.pathname.match(/^\/movie\//) ||
    location.pathname.match(/^\/movies\//) ||
    location.pathname === "/search" ||
    location.pathname.match(/^\/profile\//) ||
    location.pathname.match(/^\/blend\//);

  return (
    <div className="App">
      <SearchProvider>
      <div className="content-container">
        {showHeader && <Header />}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path ="/" element={<PasswordReset />} />
          <Route path="/confirm-signup" element={<ConfirmationPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<PersonalizedSearch />} />
            <Route path="movie/:id" element={<Movie />} />
            <Route path="movies/:type" element={<MovieList />} />
            <Route path="/search" element={<Search />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/blend/:id" element={<MovieBlend />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      </SearchProvider>
    </div>
  );
}
