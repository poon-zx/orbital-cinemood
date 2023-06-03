import React from 'react';
import './App.css';
import Login from './components/Login.js';
import Home from './components/Home/home.js';
import Header from './components/Header/header.js';
import MovieList from './components/MovieList/movieList.js';
import Movie from './components/Movie/movie.js';
import { Routes, Route, useLocation } from "react-router-dom";

  export default function App() {
    const location = useLocation();
  
    const showHeader = location.pathname !== "/";
  
    return (
        <div className="App">
            <div className="content-container">
                {showHeader && <Header />}
                <Routes>
                    <Route path="/Login" element={<Login />} />
                    <Route path="/" element={<Login />} />
                    <Route path="/Home" element={<Home />} />
                    <Route path="movie/:id" element={<Movie />}></Route>
                    <Route path="movies/:type" element={<MovieList />}></Route>
                </Routes>
            </div>
        </div>
    );
  }
  

