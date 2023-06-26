import React, { useEffect, useState } from "react";
import { Card, CardText, CardTitle, CardImg } from "reactstrap";
import { Avatar, Button, IconButton } from "@mui/material";
import { getSupabaseInstance } from "../../supabase";
import "./forum.css";
import defaultImg from "../../images/default-avatar.png";
import { v4 as uuid } from 'uuid';
import { useAuth } from '../../context/AuthProvider.jsx';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { SettingsOverscanRounded } from "@mui/icons-material";

const Replies = ({ reviewId, deleteReply = false}) => {
    const [replies, setReplies] = useState([]);
    const auth = useAuth();

    useEffect(() => {
        fetchReplies();
    }, [reviewId, replies, deleteReply]);

    const fetchReplies = async () => {
        try {
            const { data, error } = await getSupabaseInstance()
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
            const { data, error } = await getSupabaseInstance()
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

export default Replies;