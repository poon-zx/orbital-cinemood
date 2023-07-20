import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import { getSupabaseInstance } from '../supabase.js';
import { v4 } from 'uuid';
import './modals.css';
import { Box, IconButton } from '@mui/material';
import Button from 'react-bootstrap/Button';
import { useAuth } from '../context/AuthProvider.jsx';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

function MyVerticallyCenteredModal(props) {
    const [message, setMessage] = useState("");
    const [value, setValue] = useState("");
    const auth = useAuth();

    const deleteReview = async () => {
        const { data: existingReviewData, error: existingReviewError } = await getSupabaseInstance()
            .from('review')
            .select('*')
            .eq('id', props.reviewId);
      
        if (existingReviewError) {
            console.log(existingReviewError);
            return;
        }
      
        if (existingReviewData.length > 0) {
            // delete existing review
            const existingReview = existingReviewData[0];
            const { data: updateData, error: updateError } = await getSupabaseInstance()
                .from('review')
                .update({
                    title: null,
                    content: null,
                    created_at: null
                })
                .eq('id', existingReview.id);
        
            if (updateError) {
                console.log(updateError);
                return;
            }
        
            if (updateData) {
                setMessage("Review deleted successfully!");
            }
        }
        setMessage("Review deleted successfully!");
        setTimeout(() => {
            setMessage("");
        }, 800); 
        setValue("");
        props.onHide();
    }

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header className="px-4" closeButton>
                <Modal.Title className="ms-auto">
                    <h5 className="rate__this">Are you sure you want to delete this review?</h5>              
                </Modal.Title>
            </Modal.Header>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.onHide}>
                    Close
                </Button>
                <Button variant="primary" onClick={deleteReview}>
                    Delete
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

function Delete({ reviewId }) {
    const [modalShow, setModalShow] = useState(false);

    return (
        <>
            <IconButton
                className="edit-icon-button"
                onClick={() => setModalShow(true)}
            >
                <DeleteOutlineOutlinedIcon className="edit-icon" />
            </IconButton>

            <MyVerticallyCenteredModal
                reviewId={ reviewId }
                show={modalShow}
                onHide={() => setModalShow(false)}
            />
        </>
    );
}

export default Delete;
