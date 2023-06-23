import React, { useEffect, useState } from "react";
import { Card, CardText, CardTitle, CardImg } from "reactstrap";
import { Avatar, Button } from "@mui/material";
import { supabase } from "../../supabase";
import "./forum.css";
import defaultImg from "../../images/default-avatar.png";
import { v4 as uuid } from 'uuid';
import { useAuth } from '../../context/AuthProvider.jsx';

const Forum = ({ movieId }) => {
    const [currentMovieReview, setMovieReview] = useState([]);
    const auth = useAuth();
    const [selectedReviewId, setSelectedReviewId] = useState(null);

    useEffect(() => {
        fetchForumPosts();
    }, []);

    const fetchForumPosts = async () => {
        try {
            const { data, error } = await supabase
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

    const handleReply = async (reviewId, replyContent) => {
        try {
            const { data, error } = await supabase.from("reply").insert([
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
                fetchForumPosts(); // Refresh the forum posts to display the new reply
            }
        } catch (error) {
            console.error("Error posting reply:", error.message);
        }
        window.location.reload();
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
            <Card className="movie__review">
                {currentMovieReview
                    .filter((review) => review.title !== null)
                    .filter((review) => review.content !== null)
                    .length > 0 ? (
                    currentMovieReview.map((review) => (
                        <div className="movie__card" key={review.id}>
                            <div className="profile__container">
                                <Avatar className="movie_reviewAvatar"/>
                                <div className="movie_reviewEmail">{review.user.username ? review.user.username : review.user.email}</div>
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
                                    Created at: {review.created_at}
                                </CardText>
                                <Button
                                    className="reply-button"
                                    variant="text"
                                    onClick={() => handleReplyButtonClick(review.id)}
                                >
                                    Reply
                                </Button>
                                {selectedReviewId === review.id && (
                                    <div className="replies-container">
                                        <Replies reviewId={review.id} />
                                        <ReplyForm reviewId={review.id} handleReply={handleReply} />
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

const ReplyForm = ({ reviewId, handleReply }) => {
    const [replyContent, setReplyContent] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (replyContent.trim() !== "") {
            handleReply(reviewId, replyContent);
            setReplyContent("");
        }
    };

    return (
        <form className="reply-form" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Write a reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
            />
            <button type="submit">Reply</button>
        </form>
    );
};

const Replies = ({ reviewId }) => {
    const [replies, setReplies] = useState([]);

    useEffect(() => {
        fetchReplies();
    }, []);

    const fetchReplies = async () => {
        try {
            const { data, error } = await supabase
                .from("reply")
                .select(`*, 
                    user:user_id (email, username)`
                )
                .eq("review_id", reviewId);

            if (error) {
                console.error("Error fetching replies:", error.message);
                return;
            }

            if (data && data.length > 0) {
                setReplies(data);
            }
        } catch (error) {
            console.error("Error fetching replies:", error.message);
        }
    };

    return (
        <div className="replies">
            {replies.length > 0 ? (
                replies.map((reply) => (
                    <div className="reply" key={reply.id}>
                        <div className="reply__container">
                            <Avatar />
                            <div className="reply__user">
                                <div className="reply__user__email">{reply.user.username ? reply.user.username : reply.user.email}</div>
                                <CardText className="reply__user__content">{reply.content}</CardText>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="no-replies">No replies yet.</div>
            )}
        </div>
    );
};

export default Forum;
