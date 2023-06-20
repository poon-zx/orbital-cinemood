import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import { supabase } from '../supabase.js';
import { v4 } from 'uuid';
import './modals.css';
import { Rating, Box, Button } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { useAuth } from '../context/AuthProvider.jsx'

function MyVerticallyCenteredModal(props) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [message, setMessage] = useState("");
    const [value, setValue] = useState("");
    const [currentMovie, setMovie] = useState();
    const auth = useAuth();

    useEffect(() => {
        getData(props.movieId);
        window.scrollTo(0, 0);
    }, []);

    const getData = (id) => {
        fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=0d3e5f1c5b02f2f9d8de3dad573c9847&language=en-US`
        )
        .then((res) => res.json())
        .then((data) => setMovie(data));
    };

    const addRating = async () => {
        const { data: existingReviewData, error: existingReviewError } = await supabase
            .from('review')
            .select('*')
            .eq('user_id', auth.user.id)
            .eq('movie_id', props.movieId);
      
        if (existingReviewError) {
            console.log(existingReviewError);
            return;
        }
      
        if (existingReviewData.length > 0) {
            // Update existing review
            const existingReview = existingReviewData[0];
            const { data: updateData, error: updateError } = await supabase
                .from('review')
                .update({
                rating: value
                })
                .eq('id', existingReview.id);
        
            if (updateError) {
                console.log(updateError);
                return;
            }
        
            if (updateData) {
                setMessage("Review updated successfully!");
            }
        } else {
            // Add new review
            const { data: addData, error: addError } = await supabase
                .from('review')
                .insert([
                {
                    id: v4(),
                    title: title,
                    content: content,
                    movie_id: props.movieId,
                    user_id: auth.user.id
                },
                ]);
        
            if (addError) {
                console.log(addError);
                return;
            }
        
            if (addData) {
                setMessage("Review added successfully!");
            }
        }
        props.onHide();
        window.location.reload();
    };

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title className="ms-auto">
                    <h4 className="rate__this">Rate this </h4>
                    <h3 className="movie__name">{currentMovie ? currentMovie.original_title : ""}</h3>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body >
                <Box style={{
                    display: "flex",
                    justifyContent: "center"}}
                    sx={{
                        '& > legend': { mt: 2 },
                    }}
                >
                    <Rating
                        name="simple-controlled"
                        max = {10}
                        value={value}
                        size="large"
                        onChange={(event, newValue) => {
                        setValue(newValue);
                        }}
                    /> 
                </Box>
                <Box style={{
                    display: "flex",
                    justifyContent: "center"}}
                >
                    <Button variant="text" className="remove-btn">Remove Rating</Button>
                </Box>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.onHide}>
                    Close
                </Button>
                <Button variant="primary" onClick={addRating}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

function Rate({ movieId }) {
    const [modalShow, setModalShow] = useState(false);

    return (
        <>
            <Button
                variant="text"
                className="rate-btn"
                onClick={() => setModalShow(true)}
                size="small"
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <StarIcon className= "star" size = "large" sx={{ fontSize: '3rem', color: '#E19C8D'}}/>
                    <span style={{ color: 'black' }}>Rate</span>
                </Box>
            </Button>

            <MyVerticallyCenteredModal
                movieId={ movieId }
                show={modalShow}
                onHide={() => setModalShow(false)}
            />
        </>
    );
}

export default Rate;
