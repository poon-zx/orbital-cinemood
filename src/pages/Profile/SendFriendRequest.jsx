import React from "react";
import { getSupabaseInstance } from "../../supabase";
import { v4 } from "uuid";

const SendFriendRequest = ({ currentUserId, friendUserId, afterRequestSent }) => {
  const sendRequest = async () => {
    // Check if a request has already been sent
    const { data: existingRequest, error: requestError } =
      await getSupabaseInstance()
        .from("notification")
        .select("status")
        .eq("user_id_from", currentUserId)
        .eq("user_id_to", friendUserId)
        .eq("status", "pending");

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

    console.log(friends);

    // If a request already exists and it's still pending, do not send a new one
    if (existingRequest.length > 0 && existingRequest[0].status === "pending") {
      alert("Friend request has already been sent.");
      return;
    }

    // check if other user sent you a friend request
    const { data: existingRequestFromOtherUser, error: requestFromOtherUserError } =
        await getSupabaseInstance()
            .from("notification")
            .select("status")
            .eq("user_id_from", friendUserId)
            .eq("user_id_to", currentUserId)
            .eq("status", "pending");

    if (requestFromOtherUserError) {
        console.error(
            "Error checking existing friend request:",
            requestFromOtherUserError.message
        );
        return;
    }

    if (existingRequestFromOtherUser.length > 0 && existingRequestFromOtherUser[0].status === "pending") {
        alert("You already have a pending friend request from this user.");
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

    afterRequestSent();
  };

  return (
    <button className="profile-btn" onClick={sendRequest} size="lg">
      Send Request
    </button>
  );
};

export default SendFriendRequest;
