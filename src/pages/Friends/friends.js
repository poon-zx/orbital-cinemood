import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthProvider.jsx";
import { getSupabaseInstance } from "../../supabase.js";
import FriendsCard from "./friendsCard.js";

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
            <h1 style={{marginTop: "1rem", fontFamily: 'Playfair Display, serif'}}>Friends</h1>
            <div className="friends-container">
                {friendReturn ? friendReturn.map((friend) => (
                    <FriendsCard friend={friend} />
                )) : "No friends yet"}
            </div>
        </div>
    );
}

export default Friends