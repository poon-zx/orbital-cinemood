import React, { useState, useEffect } from "react";
import { Avatar } from "@mui/material";
import { getSupabaseInstance } from "../../supabase";
import { useAuth } from "../../context/AuthProvider.jsx";
import { useParams } from "react-router-dom";
import FavouriteGenreCard from "../../components/Stats/FavouriteGenre";
import YourRating from "../../components/Stats/YourRatings";

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
    <div>
      <h2 className="list__title" style={{ marginTop: "30px" }}>
        {profile.username ? profile.username : profile.email}'s CineStats
      </h2>
      <h2
        classname="list__title"
        style={{
          fontSize: "2.2rem",
          margin: "1rem",
          fontFamily: "Playfair Display",
          alignSelf: "flex-start",
          marginTop: "50px",
          textDecoration: "underline",
          marginBottom: "-20px",
        }}
      >
        Genres
      </h2>
      <div className="container">
        <FavouriteGenreCard userId={urlId} />
      </div>
      <h2
        classname="list__title"
        style={{
          fontSize: "2.2rem",
          margin: "1rem",
          fontFamily: "Playfair Display",
          alignSelf: "flex-start",
          marginTop: "50px",
          textDecoration: "underline",
          marginBottom: "-20px",
        }}
      >
        Ratings
      </h2>
      <div className="container">
        <YourRating userId={urlId} />
      </div>
    </div>
  );
};

export default PersonalStats;
