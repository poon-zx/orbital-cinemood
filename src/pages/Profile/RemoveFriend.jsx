import React from "react";
import { getSupabaseInstance } from "../../supabase";
import { v4 } from "uuid";

const RemoveFriend = ({ currentUserId, friendUserId, afterFriendRemoved }) => {
  const removeFriend = async () => {

    // Remove friend from own friends list
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

    const updatedFriends = friends.filter(friend => friend !== friendUserId);

    const { data: updatedFriendsData, error: updateFriendsError } =
        await getSupabaseInstance()
            .from("user")
            .update({ friends: updatedFriends })
            .eq("id", currentUserId);

    if (updateFriendsError) {
        console.error("Error updating friends list:", updateFriendsError.message);
        return;
    }


    // Remove friend from friend's friends list
    const { data:friendFriends, error: fetchFriendFriendsError } =
        await getSupabaseInstance()
            .from("user")
            .select("friends")
            .eq("id", friendUserId)
            .single();

    if (fetchFriendFriendsError) {
        console.error("Error fetching friend data:", fetchFriendFriendsError.message);
        return;
    }

    const friendsFriendList = friendFriends[0]?.friends || [];

    const updatedFriendFriends = friendsFriendList.filter(friend => friend !== currentUserId);

    const { data: updatedFriendFriendsData, error: updateFriendFriendsError } =
        await getSupabaseInstance()
            .from("user")
            .update({ friends: updatedFriendFriends })
            .eq("id", friendUserId);
            
    if (updateFriendFriendsError) {
        console.error("Error updating friend's friends list:", updateFriendFriendsError.message);
        return;
    }

    alert("Friend removed.");

    afterFriendRemoved();
    };

  return (
    <button className="profile-btn" onClick={removeFriend} size="lg">
      Remove Friend
    </button>
  );
};

export default RemoveFriend;
