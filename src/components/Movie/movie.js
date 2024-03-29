import React, { useEffect, useState } from "react";
import WriteReview from "../../modals/writeReview.js";
import Rating from "../../modals/rating.js";
import Watch from "../../modals/watch.js";
import { useParams } from "react-router-dom";
import Forum from "../Forum/forum.js"
import "./movie.css";

const Movie = () => {
    const [currentMovieDetail, setMovie] = useState();
    const [currentMovieReview, setMovieReview] = useState();
    const { id } = useParams();

    useEffect(() => {
        getData();
        getReviewData();
        window.scrollTo(0, 0);
    }, []);

    const getData = () => {
        fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US`
        )
        .then((res) => res.json())
        .then((data) => setMovie(data));
    };

    const getReviewData = () => {
        fetch(
        `https://api.themoviedb.org/3/movie/${id}/reviews?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US`
        )
        .then((res) => res.json())
        .then((data) => setMovieReview(data));
    };

    return (
        <div className="movie">
        <div className="movie__intro">
            <img
            className="movie__backdrop"
            src={`https://image.tmdb.org/t/p/original${
                currentMovieDetail ? currentMovieDetail.backdrop_path : ""
            }`}
            />
        </div>
        <div className="movie__detail">
            <div className="movie__detailLeft">
            <div className="movie__posterBox">
                <img
                className="movie__poster"
                src={`https://image.tmdb.org/t/p/original${
                    currentMovieDetail ? currentMovieDetail.poster_path : ""
                }`}
                />
                <Watch className="watch__add" movieId={id} data-testid="add-watch" />
            </div>
            </div>
            <div className="movie__detailRight">
            <div className="movie__detailRightTop">
                <div className="movie__name">
                {currentMovieDetail ? currentMovieDetail.original_title : ""}
                </div>
                <div className="movie__tagline">
                {currentMovieDetail ? currentMovieDetail.tagline : ""}
                </div>
                <div className="movie__rating">
                {currentMovieDetail ? currentMovieDetail.vote_average : ""}{" "}
                <i class="fas fa-star" />
                <span className="movie__voteCount">
                    {currentMovieDetail
                    ? "(" + currentMovieDetail.vote_count + ") votes"
                    : ""}
                </span>
                </div>
                <div className="movie__runtime">
                {currentMovieDetail ? currentMovieDetail.runtime + " mins" : ""}
                </div>
                <div className="movie__releaseDate">
                {currentMovieDetail
                    ? "Release date: " + currentMovieDetail.release_date
                    : ""}
                </div>
                <div className="movie__genres">
                {currentMovieDetail && currentMovieDetail.genres
                    ? currentMovieDetail.genres.map((genre) => (
                        <>
                        <span className="movie__genre" id={genre.id}>
                            {genre.name}
                        </span>
                        </>
                    ))
                    : ""}
                </div>
            </div>
            <div className="movie__detailRightBottom">
                <div className="synopsisText">Synopsis</div>
                <div className="synopsisContent">
                {currentMovieDetail ? currentMovieDetail.overview : ""}
                </div>
            </div>
            </div>
        </div>
        <div className="movie__links">
            <div className="movie__heading1">Useful Links</div>
            {currentMovieDetail && currentMovieDetail.homepage && (
            <a className="text-center"
            data-testid="movie-homepage"
                href={currentMovieDetail.homepage}
                target="_blank"
                style={{ textDecoration: "none"}}
            >
            <button className="movie__homeButton">
                <span className="buttonText">Movie Page</span>
                <i className="newTab fas fa-external-link-alt"></i>
            </button>
            </a>
            )}
        </div>
        <div className="movie__heading2">Reviews</div>
        <Forum movieId={id} />
        </div>
    );
};

export default Movie;