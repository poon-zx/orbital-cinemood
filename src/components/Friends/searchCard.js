import React, { useState, useEffect } from 'react';
import { Card, Avatar } from "@mui/material";
import { Link } from "react-router-dom";
import "./searchCard.css";
import { useAuth } from "../../context/AuthProvider.jsx";
import { getSupabaseInstance } from "../../supabase";
import { Done as DoneIcon } from '@mui/icons-material';

const SearchCard = ({ friend }) => {
  const auth = useAuth();
  const [isFriend, setIsFriend] = useState(false);

  useEffect(() => {
    const checkFriendship = async () => {
      const { data: userData, error } = await getSupabaseInstance()
        .from("user")
        .select("friends")
        .eq("id", auth.user.id)
        .limit(1);

      if (error) {
        console.error("Error fetching user data:", error.message);
        return;
      }

      const friendsArray = userData[0]?.friends ?? [];
      setIsFriend(friendsArray.includes(friend.id));
    };

    checkFriendship();
  }, [auth.user.id, friend.id]);

  return (
    <Link
      to={`/profile/${friend.id}`}
      style={{ textDecoration: 'none', color: 'inherit', fontSize: '24px' }}
    >
            <Card className="search-card" style={{ borderRadius: '10px', display: 'flex', alignItems: 'center', marginTop: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
            {friend.avatar_url ? (
            <img
                src={friend.avatar_url}
                alt=""
                width="80"
                height="80"
                style={{ marginTop: '10px', marginBottom: '10px', marginLeft: '10px', borderRadius: '50%' }}
            />
            ) : (
            <Avatar
                sx={{ width: 80, height: 80, marginTop: "10px", marginBottom: "10px", marginLeft: "10px", borderRadius: "50%" }}
            />
            )}
            <div style={{ marginLeft: '10px' }}>
            <Link
                to={`/profile/${friend.id}`}
                style={{ textDecoration: 'none', color: 'inherit', fontSize: '20px' }}
            >
                {friend.username ? friend.username : friend.email}
            </Link>
            </div>
        </div>
        <div style={{ marginLeft: 'auto', marginTop:'5px' }}>
            {isFriend && (
                <span style={{ display: 'flex', alignItems: 'center', backgroundColor: 'gray', color: 'white', fontSize: '18px', padding: '4px 8px', borderRadius: '4px', marginRight: '12px' }}>
                <DoneIcon style={{ marginRight: '4px' }} />
                Friends
                </span>
            )}
        </div>
        </Card>
    </Link>
  );
};

export default SearchCard;
