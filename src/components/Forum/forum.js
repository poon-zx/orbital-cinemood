import React, { useEffect, useState } from "react";
import { Card, CardText, CardTitle, CardImg } from "reactstrap";
import { Avatar, Button } from "@mui/material";
import { getSupabaseInstance } from "../../supabase";
import "./forum.css";
import { Link } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { useAuth } from "../../context/AuthProvider.jsx";
import WriteReview from "../../modals/writeReview.js";
import Rating from "../../modals/rating.js";
import Delete from "../../modals/delete.js";
import Replies from "./replies.js";
import EditIcon from '@mui/icons-material/Edit';

const Forum = ({ movieId }) => {
  const [currentMovieReview, setMovieReview] = useState(null);
  const auth = useAuth();
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [reviewExists, setReviewExists] = useState(false); // Added state for review existence

  useEffect(() => {
    fetchForumPosts();
    checkReviewExistence()
  }, [movieId, currentMovieReview, selectedReviewId]);

  const scroll = () => {
    window.scrollTo(0, 0);
    };

  const fetchForumPosts = async () => {
    try {
      const { data, error } = await getSupabaseInstance()
        .from("review")
        .select(`*, user: user_id (email, username, avatar_url)`)
        .eq("movie_id", movieId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching forum posts:", error.message);
        return;
      }

      if (data && data.length > 0) {
        setMovieReview(data);
      } else {
        setMovieReview([]);
      }
    } catch (error) {
      console.error("Error fetching forum posts:", error.message);
    }
  };
    const checkReviewExistence = async () => {
        const { data, error } = await getSupabaseInstance()
            .from("review")
            .select("*")
            .eq("movie_id", movieId)
            .eq("user_id", auth.user.id);

        if (error) {
            console.error("Error checking review existence:", error.message);
            return;
        }

        if (data && data.length > 0 && data[0].title) {
            setReviewExists(true);
        } else {
            setReviewExists(false);
        }
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
            <button className="review-btn" onClick={() => setModalShow(true)}>
                    {reviewExists ? 'Edit Review' : 'Write Review'}<EditIcon style={{marginLeft: '3px', marginTop: '-1.5px'}} sx={{width:'18px', height:'18px'}}/>
            </button>

            <WriteReview
                movieId={movieId}
                show={modalShow}
                onHide={() => setModalShow(false)}
                onReviewExists={setReviewExists}
            />
        </div>
        <Card className="movie__review">
            {currentMovieReview !== null && currentMovieReview
            .filter((review) => review.title !== null)
            .filter((review) => review.content !== null).length > 0 ? (
            currentMovieReview
                .filter((review) => review.title !== null)
                .filter((review) => review.content !== null)
                .map((review) => (
                <div className="movie__card" key={review.id}>
                    <div className="profile__container">
                    {review.user.avatar_url ? <img src={review.user.avatar_url} className="movie_reviewAvatar" alt="" width="60" height="60" style={{borderRadius: "50%"}}/> : <Avatar className="movie_reviewAvatar" sx={{width: 60, height: 60}}/>}
                    <div className="movie_reviewEmail">
                        <Link to={`/profile/${review.user_id}`} style={{ textDecoration: 'none', color: 'inherit' }} onClick={scroll}>
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
                        {review.rating ? "Rating: " + review.rating + "/10" : ""}
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
                            {selectedReviewId === review.id ? "Hide reply thread" : "Show reply thread"}
                        </Button>
                    </div>
                    {selectedReviewId === review.id && (
                        <div className="replies-container">
                        <Replies reviewId={review.id} movieId={movieId}/>
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
