import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import { getSupabaseInstance } from '../supabase.js';
import { v4 } from 'uuid';
import './modals.css';
import { Rating, Box, Button } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { useAuth } from '../context/AuthProvider.jsx'
import { AirlineSeatIndividualSuiteOutlined } from '@mui/icons-material';

function MyVerticallyCenteredModal(props) {
    const [message, setMessage] = useState("");
    const [value, setValue] = useState("");
    const [currentMovie, setMovie] = useState();
    const [haveRating, setHaveRating] = useState(false);
    const [display, setDisplay] = useState("");
    const auth = useAuth();

    useEffect(() => {
        getData(props.movieId);
        fetchRating();
    }, [props.show, auth.user.id, props.movieId]);

    const getData = (id) => {
        fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US`
        )
        .then((res) => res.json())
        .then((data) => setMovie(data));
    };

    const fetchRating = async () => {
        try {
            const { data, error } = await getSupabaseInstance()
                .from("review")
                .select("*")
                .eq("movie_id", props.movieId)
                .eq("user_id", auth.user.id);

            if (error) {
                console.error("Error fetching rating", error.message);
                return;
            }

            if (data && data.length > 0) {
                const existingValue = data[0].rating;
                console.log("troubleshooting"+existingValue);
                setDisplay(existingValue);
                setValue(existingValue);
                existingValue ? setHaveRating(true) : setHaveRating(false);
            }
        } catch (error) {
            console.error("Error fetching rating", error.message);
        }
    };

    const addRating = async () => {
        const { data: existingReviewData, error: existingReviewError } = await getSupabaseInstance()
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
            const { data: updateData, error: updateError } = await getSupabaseInstance()
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
                setMessage("Rating updated successfully!");
            }
        } else {
            // Add new review
            const { data: addData, error: addError } = await getSupabaseInstance()
                .from('review')
                .insert([
                {
                    id: v4(),
                    rating: value,
                    movie_id: props.movieId,
                    user_id: auth.user.id,
                },
                ]);
        
            if (addError) {
                console.log(addError);
                return;
            }
        
            if (addData) {
                setMessage("Rating updated successfully!");
            }
        }
        setMessage("Rating updated successfully!");
        setHaveRating(true);
        setTimeout(() => {
            setMessage("");
        }, 700); 
        setValue(value);
    };

    const removeRating = async () => {
        const { data: existingReviewData, error: existingReviewError } = await getSupabaseInstance()
            .from('review')
            .select('*')
            .eq('user_id', auth.user.id)
            .eq('movie_id', props.movieId);
      
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
                rating: null
                })
                .eq('id', existingReview.id);
        
            if (updateError) {
                console.log(updateError);
                return;
            }
        
            if (updateData) {
                setMessage("Rating updated successfully!");
            }
        }
        setValue("");
        setMessage("Rating updated successfully!");
        setHaveRating(false);
        setTimeout(() => {
            setMessage("");
        }, 700); 
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
                    <h5 className="rate__this">{haveRating ? "You rated" : "Rate this" }</h5>
                    <h3 className="movie__name__modal">{currentMovie ? currentMovie.original_title : ""}</h3>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body >
            <div className="text-center">{value + "/10"}</div>
                <Box style={{
                    display: "flex",
                    justifyContent: "center"}}
                    sx={{
                        '& > legend': { mt: 2 },
                    }}
                >
                    <Rating
                        name="simple-controlled"
                        max={10}
                        value={value}
                        size="large"
                        onChange={(event, newValue) => {
                            setValue(newValue);
                        }}
                        onHoverChange={(event, newHoverValue) => {
                            setValue(newHoverValue);
                        }}
                    /> 
                </Box>
                <Box style={{
                    display: "flex",
                    justifyContent: "center"}}
                >
                    {haveRating ? <Button variant="text" className="remove-btn" onClick={removeRating}>Remove Rating</Button> : ""}
                </Box>
                {message && <div className="text-success text-center">{message}</div>}
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
                data-testid="rate-btn"
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
