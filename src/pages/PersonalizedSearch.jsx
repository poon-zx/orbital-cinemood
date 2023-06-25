import stringSimilarity from "string-similarity";
import React, { useState, useEffect } from "react";
import Cards from "../components/Card/card.js";
import "../components/MovieList/movieList.css";
import SearchIcon from '@mui/icons-material/Search';
import { IconButton } from "@mui/material";
import { getSupabaseInstance } from "../supabase";
import { useAuth } from "../context/AuthProvider.jsx";

const PersonalizedSearch = () => {
    const [searchText, setSearchText] = useState("");
    const [movieList, setMovieList] = useState([]);
    const auth = useAuth();

    useEffect(() => {
        insertUser();
    }, []);

    const insertUser = async () => {
        const { data: userData, error: userError } = await getSupabaseInstance()
            .from('user')
            .select('*')
            .eq('id', auth.user.id);

        if (userData && userData.length === 0) {
            await getSupabaseInstance().from('user').insert([
                {
                    id: auth.user.id,
                    email: auth.user.email
                },
            ]);
        }
    };

    const getData = async () => {
        if (searchText === "") {
        // Don't send a request if searchText is empty
        return;
        }
        try {
        const response = await fetch("/find_similarity/", {
            method: "POST",
            headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            },
            body: JSON.stringify({ input: searchText }),
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
            console.log(similarityResults.results);

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
                    movie.poster_path && movie.vote_count >= 1
                );

                return matchingMovie;
                })
                .filter((movie) => movie); // Remove any undefined entries

            setMovieList(filteredMovies);
            } else {
            console.error("Invalid response format. Expected JSON.");
            }
        } else {
            console.error("Error searching for movies:", response.status);
        }
        } catch (error) {
        console.error("Error searching for movies:", error);
        }
    };

    const search = () => {
        getData();
    };

    const trigger = (e) => {
        setSearchText(e.target.value);
    };

    return (
        <div className="movie__list">
        <h2 className="list__title" style={{ marginTop: "30px" }}>Movie Recommender</h2>
  <p className="movie__tagline"> 
        Enter below what you want to watch and we'll recommend you some movies! 
      </p>
        <div className="container">
            <div className="search-container" style={{ display: "flex", alignItems: "center", marginTop: "-40px"}}>
            <form
                onSubmit={(e) => {
                e.preventDefault();
                search();
                }}
            >
                <input
                type="text"
                placeholder="I want to watch a ..."
                onChange={trigger}
                className="search--bar"
                />
                <IconButton
                    className="search--button"
                    type="submit"
                    style={{ width: "50px", height: "50px" }}
                    >
                        <SearchIcon />
                </IconButton>
            </form>
            </div>
            <div className="list__cards">
            {movieList.map((movie) => (
                <Cards key={movie.id} movie={movie} />
            ))}
            </div>

        </div>
        </div>
    );
};

export default PersonalizedSearch;
