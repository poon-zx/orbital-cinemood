import React, { useState, useEffect } from 'react';
import { getSupabaseInstance } from '../../supabase';
import Cards from '../Card/card';
import '../../pages/Profile/Watchhistory.css'

const FavouriteGenreCard = ({ userId }) => {
    const [favouriteGenre, setFavouriteGenre] = useState(null);
    const [movies, setMovies] = useState([]);

    // function to return data from TMDB API
    const fetchMovieDetails = async (movieId) => {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US`
        );
      
        if (!response.ok) {
          throw new Error(`Error fetching details for movie with ID ${movieId}`);
        }
      
        const data = await response.json();
      
        return data;
      };
      

      useEffect(() => {
        const fetchFavouriteGenre = async () => {
            const { data: userData, error } = await getSupabaseInstance()
                .from('user')
                .select('watched')
                .eq('id', userId)
                .single();
          
            if (error) {
                console.error('Error fetching user data:', error.message);
                return;
            }
    
            const watchedList = userData.watched;
    
            // Fetch all the movie details
            const moviesDetails = await Promise.all(watchedList.map(movie => 
                fetchMovieDetails(movie)));
    
            const genreCounts = {};

            console.log(moviesDetails);
    
            for (let movieDetails of moviesDetails) {
                for (let genre of movieDetails.genres) {
                    genreCounts[genre.name] = genreCounts[genre.name] ? genreCounts[genre.name] + 1 : 1;
                }
            }
    
            const favGenre = Object.keys(genreCounts).reduce((a, b) => genreCounts[a] > genreCounts[b] ? a : b);
    
            setFavouriteGenre(favGenre);
    
            // Filter the movies that are of the favourite genre
            const moviesOfGenre = moviesDetails.filter((movieDetails) => {
                return movieDetails.genres.some(genre => genre.name === favGenre);
            });
    
            setMovies(moviesOfGenre);
        };
    
        fetchFavouriteGenre();
    }, [userId]);
    

      return (
        <div>
          <p>When it comes to movies, your favourite genre is {favouriteGenre}.</p>
          <p>You watched {movies.length} shows of this genre.</p>
          <div className="row__posters" style={{ height: movies.length > 0 ? '372px' : 'auto' }}>
          {movies.map((movie) => (
         <div key={movie.id} className="row__poster row__posterLarge">
              <Cards movie={movie} />
              </div>
          ))}
          </div>
        </div>
      );
    };

    export default FavouriteGenreCard;