import React, {useEffect, useState} from "react"
import "./movie.css"
import { useParams } from "react-router-dom"
import {
    Card,
    CardSubtitle,
    CardText,
    CardTitle,
    CardBody,
    CardImg,
  } from "reactstrap";

const Movie = () => {
    const [currentMovieDetail, setMovie] = useState()
    const [currentMovieReview, setMovieReview] = useState()
    const { id } = useParams()

    useEffect(() => {
        getData()
        getReviewData()
        window.scrollTo(0,0)
    }, [])

    const getData = () => {
        fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=0d3e5f1c5b02f2f9d8de3dad573c9847&language=en-US`)
        .then(res => res.json())
        .then(data => setMovie(data))
    }

    const getReviewData = () => {
        fetch(`https://api.themoviedb.org/3/movie/${id}/reviews?api_key=0d3e5f1c5b02f2f9d8de3dad573c9847&language=en-US`)
        .then(res => res.json())
        .then(data => setMovieReview(data))
    }

    return (
        <div className="movie">
            <div className="movie__intro">
                <img className="movie__backdrop" src={`https://image.tmdb.org/t/p/original${currentMovieDetail ? currentMovieDetail.backdrop_path : ""}`} />
            </div>
            <div className="movie__detail">
                <div className="movie__detailLeft">
                    <div className="movie__posterBox">
                        <img className="movie__poster" src={`https://image.tmdb.org/t/p/original${currentMovieDetail ? currentMovieDetail.poster_path : ""}`} />
                    </div>
                </div>
                <div className="movie__detailRight">
                    <div className="movie__detailRightTop">
                        <div className="movie__name">{currentMovieDetail ? currentMovieDetail.original_title : ""}</div>
                        <div className="movie__tagline">{currentMovieDetail ? currentMovieDetail.tagline : ""}</div>
                        <div className="movie__rating">
                            {currentMovieDetail ? currentMovieDetail.vote_average: ""} <i class="fas fa-star" />
                            <span className="movie__voteCount">{currentMovieDetail ? "(" + currentMovieDetail.vote_count + ") votes" : ""}</span>
                        </div>  
                        <div className="movie__runtime">{currentMovieDetail ? currentMovieDetail.runtime + " mins" : ""}</div>
                        <div className="movie__releaseDate">{currentMovieDetail ? "Release date: " + currentMovieDetail.release_date : ""}</div>
                        <div className="movie__genres">
                            {
                                currentMovieDetail && currentMovieDetail.genres
                                ? 
                                currentMovieDetail.genres.map(genre => (
                                    <><span className="movie__genre" id={genre.id}>{genre.name}</span></>
                                )) 
                                : 
                                ""
                            }
                        </div>
                    </div>
                    <div className="movie__detailRightBottom">
                        <div className="synopsisText">Synopsis</div>
                        <div>{currentMovieDetail ? currentMovieDetail.overview : ""}</div>
                    </div>
                    
                </div>
            </div>
            <div className="movie__links">
                <div className="movie__heading">Useful Links</div>
                {
                    currentMovieDetail && currentMovieDetail.homepage && <a href={currentMovieDetail.homepage} target="_blank" style={{textDecoration: "none"}}><p><span className="movie__homeButton movie__Button">Homepage <i className="newTab fas fa-external-link-alt"></i></span></p></a>
                }
            </div>
            <div className="movie__heading">Reviews</div>
            <Card className="movie__review">
            {currentMovieReview ? currentMovieReview.results.map(review => 
                <div className="movie__card">
                    <CardImg className="movie_reviewAvatar" src={`https://image.tmdb.org/t/p/original${review ? review.author_details.avatar_path : ""}`} />
                    <div className="movie__review_left">
                        <CardSubtitle tag="h6" className="movie__reviewAuthor">{review.author}</CardSubtitle>
                        <CardSubtitle tag="h6" className="movie__reviewRating">{review.author_details.rating ? review.author_details.rating + "/10" : ""}</CardSubtitle>
                        <CardText className="movie__reviewContent">{review.content}</CardText>
                        <CardText className="movie__reviewDate">{review.updated_at}</CardText>
                    </div>
                </div>
                    ) : ""}
            </Card>
        </div>
    )
}

export default Movie