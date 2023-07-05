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
  const [own, setOwn] = useState([]);

  useEffect(() => {
    fetchProfile();
  }, [urlId]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await getSupabaseInstance()
        .from("user")
        .select("*")
        .or(`id.eq.${urlId}, id.eq.${auth.user.id}`);

      if (error) {
        console.error("Error fetching profile:", error.message);
        return;
      }

      if (data && data.length >= 2) {
        const profileData = data.find(item => item.id === urlId);
        const ownData = data.find(item => item.id === auth.user.id);
        setProfile(profileData);
        setOwn(ownData);
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
            {own.avatar_url ? <img 
                    src={own.avatar_url} 
                    alt=""
                    width="190"
                    height="190"
                    style={{ borderRadius: "50%", border: "6px solid #F6E0CD" }}
                /> : <Avatar
              className="profile-pic"
              sx={{ height: "190px", width: "190px" }}
              style={{ border: "6px solid #F6E0CD" }}
            />}
            {profile.avatar_url ? <img 
                    src={profile.avatar_url} 
                    alt=""
                    width="190"
                    height="190"
                    style={{ borderRadius: "50%", position: "absolute", left: "120px", border: "6px solid #F6E0CD"}}
                /> : <Avatar
              className="profile-pic"
              sx={{
                height: "190px",
                width: "190px",
                position: "absolute",
                left: "120px", // Adjust this value to achieve the desired overlap
              }}
              style={{ border: "6px solid #F6E0CD" }}
            />}
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
