import React, { useState, useEffect } from "react";
import { Avatar } from "@mui/material";
import { getSupabaseInstance } from "../../supabase";
import { useAuth } from "../../context/AuthProvider.jsx";
import { useParams } from "react-router-dom";
import FavouriteGenreCard from "../../components/Stats/FavouriteGenre";


const PersonalStats = () => {
  const auth = useAuth();
  const { id: urlId } = useParams(); // Extract user ID from the URL
  const [profile, setProfile] = useState([]);

  useEffect(() => {
    fetchProfile();
  }, [urlId]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await getSupabaseInstance()
        .from("user")
        .select("*")
        .eq("id", urlId);

      if (error) {
        console.error("Error fetching profile:", error.message);
        return;
      }

      if (data) {
        setProfile(data[0]);
      }
    } catch (error) {
      console.error("Error fetching profile:", error.message);
    }
  };

  return (
    <div className="movie__list">
      <h2 className="list__title" style={{ marginTop: "30px" }}>
        {profile.username ? profile.username : profile.email}'s Movie Stats
      </h2>
      <div className="container">
        <FavouriteGenreCard userId={urlId}/>
      </div>
    </div>
  );
};

export default PersonalStats;
