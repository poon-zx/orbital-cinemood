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
  Divider,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Box } from "@mui/system";
import { v4 } from "uuid";
import { Link, useLocation } from "react-router-dom";

const Notifications = () => {
  const auth = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();

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

    console.log(friends);

    const updatedFriends = friends.includes(fromUserId)
      ? friends
      : [...friends, fromUserId];

    console.log(updatedFriends);

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
        .eq("id", fromUserId);

    if (fetchUserErrorFriend) {
      console.error("Error fetching user data:", fetchUserErrorFriend.message);
      return;
    }

    console.log("userDataFriend:", userDataFriend);

    const friendsFriend = userDataFriend[0]?.friends || [];

    console.log(friendsFriend);

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

    // Send "Accepted" notification to the user who sent the friend request
    const { error: createNotificationError } = await getSupabaseInstance()
      .from("notification")
      .insert([
        {
          id: v4(),
          user_id_from: auth.user.id,
          user_id_to: fromUserId,
          status: "acceptedConfirmation",
        },
      ]);

    if (createNotificationError) {
      console.error(
        "Error creating notification:",
        createNotificationError.message
      );
      return;
    }
  };

  const handleReject = async (notificationId, fromUserId) => {
    // Step 1: Update the notification status to 'rejected'
    const { error: updateNotificationError } = await getSupabaseInstance()
      .from("notification")
      .update({ status: "rejected" })
      .eq("id", notificationId);

    if (updateNotificationError) {
      console.error(
        "Error updating notification:",
        updateNotificationError.message
      );
      return;
    }

    // Step 2: Update local notifications state
    setNotifications(
      notifications.filter((notification) => notification.id !== notificationId)
    );

    const { error: createNotificationError } = await getSupabaseInstance()
      .from("notification")
      .insert([
        {
          id: v4(),
          user_id_from: auth.user.id,
          user_id_to: fromUserId,
          status: "rejectedConfirmation",
        },
      ]);

    if (createNotificationError) {
      console.error(
        "Error creating notification:",
        createNotificationError.message
      );
      return;
    }
  };

  const handleConfirmationAccepted = async (notificationId) => {
    const { error: updateNotificationError } = await getSupabaseInstance()
      .from("notification")
      .update({ status: "accept confirmation accepted" })
      .eq("id", notificationId);

    if (updateNotificationError) {
      console.error(
        "Error updating notification:",
        updateNotificationError.message
      );
      return;
    }

    // Step 2: Update local notifications state
    setNotifications(
      notifications.filter((notification) => notification.id !== notificationId)
    );
  };

  const handleConfirmationRejected = async (notificationId) => {
    const { error: updateNotificationError } = await getSupabaseInstance()
      .from("notification")
      .update({ status: "reject confirmation accepted" })
      .eq("id", notificationId);

    if (updateNotificationError) {
      console.error(
        "Error updating notification:",
        updateNotificationError.message
      );
      return;
    }

    // Step 2: Update local notifications state
    setNotifications(
      notifications.filter((notification) => notification.id !== notificationId)
    );
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      // Fetch notifications based on the current location or any relevant URL parameters
      // Update the necessary logic based on your specific requirements

      const { data, error } = await getSupabaseInstance()
        .from("notification")
        .select(
          "*, user_from: user_id_from (email, username), user_to: user_id_to (email, username)"
        )
        .eq("user_id_to", auth.user.id)
        .in("status", [
          "pending",
          "acceptedConfirmation",
          "rejectedConfirmation",
        ]);

      if (error) {
        console.error("Error fetching notifications:", error.message);
        return;
      }

      console.log(data);

      if (data) {
        setNotifications(data);
      }

      console.log("fetching notifications");
    };

    fetchNotifications();
  }, [auth.user.id, location]);

  return (
    <>
      <IconButton color="inherit" onClick={handleClick} data-testid="notifs-btn">
        <Badge badgeContent={notifications.length} color="error">
          <NotificationsIcon sx={{ color: "#363636" }} />
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
        <Box sx={{ bgcolor: "#EBCBC1", color: "white", p: 1 }}>
          <Typography
            variant="h6"
            sx={{ ml: "6px", color: "black", fontFamily: "Playfair Display" }}
          >
            Notifications
          </Typography>
          <Divider sx={{ bgcolor: "black", my: 1, mb: "-5px" }} />
        </Box>
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <MenuItem key={notification.id} sx={{ py: 2 }}>
              {notification.status === "pending" && (
                <Typography sx={{ mb: 1 }}>
                  <Link
                    to={`/profile/${notification.user_id_from}`}
                    style={{
                      textDecoration: "underline",
                      color: "inherit",
                      fontWeight: "bold",
                    }}
                  >
                    {notification.user_from.username
                      ? notification.user_from.username
                      : notification.user_from.email}
                  </Link>{" "}
                  has sent you a friend request, do you accept?
                </Typography>
              )}
              {notification.status === "acceptedConfirmation" && (
                <Typography sx={{ mb: 1 }}>
                  <Link
                    to={`/profile/${notification.user_id_from}`}
                    style={{
                      textDecoration: "underline",
                      color: "inherit",
                      fontWeight: "bold",
                    }}
                  >
                    {notification.user_from.username
                      ? notification.user_from.username
                      : notification.user_from.email}
                  </Link>{" "}
                  accepted your friend request.
                </Typography>
              )}
              {notification.status === "rejectedConfirmation" && (
                <Typography sx={{ mb: 1 }}>
                  <Link
                    to={`/profile/${notification.user_id_from}`}
                    style={{
                      textDecoration: "underline",
                      color: "inherit",
                      fontWeight: "bold",
                    }}
                  >
                    {notification.user_from.username
                      ? notification.user_from.username
                      : notification.user_from.email}
                  </Link>{" "}
                  rejected your friend request.
                </Typography>
              )}
              {notification.status === "acceptedConfirmation" && (
                <IconButton
                  onClick={(event) => {
                    event.stopPropagation();
                    handleConfirmationAccepted(
                      notification.id,
                      notification.status
                    );
                  }}
                  sx={{
                    marginTop: "-6px",
                    color: "black",
                  }}
                >
                  <CancelIcon />
                </IconButton>
              )}
              {notification.status === "rejectedConfirmation" && (
                <IconButton
                  onClick={(event) => {
                    event.stopPropagation();
                    handleConfirmationRejected(
                      notification.id,
                      notification.status
                    );
                  }}
                  sx={{
                    marginTop: "-6px",
                    color: "black",
                  }}
                >
                  <CancelIcon />
                </IconButton>
              )}
              {notification.status === "pending" && (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleAccept(notification.id, notification.user_id_from);
                    }}
                    sx={{
                      bgcolor: "#E19C8D",
                      marginLeft: "10px",
                      color: "black",
                    }}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleReject(notification.id, notification.user_id_from);
                    }}
                    sx={{
                      bgcolor: "#E19C8D",
                      marginLeft: "10px",
                      color: "black",
                    }}
                  >
                    Reject
                  </Button>
                </>
              )}
            </MenuItem>
          ))
        ) : (
          <MenuItem>No notifications</MenuItem>
        )}
      </Menu>
    </>
  );
};

export default Notifications;
