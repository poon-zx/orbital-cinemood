import React from 'react';
import './App.css';
import Login from './pages/Login.js';
import Home from './pages/Home/home.js';
import Header from './components/Header/header.js';
import MovieList from './components/MovieList/movieList.js';
import Movie from './components/Movie/movie.js';
import { Routes, Route, useLocation } from "react-router-dom";
import ProtectedRoute from './components/ProtectedRoute'; // import ProtectedRoute

  export default function App() {
    const location = useLocation();
  
    const showHeader = location.pathname !== "/" && location.pathname !== "/login";
  
    return (
        <div className="App">
            <div className="content-container" >
                {showHeader && <Header />}
                <Routes>
                    <Route path="/Login" element={<Login />} />
                    <Route path="/" element={<Login />} />
                    <Route path="/Home" element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    } />
                <Route path="movie/:id" element={
                    <ProtectedRoute>
                    <Movie />
                    </ProtectedRoute>
                } />
                <Route path="movies/:type" element={
                    <ProtectedRoute>
                    <MovieList />
                    </ProtectedRoute>
                } />
                </Routes>
            </div>
        </div>
    );
  }
  

