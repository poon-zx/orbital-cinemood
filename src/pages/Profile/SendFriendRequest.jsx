import React from "react";
import { getSupabaseInstance } from "../../supabase";
import { v4 } from "uuid";

const SendFriendRequest = ({ currentUserId, friendUserId }) => {
  const sendRequest = async () => {
    // Check if a request has already been sent
    const { data: existingRequest, error: requestError } =
      await getSupabaseInstance()
        .from("notification")
        .select("status")
        .eq("user_id_from", currentUserId)
        .eq("user_id_to", friendUserId);

    if (requestError) {
      console.error(
        "Error checking existing friend request:",
        requestError.message
      );
      return;
    }

    const { data:currentFriends, error: fetchFriendsError } =
        await getSupabaseInstance()
            .from("user")
            .select("friends")
            .eq("id", currentUserId)
            .single();
    
    if (fetchFriendsError) {
        console.error("Error fetching user data:", fetchFriendsError.message);
        return;
    }

    const { friends } = currentFriends;

    if (friends.includes(friendUserId)) {
        alert("You are already friends with this user.");
        return;
    }

    // If a request already exists and it's still pending, do not send a new one
    if (existingRequest.length > 0 && existingRequest[0].status === "pending") {
      alert("Friend request has already been sent.");
      return;
    }
    const { data, error } = await getSupabaseInstance()
      .from("notification")
      .insert([
        {
          id: v4(),
          user_id_from: currentUserId,
          user_id_to: friendUserId,
          status: "pending",
        },
      ]);

    if (error) {
      console.error("Error sending friend request:", error.message);
      return;
    }

    alert("Friend request sent!");
  };

  return (
    <button className="profile-btn" onClick={sendRequest} size="lg">
      Send Request
    </button>
  );
};

export default SendFriendRequest;
