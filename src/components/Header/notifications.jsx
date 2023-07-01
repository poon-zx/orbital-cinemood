import React, { useEffect, useState } from "react";
import { getSupabaseInstance } from "../../supabase.js";
import { useAuth } from "../../context/AuthProvider.jsx";
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Button,
  Divider
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Box } from "@mui/system";

const Notifications = () => {
  const auth = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAccept = async (notificationId, fromUserId) => {
    // Step 1: Update the notification status to 'accepted'
    const { error: updateNotificationError } = await getSupabaseInstance()
      .from("notification")
      .update({ status: "accepted" })
      .eq("id", notificationId);

    if (updateNotificationError) {
      console.error(
        "Error updating notification:",
        updateNotificationError.message
      );
      return;
    }

    // Step 2: Add the new friend to the user's friends list
    const { data: userData, error: fetchUserError } =
      await getSupabaseInstance()
        .from("user")
        .select("friends")
        .eq("id", auth.user.id)
        .single();

    if (fetchUserError) {
      console.error("Error fetching user data:", fetchUserError.message);
      return;
    }

    const { friends } = userData;

    const updatedFriends = friends.includes(fromUserId)
      ? friends
      : [...friends, fromUserId];

    const { error: updateUserError } = await getSupabaseInstance()
      .from("user")
      .update({ friends: updatedFriends })
      .eq("id", auth.user.id);

    if (updateUserError) {
      console.error("Error updating user data:", updateUserError.message);
      return;
    }

    const { data: userDataFriend, error: fetchUserErrorFriend } =
      await getSupabaseInstance()
        .from("user")
        .select("friends")
        .eq("id", fromUserId)

    if (fetchUserErrorFriend) {
      console.error("Error fetching user data:", fetchUserErrorFriend.message);
      return;
    }

    console.log('userDataFriend:', userDataFriend);

    const friendsFriend = userDataFriend[0]?.friends || [];

    console.log(friendsFriend)

    const updatedFriendsFriend = friendsFriend.includes(auth.user.id)
      ? friendsFriend
      : [...friendsFriend, auth.user.id];

    const { error: updateUserErrorFriend } = await getSupabaseInstance()
      .from("user")
      .update({ friends: updatedFriendsFriend })
      .eq("id", fromUserId);

    if (updateUserErrorFriend) {
      console.error("Error updating user data:", updateUserError.message);
      return;
    }

    // Step 3: Update local notifications state
    setNotifications(
      notifications.filter((notification) => notification.id !== notificationId)
    );

    handleClose();
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      const { data, error } = await getSupabaseInstance()
        .from("notification")
        .select(
          "*, user_from: user_id_from (email, username), user_to: user_id_to (email, username)"
        )
        .eq("user_id_to", auth.user.id)
        .eq("status", "pending"); // Assuming 'pending' notifications are the ones unread

      if (error) {
        console.error("Error fetching notifications:", error.message);
        return;
      }

      if (data) {
        setNotifications(data);
      }
    };

    fetchNotifications();
  }, [auth.user.id]);

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={notifications.length} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        id="notifications-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
            sx: {
              bgcolor: "#EBCBC1",
            },
          }}
      >
        <Box sx={{ bgcolor: "#EBCBC1", color: 'white', p: 1 }}>
          <Typography variant="h6" sx={{ ml: '6px', color: 'black', fontFamily: 'Playfair Display'}}>Notifications</Typography>
          <Divider sx={{ bgcolor: 'black', my: 1 }} /> 
        </Box>
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <MenuItem key={notification.id} sx={{py:2}}>
              <Typography sx={{mb:1}}>
                {notification.user_from.username
                  ? notification.user_from.username
                  : notification.user_from.email}{" "}
                has sent you a friend request, do you accept?
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={(event) =>{
                    event.stopPropagation();
                  handleAccept(notification.id, notification.user_id_from)
                }}
                sx={{ bgcolor: '#E19C8D', marginLeft:"10px", color: 'black' }}
              >
                Accept
              </Button>
            </MenuItem>
          ))
        ) : (
            <MenuItem sx={{py:2}}>
          <Typography>No notifications</Typography>
        </MenuItem>
        )}
      </Menu>
    </>
  );
};

export default Notifications;
