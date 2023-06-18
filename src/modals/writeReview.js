import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { supabase } from '../supabase.js';
import { v4 } from 'uuid';
import './modals.css';
import { useAuth } from '../context/AuthProvider.jsx';

function MyVerticallyCenteredModal(props) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const auth = useAuth();

    const addReview = async (e) => {
        e.preventDefault();

        if (title.trim() === '' || content.trim() === '') {
            setError('Title and content fields cannot be empty');
            return;
        }

        const { data: existingReviewData, error: existingReviewError } =
            await supabase
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
                    title: title,
                    content: content
                })
                .eq('id', existingReview.id);

            if (updateError) {
                console.log(updateError);
                return;
            }

            if (updateData) {
                setMessage('Review updated successfully!');
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
                setMessage('Review added successfully!');
            }
        }

        setTitle('');
        setContent('');
        setError('');
        props.onHide();
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            addReview(event);
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
                    Write a Review!
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form>
                    <div className="form-group">
                        <label>Headline</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Write a headline for your review"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                    <div className="form-group">
                        <label>Your Review</label>
                        <textarea
                            rows="5"
                            className="form-control"
                            placeholder="Write your review here"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>
                    {error && <div className="text-danger">{error}</div>}
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.onHide}>
                    Close
                </Button>
                <Button variant="primary" onClick={addReview}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

function WriteReview({ movieId }) {
    const [modalShow, setModalShow] = useState(false);

    return (
        <>
            <button className="review-btn" onClick={() => setModalShow(true)}>
                Write a Review
            </button>

            <MyVerticallyCenteredModal
                movieId={movieId}
                show={modalShow}
                onHide={() => setModalShow(false)}
            />
        </>
    );
}

export default WriteReview;
