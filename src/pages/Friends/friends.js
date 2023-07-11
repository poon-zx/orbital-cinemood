import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthProvider.jsx";
import { getSupabaseInstance } from "../../supabase.js";
import FriendsCard from "./friendsCard.js";
import SearchFriends from "../../modals/searchFriends";

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
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <h1 style={{ marginTop: "1rem", fontFamily: 'Playfair Display, serif', marginRight: "1rem" }}>Friends</h1>
                <SearchFriends />
            </div>
            <div className="friends-container">
                { friendReturn.length > 0 ? (
                    friendReturn.map((friend) => <FriendsCard friend={friend} key={friend.id} />
                )) : (
                    <p>No friends yet</p>
                )}
            </div>
            </div>
    );
      
}

export default Friends