import React, { useEffect, useState } from "react";
import { Card, CardText, CardTitle, CardImg } from "reactstrap";
import { Avatar, Button, IconButton } from "@mui/material";
import { getSupabaseInstance } from "../../supabase";
import "./forum.css";
import defaultImg from "../../images/default-avatar.png";
import { v4 as uuid } from "uuid";
import { useAuth } from "../../context/AuthProvider.jsx";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { SettingsOverscanRounded } from "@mui/icons-material";
import ReplyForm from "./replyForm.js";
import { Link } from "react-router-dom";

const Replies = ({ reviewId, movieId }) => {
  const [replies, setReplies] = useState([]);
  const auth = useAuth();
  const [deleteReply, setDeleteReply] = useState(false);

  const scroll = () => {
    window.scrollTo(0, 0);
    };

  useEffect(() => {
    fetchReplies();
  }, [reviewId, replies, deleteReply]);

  const fetchReplies = async () => {
    try {
      const { data, error } = await getSupabaseInstance()
        .from("reply")
        .select(
          `*, user:user_id (email, username, avatar_url)`
        )
        .eq("review_id", reviewId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching replies:", error.message);
        return;
      }

      if (data && data.length > 0) {
        setReplies(data);
      }
      if (data.length === 0) {
        setReplies([]);
      }
    } catch (error) {
      console.error("Error fetching replies:", error.message);
    }
  };

  const handleDelete = async (replyId) => {
    try {
      const { data, error } = await getSupabaseInstance()
        .from("reply")
        .delete()
        .eq("id", replyId);

      if (error) {
        console.error("Error deleting reply:", error.message);
        return;
      }
    } catch (error) {
      console.error("Error deleting reply:", error.message);
    }
    setDeleteReply(true);
    console.log("deleting");
  };

  const handleReply = async (reviewId, replyContent) => {
    try {
      const { data, error } = await getSupabaseInstance()
        .from("reply")
        .insert([
          {
            id: uuid(),
            content: replyContent,
            review_id: reviewId,
            user_id: auth.user.id,
          },
        ]);

      if (error) {
        console.error("Error posting reply:", error.message);
        return;
      }

      if (data) {
        fetchReplies();
      }
    } catch (error) {
      console.error("Error posting reply:", error.message);
    }
    fetchReplies();
  };

  return (
    <div className="replies">
      {replies.length > 0 ? (
        replies.map((reply) => (
          <div className="reply" key={reply.id}>
            <div className="reply__container">
              {reply.user.avatar_url ? (
                <img
                  src={reply.user.avatar_url}
                  className="movie_replyAvatar"
                  alt=""
                  width="40"
                  height="40"
                  style={{ borderRadius: "50%" }}
                />
              ) : (
                <Avatar
                  className="movie_replyAvatar"
                  sx={{ width: 40, height: 40 }}
                />
              )}
              <div className="reply__first">
                <span>
                  <span className="reply__user__email">
                    <Link
                      to={`/profile/${reply.user_id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                      onClick={scroll}
                    >
                      {reply.user.username
                        ? reply.user.username
                        : reply.user.email}
                    </Link>
                  </span>
                  <span className="reply__date">
                    {new Date(reply.created_at).toLocaleString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,
                    })}
                  </span>
                </span>
                <span className="delete-icon-button">
                  {reply.user_id === auth.user.id ? (
                    <IconButton
                      className="delete-icon-button"
                      onClick={() => handleDelete(reply.id)}
                    >
                      <DeleteOutlineOutlinedIcon className="edit-icon" />
                    </IconButton>
                  ) : (
                    ""
                  )}
                </span>
              </div>
            </div>
            <CardText className="reply__user__content">
              {reply.content}
            </CardText>
          </div>
        ))
      ) : (
        <div className="no-replies">No replies yet.</div>
      )}
      <ReplyForm reviewId={reviewId} handleReply={handleReply} />
    </div>
  );
};

export default Replies;
