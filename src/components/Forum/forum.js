import React, { useEffect, useState } from "react";
import { Card, CardText, CardTitle, CardImg } from "reactstrap";
import { Avatar, Button, IconButton } from "@mui/material";
import { getSupabaseInstance } from "../../supabase";
import "./forum.css";
import { Link } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { useAuth } from "../../context/AuthProvider.jsx";
import WriteReview from "../../modals/writeReview.js";
import Rating from "../../modals/rating.js";
import Delete from "../../modals/delete.js";
import Replies from "./replies.js";
import ReplyForm from "./replyForm.js";

const Forum = ({ movieId }) => {
  const [currentMovieReview, setMovieReview] = useState([]);
  const auth = useAuth();
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [save, setSave] = useState(false);

  useEffect(() => {
    fetchForumPosts();
  }, [movieId, currentMovieReview, selectedReviewId, save]);

  const fetchForumPosts = async () => {
    try {
      const { data, error } = await getSupabaseInstance()
        .from("review")
        .select(`*, user: user_id (email, username)`)
        .eq("movie_id", movieId);

      if (error) {
        console.error("Error fetching forum posts:", error.message);
        return;
      }

      if (data && data.length > 0) {
        setMovieReview(data);
      }
    } catch (error) {
      console.error("Error fetching forum posts:", error.message);
    }
  };

  const handleSave = async () => {
    setSave(true);
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
        fetchForumPosts();
      }
    } catch (error) {
      console.error("Error posting reply:", error.message);
    }
    fetchForumPosts();
  };

  const handleReplyButtonClick = (reviewId) => {
    if (selectedReviewId === reviewId) {
      setSelectedReviewId(null); // Hide the dropdown if the button is clicked again
    } else {
      setSelectedReviewId(reviewId);
    }
  };

  return (
    <div className="forum">
      <div className="qn">What do you think?</div>
      <div className="movie__buttons">
        <Rating movieId={movieId} />
        <WriteReview movieId={movieId} onClick={handleSave} />
      </div>
      <Card className="movie__review">
        {currentMovieReview
          .filter((review) => review.title !== null)
          .filter((review) => review.content !== null).length > 0 ? (
          currentMovieReview
            .filter((review) => review.title !== null)
            .filter((review) => review.content !== null)
            .map((review) => (
              <div className="movie__card" key={review.id}>
                <div className="profile__container">
                  <Avatar className="movie_reviewAvatar" />
                  <div className="movie_reviewEmail">
                    <Link to={`/profile/${review.user_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      {review.user.username
                        ? review.user.username
                        : review.user.email}
                    </Link>
                  </div>
                  <div className="delete-container">
                    {review.user_id === auth.user.id ? (
                      <Delete reviewId={review.id} />
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div className="movie__review_left">
                  <CardTitle tag="h5" className="movie__reviewTitle">
                    {review.title}
                  </CardTitle>
                  <CardText className="movie__reviewRating">
                    Rating: {review.rating}/10
                  </CardText>
                  <CardText className="movie__reviewContent">
                    {review.content}
                  </CardText>
                  <CardText className="movie__reviewDate">
                    Created at:{" "}
                    {new Date(review.created_at).toLocaleString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,
                    })}
                  </CardText>
                  <div className="reply-button-container">
                    <Button
                      className="reply-button"
                      variant="text"
                      onClick={() => handleReplyButtonClick(review.id)}
                      sx={{ width: "178px", textAlign: "left" }}
                    >
                      Show reply thread
                    </Button>
                  </div>
                  {selectedReviewId === review.id && (
                    <div className="replies-container">
                      <Replies reviewId={review.id} />
                      <ReplyForm
                        reviewId={review.id}
                        handleReply={handleReply}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))
        ) : (
          <div className="movie__card">No reviews available.</div>
        )}
      </Card>
    </div>
  );
};

export default Forum;
