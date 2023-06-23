import React from "react";
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

export default function App() {
  const location = useLocation();

  const showHeader =
    location.pathname === "/home" ||
    location.pathname.match(/^\/movie\//) ||
    location.pathname.match(/^\/movies\//) ||
    location.pathname === "/search" ||
    location.pathname === "/profile";

  return (
    <div className="App">
      <SearchProvider>
      <div className="content-container">
        {showHeader && <Header />}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/reset" element={<PasswordReset />} />
          <Route path="/" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<PersonalizedSearch />} />
            <Route path="movie/:id" element={<Movie />} />
            <Route path="movies/:type" element={<MovieList />} />
            <Route path="/search" element={<Search />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      </SearchProvider>
    </div>
  );
}
