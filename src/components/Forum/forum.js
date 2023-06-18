import React, { useEffect, useState } from "react";
import { Card, CardText, CardTitle, CardImg } from "reactstrap";
import { Avatar } from "@mui/material";
import { supabase } from "../../supabase";
import "./forum.css";
import defaultImg from "../../images/default-avatar.png";

const Forum = ({ movieId }) => {
    const [currentMovieReview, setMovieReview] = useState([]);

    useEffect(() => {
        fetchForumPosts();
    }, []);

    const fetchForumPosts = async () => {
        try {
            const { data, error } = await supabase
                .from("review")
                .select("*")
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

    return (
        <div className= "forum">
            <Card className="movie__review">
                {currentMovieReview.length > 0 ? (
                    currentMovieReview.map((review) => (
                        <div className="movie__card" key={review.id}>
                            <Avatar/>
                            <div className="movie__review_left">
                                <CardTitle tag="h5" className="movie__reviewTitle">
                                        {review.title}
                                </CardTitle>
                                {review.rating && (
                                    <CardText className="movie__reviewRating">
                                        Rating: {review.rating}/10
                                    </CardText>
                                )}
                                <CardText className="movie__reviewContent">
                                    {review.content}
                                </CardText>
                                <CardText className="movie__reviewDate">
                                    Created at: {review.created_at}
                                </CardText>
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
