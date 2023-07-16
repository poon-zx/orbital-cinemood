import React, { useEffect, useState } from "react";
import { Card, Container, Row, Col } from "reactstrap";
import { Avatar, Button, IconButton } from "@mui/material";
import { getSupabaseInstance } from "../../supabase";
import { useAuth } from "../../context/AuthProvider.jsx";
import EditIcon from "@mui/icons-material/Edit";
import { useParams, Link } from "react-router-dom";
import "./Profile.css";
import Watchlist from "./Watchlist";
import Watchhistory from "./Watchhistory";
import Recommendations from "./Recommendations";
import SendFriendRequest from "./SendFriendRequest";
import { Crop, Send } from "@mui/icons-material";
import Cropper from "../../components/Profile/Cropper";
import RemoveFriend from "./RemoveFriend";
import PersonalStats from "./PersonalStats";

const Profile = () => {
  const auth = useAuth();
  const { id: urlId } = useParams(); // Extract user ID from the URL
  const [profile, setProfile] = useState([]);
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [isFriend, setIsFriend] = useState(false);

  const currentUserId = auth.user.id; // Store current user's ID in a variable
  console.log(currentUserId);
  console.log(urlId);
  const viewingOwnProfile = String(urlId) === String(currentUserId); // Check if the user is viewing their own profile
  console.log(viewingOwnProfile);

  useEffect(() => {
    if (!editing) {
      fetchProfile();
    }
  }, [editing, urlId]);

  useEffect(() => {
    checkFriend();
  }, [urlId, currentUserId]);
  
  // if other user check if friend, return true
  const checkFriend = async () => {
    const { data: currentFriends, error: fetchFriendsError } =
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

    if (friends.includes(urlId)) {
      setIsFriend(true);
    } else {
      setIsFriend(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const { data, error } = await getSupabaseInstance()
        .from("user")
        .select("*")
        .eq("id", urlId);

      if (error) {
        console.error("Error fetching profile:", error.message);
        return;
      }

      if (data) {
        setProfile(data[0]);
      }
    } catch (error) {
      console.error("Error fetching profile:", error.message);
    }
  };

  const handleSave = async () => {
    const { data, error } = await getSupabaseInstance()
      .from("user")
      .select("*")
      .eq("id", urlId);

    if (error) {
      console.log(error);
      return;
    }
    if (data) {
      const user = data[0];
      const { updateData, updateError } = await getSupabaseInstance()
        .from("user")
        .update({
          username: username,
        })
        .eq("id", user.id);
      if (updateError) {
        console.log(updateError);
        return;
      }
    }
    setEditing(false);
  };

  const handleEdit = async () => {
    setEditing(true);
  };

  const handleCancel = async () => {
    setEditing(false);
  };

  return (
    <>
      <div className="profile-page">
        <section className="section">
          <Container className="container">
            <Card className="card-profile shadow mt--300">
              <div className="px-4">
                <Row className="justify-content-center">
                  <Col className="order-lg-2" xs="12" md="4">
                    <div className="card-profile-image">
                      <Cropper />
                    </div>
                  </Col>
                  <Col
                    className="order-lg-3 text-lg-right align-self-lg-center"
                    lg="4"
                  >
                    <div className="card-profile-actions">
                      {!viewingOwnProfile ? (
                        <>
                          {isFriend ? (
                            <RemoveFriend
                              currentUserId={currentUserId}
                              friendUserId={urlId}
                              afterFriendRemoved={checkFriend}
                            />
                          ) : (
                            <SendFriendRequest
                              currentUserId={currentUserId}
                              friendUserId={urlId}
                              afterRequestSent={checkFriend}
                            />
                          )}
                          <Button
                            className="profile-btn"
                            data-testid="blend-btn"
                            component={Link}
                            to={`/blend/${urlId}`}
                            size="lg"
                            style={{
                              color: "inherit",
                              textTransform: "none",
                              marginTop: "-3px",
                            }}
                          >
                            Movie Blend
                          </Button>
                        </>) : (<Button
                            className="profile-btn"
                            data-testid="cine-stats-btn"
                            component={Link}
                            to={`/stats/${urlId}`}
                            size="lg"
                            style={{
                              color: "inherit",
                              textTransform: "none",
                              marginTop: "-3px",
                            }}
                          >
                            CineStats
                          </Button>)
                      }
                    </div>
                  </Col>
                  <Col className="order-lg-1">
                    <div className="card-profile-stats d-flex justify-content-center">
                      <div>
                        <div className="heading">
                          {profile.to_watch ? profile.to_watch.length : 0}
                        </div>
                        <div className="description">To Watch</div>
                      </div>
                      <div>
                        <div className="heading">
                          {profile.watched ? profile.watched.length : 0}
                        </div>
                        <div className="description">Watched</div>
                      </div>
                    </div>
                  </Col>
                </Row>
                <div className="text-center mt-5">
                  <div
                    className="name-display-container"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <h5 className="display">display name</h5>
                    <div
                      className="name-container"
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <h3
                        className="name"
                        style={{
                          marginLeft: viewingOwnProfile ? "45px" : "10px",
                        }}
                      >
                        {editing && viewingOwnProfile ? (
                          <>
                            <input
                              type="text"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              className="edit-username"
                            />
                            <Button onClick={handleSave}>save</Button>
                            <Button onClick={handleCancel}>cancel</Button>
                          </>
                        ) : (
                          <>
                            {profile.username
                              ? profile.username
                              : profile.email}
                            {viewingOwnProfile && (
                              <IconButton
                                className={"edit-icon-button"}
                                onClick={handleEdit}
                                disabled={editing}
                                data-testid="edit-btn"
                              >
                                <EditIcon className="edit-icon" />
                              </IconButton>
                            )}
                          </>
                        )}
                      </h3>
                    </div>
                  </div>
                  <div className="box">Watchlist</div>
                  <div className="watch-container">
                    <Watchlist user_id={urlId} />
                  </div>
                  <div className="box">Watch history</div>
                  <div className="watch-container">
                    <Watchhistory user_id={urlId} />
                  </div>
                  {viewingOwnProfile && (
                    <>
                      <div className="box">
                        Movies you may like (based on watch history and ratings)
                      </div>
                      <div className="watch-container">
                        <Recommendations user_ids={[auth.user.id]} />
                      </div>
                    </>
                  )}
                </div>
                <div className="mt-5 py-5 border-top text-center"></div>
              </div>
            </Card>
          </Container>
        </section>
      </div>
    </>
  );
};

export default Profile;
