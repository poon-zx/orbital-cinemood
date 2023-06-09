import React, {useEffect, useState} from "react"
import { useParams } from "react-router-dom"
import Cards from "../components/Card/card.js"
import "../components/MovieList/movieList.css"
import Pagination from "../components/Pagination/Pagination.js";


const Search = () => {
    const [searchText, setSearchText] = useState("");
    const [page, setPage] = useState(1);
    const [movieList, setMovieList] = useState([])
    const {type} = useParams()
    
    useEffect(() => {
        getData()
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        getData()
        // eslint-disable-next-line
    }, [type, page])

    const getData = () => {
        fetch(`https://api.themoviedb.org/3/search/movie?query=${searchText}}&api_key=0d3e5f1c5b02f2f9d8de3dad573c9847&language=en-US&page=${page}`)
        .then(res => res.json())
        .then(data => {
            const moviesWithPoster = data.results.filter(movie => movie.poster_path);
            setMovieList(moviesWithPoster);
        });
    }

    const Search = () => {
        getData();
      };
    
      const Trigger = (e) => {
        setSearchText(e.target.value);
      };

    return (
        <div className="movie__list">
            <h2 className="list__title">
                Search
            </h2>
            <div className="container">
            <div className="search-container">
        <form onSubmit={(e) => {e.preventDefault(); Search()}}>
        <input
            type="text"
            placeholder="search movie name..."
            onChange={Trigger}
            className="search-bar"
        />
        <button
            className="search-button"
            type="submit" // make the button of type submit to trigger the form onSubmit event
        > 
        &#128269;
        </button>
    </form>
</div>
            <div className="list__cards">
                {
                    movieList.map(movie => (
                        <Cards movie={movie} />
                    ))
                }
            </div>
        </div>
        {movieList.length > 0 && <Pagination page={page} setPage={setPage} />}
        </div>   
                   
    )
}

export default Search