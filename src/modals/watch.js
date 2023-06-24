import React, { useState, useEffect } from 'react';
import {Button} from '@mui/material';
import Modal from 'react-bootstrap/Modal';
import { supabase } from '../supabase.js';
import { v4 } from 'uuid';
import './modals.css';
import { useAuth } from '../context/AuthProvider.jsx';

function MyVerticallyCenteredModal(props) {
    const [message, setMessage] = useState("");
    const [remove, setRemove] = useState("");
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const auth = useAuth();
    
    useEffect(() => {
        updateString();
    }, []);

    const addWatchlist = async () => {
        const { data: existingUserData, error: existingUserError } =
            await supabase
                .from('user')
                .select('*')
                .eq('id', auth.user.id);

        if (existingUserError) {
            console.log(existingUserError);
            return;
        }

        if (existingUserData.length > 0) {
            // Update existing user
            const existingUser = existingUserData[0];
            const updatedToWatch = existingUser.to_watch.includes(props.movieId) || existingUser.watched.includes(props.movieId)
                ? existingUser.to_watch
                : [...existingUser.to_watch, props.movieId];
            const { data: updateData, error: updateError } = await supabase
                .from('user')
                .update({
                    to_watch: updatedToWatch,
                })
                .eq('id', existingUser.id);

            if (updateError) {
                console.log(updateError);
                return;
            }

            if (existingUser.to_watch.includes(props.movieId)) {
                setMessage("This movie is already in your watchlist.");
            } else if (existingUser.watched.includes(props.movieId)) {
                setMessage("This movie is already in your watch history.");
            } else {
                setMessage("Watchlist has been updated successfully!");
                setRemove("Remove from Watchlist");
                setNotice("In your watchlist");
            }

        } 
        setError('');
    };

    const addWatchHistory = async (e) => {    
        const { data: existingUserData, error: existingUserError } =
            await supabase
                .from('user')
                .select('*')
                .eq('id', auth.user.id);

        if (existingUserError) {
            console.log(existingUserError);
            return;
        }

        if (existingUserData.length > 0) {
            // Update existing user
            const existingUser = existingUserData[0];
            let updatedToWatch = existingUser.to_watch;
            let updatedWatched = existingUser.watched;
          
            if (existingUser.to_watch.includes(props.movieId)) {
                // Delete the movie from to_watch
                updatedToWatch = existingUser.to_watch.filter((movie) => movie !== props.movieId);
          
              // Add the movie to watched if it's not already there
                if (existingUser.watched.includes(props.movieId)) {
                    updatedWatched = existingUser.watched
                } else {
                    updatedWatched = [...existingUser.watched, props.movieId];
                }
            } else {
                if (existingUser.watched.includes(props.movieId)) {
                    updatedWatched = existingUser.watched
                } else {
                    updatedWatched = [...existingUser.watched, props.movieId];
                }
            }

            const { data: updateData, error: updateError } = await supabase
                .from('user')
                .update({
                    to_watch: updatedToWatch,
                    watched: updatedWatched,
                })
                .eq('id', existingUser.id);

            if (updateError) {
                console.log(updateError);
                return;
            }

            if (existingUser.watched.includes(props.movieId)) {
                setMessage("This movie is already in your watch history.");
            } else {
                setMessage("Watch history has been updated successfully!");
                setRemove("Remove from watch history");
                setNotice("In your watch history");
            }

        } 
        setError('');
    };

    const removebutton = async () => {
        const { data: existingUserData, error: existingUserError } =
            await supabase
                .from('user')
                .select('*')
                .eq('id', auth.user.id);

        if (existingUserError) {
            console.log(existingUserError);
            return;
        }

        if (existingUserData.length > 0) {
            // Update existing user
            const existingUser = existingUserData[0];
            if (existingUser.to_watch.includes(props.movieId)) {
                const updatedToWatch = existingUser.to_watch.filter((movie) => movie !== props.movieId);
                const { data: updateData, error: updateError } = await supabase
                    .from('user')
                    .update({
                        to_watch: updatedToWatch,
                    })
                    .eq('id', existingUser.id);

                if (updateError) {
                    console.log(updateError);
                    return;
                }
                setMessage("Removed from watchlist");
                setNotice("Have you ever watched this movie?");

            } else if (existingUser.watched.includes(props.movieId)) {
                const updatedWatched = existingUser.watched.filter((movie) => movie !== props.movieId);
                const { data: updateData, error: updateError } = await supabase
                    .from('user')
                    .update({
                        watched: updatedWatched,
                    })
                    .eq('id', existingUser.id);

                if (updateError) {
                    console.log(updateError);
                    return;
                }
                setMessage("Removed from watch history");
                setNotice("Have you ever watched this movie?");
            }
        }
        setRemove("");
    };

    const updateString = async () => {
        const { data: existingUserData, error: existingUserError } =
        await supabase
            .from('user')
            .select('*')
            .eq('id', auth.user.id);

        if (existingUserError) {
            console.log(existingUserError);
            return;
        }
        const existingUser = existingUserData[0];
        if (existingUser.to_watch.includes(props.movieId)) {
            setRemove("Remove from watchlist");
            setNotice("In your watchlist");
        } else if (existingUser.watched.includes(props.movieId)) {
            setRemove("Remove from watch history");
            setNotice("In your watch history");
        } else {
            setRemove("");
            setNotice("Have you watched this movie?");
        }
    };

    const handleWatchHistory = async () => {
        addWatchHistory();
    }

    const handleWatchList = async () => {
        addWatchlist();
    }

    const handleRemove = async () => {
        removebutton();
    }

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            onHide={() => {
                setMessage('');
                props.onHide();
            }}
        >
            <Modal.Header className="px-4" closeButton data-testid="close-button">
                <Modal.Title className="ms-auto">
                    <h3 className="have__you">{notice}</h3>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
                <div className="center--btn">
                    <button className="watch-btn" onClick={handleWatchList}>Add to watchlist</button>
                </div>
                <div className="center--btn">
                    <button className="watch-btn" onClick={handleWatchHistory}>Add to watch history</button>
                </div>
                <div>
                    <Button onClick={handleRemove} className="remove-btn">{remove}</Button>
                </div>
                {message && <div className="text-danger">{message}</div>}
            </Modal.Body>
        </Modal>
    );
}

function Watch({ movieId }) {
    const [modalShow, setModalShow] = useState(false);

    return (
        <>
            <button className="add-btn" onClick={() => setModalShow(true)}>
                Add this movie
            </button>

            <MyVerticallyCenteredModal
                movieId={movieId}
                show={modalShow}
                onHide={() => setModalShow(false)}
            />
        </>
    );
}

export default Watch;
