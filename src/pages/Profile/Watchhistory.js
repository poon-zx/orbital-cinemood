import React, { useEffect, useState, useRef } from "react";
import Cards from "../../components/Card/card";
import { supabase } from "../../supabase";
const Watchhistory = ({ user_id }) => {
    const [watchhistory, setWatchhistory] = useState([]);
    const [profile, setProfile] = useState([]);
  
    useEffect(() => {
      fetchWatchhistory();
    }, []);
  
    useEffect(() => {
        if (profile.length > 0) {
            Promise.all(profile[0].watched.map((x) => getData(x)))
            .then((movies) => {
                setWatchhistory(movies);
            })
            .catch((error) => {
                console.error("Error fetching movie data:", error.message);
            });
        }
    }, [profile]);
  
    const fetchWatchhistory = async () => {
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
        const data = await response.json();
        return data;
    };
  
    return (
        <div className="list__cards">
            {watchhistory.length > 0 ? (
            watchhistory.map((movie) => <Cards movie={movie} />)
            ) : (
            "Watch history is empty"
            )}
        </div>
    );
  };

  export default Watchhistory;