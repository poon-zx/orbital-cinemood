import React from 'react';
import './App.css';
import Login from './pages/Login.js';
import Home from './pages/Home/home.js';
import Header from './components/Header/header.js';
import MovieList from './components/MovieList/movieList.js';
import Movie from './components/Movie/movie.js';
import { Routes, Route, useLocation } from "react-router-dom";
import ProtectedRoute from './components/ProtectedRoute'; 
import PasswordReset from './pages/UpdatePassword.jsx';
import NotFound from './pages/NotFound';

  export default function App() {
    const location = useLocation();
  
    const showHeader = location.pathname === "/home" || location.pathname.match(/^\/movie\//)
        || location.pathname.match(/^\/movies\//);
  
    return (
        <div className="App">
            <div className="content-container" >
                {showHeader && <Header />}
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/reset" element={<PasswordReset />} />
                    <Route path="/" element={<Login />} />
                    <Route element={<ProtectedRoute />}>
                        <Route path="/home" element={<Home />} />
                        <Route path="movie/:id" element={<Movie />} />
                        <Route path="movies/:type" element={<MovieList />} />
                    </Route>
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </div>
    );
  }
  

