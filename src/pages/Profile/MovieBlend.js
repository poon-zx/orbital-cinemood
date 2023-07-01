import React, { useState, useEffect } from "react";
import { IconButton, Avatar } from "@mui/material";
import { getSupabaseInstance } from "../../supabase";
import { useAuth } from "../../context/AuthProvider.jsx";
import { useParams } from "react-router-dom";
import Recommendations from "./Recommendations.js";

const MovieBlend = () => {
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
        Movie Blend with {profile.username ? profile.username : profile.email}
      </h2>
      <div className="container">
        <div
          className="search-container"
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: "-40px",
            marginLeft: "-100px",
          }}
        >
          <div style={{ position: "relative", display: "inline-flex" }}>
            <Avatar
              className="profile-pic"
              sx={{ height: "150px", width: "150px" }}
            />
            <Avatar
              className="profile-pic"
              sx={{
                height: "150px",
                width: "150px",
                position: "absolute",
                left: "90px", // Adjust this value to achieve the desired overlap
              }}
            />
          </div>
        </div>
        <p className="movie__tagline" style={{ marginTop: "20px" }}>
          Below are some shared movie recommendations for both of you!
        </p>
        <div className="watch-container" style={{ textAlign :"center"}}>
          <Recommendations user_ids={[auth.user.id, urlId]} />
        </div>
      </div>
    </div>
  );
};

export default MovieBlend;
