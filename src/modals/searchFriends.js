import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { getSupabaseInstance } from '../supabase.js';
import { Card, IconButton } from "@mui/material"
import GroupAddTwoToneIcon from '@mui/icons-material/GroupAddTwoTone';
import './modals.css';
import FriendsCard from '../pages/Friends/friendsCard.js';
import { useAuth } from "../context/AuthProvider.jsx";

function MyVerticallyCenteredModal(props) {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searchPerformed, setSearchPerformed] = useState(false);
    const auth = useAuth();

    const handleSearch = async () => {
        const { data, error } = await getSupabaseInstance()
            .from("user")
            .select("*")
            .ilike("username", `%${searchQuery}%`)
            .neq("id", auth.user.id);

        if (error) {
            console.error("Error searching friends:", error.message);
            return;
        }

        if (data) {
            setSearchResults(data);
            setSearchPerformed(true);
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            handleSearch();
        }
    };

    // Reset the search query and search performed state when the modal is opened or closed
    useEffect(() => {
        setSearchQuery("");
        setSearchPerformed(false);
    }, [props.show]);

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title className="ms-auto">
                    Search All Users
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
                <input
                    className="reply-input"
                    type="text"
                    placeholder="Search friends"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <button className="search-btn" onClick={handleSearch}>Search</button>
                <div>
                    {searchPerformed && searchResults.length > 0 ? (
                        searchResults.map((friend) => <FriendsCard friend={friend} key={friend.id} />)
                    ) : null}
                    {searchPerformed && searchResults.length === 0 ? (
                        "No search results found"
                    ) : null}
                </div>
            </Modal.Body>
        </Modal>
    );
}

function SearchFriends() {
    const [modalShow, setModalShow] = useState(false);

    return (
        <>
            <IconButton
                className="edit-icon-button"
                onClick={() => setModalShow(true)}
                style={{marginTop: "1rem"}}
            >
                <GroupAddTwoToneIcon className="edit-icon" 
                    style={{ width: "30px", height: "30px"}}
                />
            </IconButton>

            <MyVerticallyCenteredModal
                show={modalShow}
                onHide={() => setModalShow(false)}
            />
        </>
    );
}

export default SearchFriends;
