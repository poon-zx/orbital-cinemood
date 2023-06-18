import React, { useState } from 'react';
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
    const auth = useAuth();

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
    };

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Rate this
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Box
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
                <Button variant="text" className="remove-btn">Remove Rating</Button>
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
