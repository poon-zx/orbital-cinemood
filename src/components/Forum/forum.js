import React, { useEffect, useState } from "react";
import { Card, CardText, CardTitle, CardImg } from "reactstrap";
import { Avatar, Button, IconButton } from "@mui/material";
import { supabase } from "../../supabase";
import "./forum.css";
import defaultImg from "../../images/default-avatar.png";
import { v4 as uuid } from 'uuid';
import { useAuth } from '../../context/AuthProvider.jsx';
import WriteReview from "../../modals/writeReview.js";
import Rating from "../../modals/rating.js";
import Delete from "../../modals/delete.js"
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { SettingsOverscanRounded } from "@mui/icons-material";

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

    const handleSave = async () => {
        setSave(true);
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
                <WriteReview movieId={movieId} onClick={handleSave}/>
            </div>
            <Card className="movie__review">
                {currentMovieReview
                    .filter((review) => review.title !== null)
                    .filter((review) => review.content !== null)
                    .length > 0 ? (
                    currentMovieReview
                        .filter((review) => review.title !== null)
                        .filter((review) => review.content !== null)
                        .map((review) => (
                        <div className="movie__card" key={review.id}>
                            <div className="profile__container">
                                <Avatar className="movie_reviewAvatar"/>
                                <div className="movie_reviewEmail">{review.user.username ? review.user.username : review.user.email}</div>
                                <div className="delete-container">
                                    {review.user_id === auth.user.id ? <Delete reviewId={review.id} /> : ""}
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
                                    Created at: {new Date (review.created_at).toLocaleString("en-US", {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit",
                                        hour12: true
                                        })}
                                </CardText>
                                <div className="reply-button-container">
                                    <Button
                                    className="reply-button"
                                    variant="text"
                                    onClick={() => handleReplyButtonClick(review.id)}
                                    sx={{width:"178px", textAlign: "left"}}
                                    >
                                        Show reply thread
                                    </Button>
                                </div>
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

const Replies = ({ reviewId, deleteReply = false}) => {
    const [replies, setReplies] = useState([]);
    const auth = useAuth();

    useEffect(() => {
        fetchReplies();
    }, [reviewId, replies, deleteReply]);

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

    const handleDelete = async (replyId) => {
        try {
            const { data, error } = await supabase
                .from("reply")
                .delete()
                .eq("id", replyId);

            if (error) {
                console.error("Error deleting reply:", error.message);
                return;
            }

            if (data) {
                deleteReply = true;
                fetchReplies();
            }
        } catch (error) {
            console.error("Error deleting reply:", error.message);
        }
    };

    return (
        <div className="replies">
            {replies.length > 0 ? (
                replies.map((reply) => (
                    <div className="reply" key={reply.id}>
                        <div className="reply__container">
                            <Avatar />
                            <div className="reply__first">
                                <span>
                                    <span className="reply__user__email">
                                    {reply.user.username ? reply.user.username : reply.user.email}
                                    </span>
                                    <span className="reply__date">
                                        {new Date (reply.created_at).toLocaleString("en-US", {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit",
                                        hour12: true
                                        })}
                                    </span>
                                </span>
                                <span className="delete-icon-button">
                                    {reply.user_id === auth.user.id ?
                                    <IconButton
                                        className="delete-icon-button"
                                        onClick={() => handleDelete(reply.id)}
                                    >
                                        <DeleteOutlineOutlinedIcon className="edit-icon" />
                                    </IconButton> : ""
                                    }
                                </span>
                            </div>
                        </div>
                        <CardText className="reply__user__content">{reply.content}</CardText>
                    </div>
                ))
            ) : (
                <div className="no-replies">No replies yet.</div>
            )}
        </div>
    );
};

export default Forum;
