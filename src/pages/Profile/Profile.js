import React, { useEffect, useState } from "react";
import { Card, Container, Row, Col } from "reactstrap";
import { Avatar, Button, IconButton } from "@mui/material";
import { getSupabaseInstance } from "../../supabase";
import { useAuth } from "../../context/AuthProvider.jsx";
import EditIcon from "@mui/icons-material/Edit";
import "./Profile.css";
import Watchlist from "./Watchlist";
import Watchhistory from "./Watchhistory";
import Recommendations from "./Recommendations";

const Profile = () => {
  const auth = useAuth();
  const [profile, setProfile] = useState([]);
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (!editing) {
      fetchProfile();
    }
  }, [editing]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await getSupabaseInstance()
        .from("user")
        .select("*")
        .eq("id", auth.user.id);

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
      .eq("id", auth.user.id);

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
                      <a href="#pablo" onClick={(e) => e.preventDefault()}>
                        <Avatar
                          className="profile-pic"
                          sx={{ height: "150px", width: "150px" }}
                        ></Avatar>
                      </a>
                    </div>
                  </Col>
                  <Col
                    className="order-lg-3 text-lg-right align-self-lg-center"
                    lg="4"
                  >
                    <div className="card-profile-actions">
                      <button
                        className="profile-btn"
                        onClick={(e) => e.preventDefault()}
                        size="sm"
                      >
                        Connect
                      </button>
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
                  <h5 className="display">display name</h5>
                  <h3 className="name">
                    {editing ? (
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
                        {profile.username ? profile.username : profile.email}
                        <IconButton
                          className="edit-icon-button"
                          onClick={handleEdit}
                          disabled={editing}
                          data-testid="edit-btn"
                        >
                          <EditIcon className="edit-icon" />
                        </IconButton>
                      </>
                    )}
                  </h3>
                  <div className="box">Watchlist</div>
                  <div className="watch-container">
                    <Watchlist user_id={auth.user.id} />
                  </div>
                  <div className="box">Watch history</div>
                  <div className="watch-container">
                    <Watchhistory user_id={auth.user.id} />
                  </div>
                  <div className="box">Movies you may like</div>
                  <div className="watch-container">
                    <Recommendations user_id={auth.user.id} />
                  </div>
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
