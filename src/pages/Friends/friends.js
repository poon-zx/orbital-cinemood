import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthProvider.jsx";
import { getSupabaseInstance } from "../../supabase.js";
import { Avatar, Card } from "@mui/material";
import { Link } from "react-router-dom";

const Friends = () => {
    const auth = useAuth();
    const [friendReturn, setFriends] = useState([]);

    const fetchFriends = async () => {
        const { data, error } = await getSupabaseInstance()
            .from("user")
            .select("*")
            .eq("id", auth.user.id);
        if (error) {
            console.error("Error fetching friends:", error.message);
            return;
        }
        if (data) {
            const friendsID = data[0].friends;
            console.log(friendsID);

            const { data: friendData, error: friendError } = await getSupabaseInstance()
                .from("user")
                .select("*")
                .in("id", friendsID);

            if (friendError) {
                console.error("Error fetching friends:", friendError.message);
                return;
            }
            if (friendData) {
                console.log(friendData);
                setFriends(friendData);
            }
        }
    }

    useEffect(() => {
        fetchFriends();
    }, []);

    return (
        <div>
            <h1 style={{marginTop: "20px"}}>Friends</h1>
            <div>
                {friendReturn ? friendReturn.map((friend) => (
                    <Card className="friends-card" style={{marginLeft: '2%', marginRight: '2%', marginTop: '10px'}}>
                        <Avatar />
                        <Link to={`/profile/${friend.id}`} style={{ textDecoration: 'none', color: 'inherit', fontSize: '24px' }}>
                            {friend.username
                            ? friend.username
                            : friend.email}
                        </Link>
                    </Card>
                )) : "No friends yet"}
            </div>
        </div>
    );
}

export default Friends