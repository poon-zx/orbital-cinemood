import React, { useState } from "react";

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
                className="reply-input"
                type="text"
                placeholder="Write a reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
            />
            <button className="reply-btn" type="submit">Reply</button>
        </form>
    );
};

export default ReplyForm;