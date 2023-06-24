import React, { useEffect, useState, useRef } from "react";
import CardsUser from "../../components/Card/cardUser";
import { supabase } from "../../supabase";
const Watchlist = ({ user_id }) => {
    const [watchlist, setWatchlist] = useState([]);
    const [profile, setProfile] = useState([]);
  
    useEffect(() => {
      fetchWatchlist();
    }, []);
  
    useEffect(() => {
        if (profile.length > 0) {
            Promise.all(profile[0].to_watch.map((x) => getData(x)))
            .then((movies) => {
                setWatchlist(movies);
            })
            .catch((error) => {
                console.error("Error fetching movie data:", error.message);
            });
        }
    }, [profile]);
  
    const fetchWatchlist = async () => {
        try {
            const { data, error } = await supabase
            .from("user")
            .select("*")
            .eq("id", user_id);
    
            if (error) {
            console.error("Error fetching profile:", error.message);
            return;
            }
    
            if (data && data.length > 0) {
                setProfile(data);
            }
        } catch (error) {
            console.error("Error fetching profile:", error.message);
        }
    };
  
    const getData = async (movie_id) => {
        const response = await fetch(
            `https://api.themoviedb.org/3/movie/${movie_id}?api_key=0d3e5f1c5b02f2f9d8de3dad573c9847&language=en-US`
        );
        const movieData = await response.json();
        const { data, error } = await supabase
            .from('review')
            .select("*")
            .eq('user_id', user_id)
            .eq('movie_id', movie_id);

        if (error) {
            console.error('Error fetching review:', error.message);
            return movieData; 
        }

        if (data && data.length > 0) {
            const updateData = { ...movieData,  
                rating: data[0].rating,
                review_title: data[0].title,
                review_content: data[0].content, 
            };
            return updateData;
        }

        return movieData; 
    };

    return (
        <div className="list__cards">
            {watchlist.length > 0 ? (
            watchlist.map((movie) => <CardsUser movie={movie} />)
            ) : (
            "Watchlist is empty"
            )}
        </div>
    );
  };

  export default Watchlist;