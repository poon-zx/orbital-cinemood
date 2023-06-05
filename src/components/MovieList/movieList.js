import React, {useEffect, useState} from "react"
import "./movieList.css"
import { useParams } from "react-router-dom"
import Cards from "../Card/card.js"

const MovieList = () => {
    
    const [movieList, setMovieList] = useState([])
    const {type} = useParams()
    
    useEffect(() => {
        getData()
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        getData()
        // eslint-disable-next-line
    }, [type])

    const getData = () => {
        fetch(`https://api.themoviedb.org/3/movie/${type ? type : "popular"}?api_key=0d3e5f1c5b02f2f9d8de3dad573c9847&language=en-US`)
        .then(res => res.json())
        .then(data => setMovieList(data.results))
    }

    return (
        <div className="movie__list">
            <h2 className="list__title">
                {(() => {
                    if (type === "top_rated") {
                    return "Top Rated";
                    } else if (type === "upcoming") {
                    return "Upcoming";
                    } else {
                    return "Popular"; 
                    }
                })()}
            </h2>
            <div className="list__cards">
                {
                    movieList.map(movie => (
                        <Cards movie={movie} />
                    ))
                }
            </div>
        </div>
    )
}

export default MovieList