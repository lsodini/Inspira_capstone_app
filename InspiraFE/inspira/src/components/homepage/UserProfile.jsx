import React, { useEffect, useState } from "react";
import { Col, Container, Row, Button, Modal, Form } from "react-bootstrap";
import { Link } from "react-router-dom";

const UserProfile = () => {
    const [userProfile, setUserProfile] = useState({});
    const [posts, setPosts] = useState([]);
    const [isArtist, setIsArtist] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [newPost, setNewPost] = useState({ caption: "", imageUrl: "" });

    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem("Access Token");
            if (!token) {
                console.log("Token mancante");
                return;
            }

            try {
                const response = await fetch("http://localhost:3001/api/utenti/me", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Errore nel recupero del profilo");
                }

                const data = await response.json();
                if (data && data.user) {
                    setUserProfile(data.user);
                    setIsArtist(data.user.role === "ARTIST");
                    setPosts(data.user.posts);
                } else {
                    console.log("Dati utente non validi", data);
                }
            } catch (err) {
                console.log("Errore nel caricamento del profilo", err);
            }
        };

        fetchUserProfile();
    }, []);

    const handleBecomeArtist = async () => {
        const token = localStorage.getItem("Access Token");
        if (!token) {
            console.log("Token mancante");
            return;
        }

        try {
            const response = await fetch("http://localhost:3001/api/utenti/me/become-artist", {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const updatedUser = await response.json();
                setUserProfile(updatedUser);
                setIsArtist(true);
            } else {
                console.log("Errore nel diventare artista");
            }
        } catch (err) {
            console.log("Errore nel diventare artista", err);
        }
    };

    const handlePostChange = (e) => {
        const { name, value } = e.target;
        setNewPost((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmitPost = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("Access Token");
        if (!token) {
            console.log("Token mancante");
            return;
        }

        try {
            const response = await fetch("http://localhost:3001/api/posts/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newPost),
            });

            if (response.ok) {
                const createdPost = await response.json();
                setPosts((prevPosts) => [...prevPosts, createdPost]);
                setShowModal(false); // Chiudi il modale dopo aver aggiunto il post
            } else {
                console.log("Errore nella creazione del post");
            }
        } catch (err) {
            console.log("Errore nella creazione del post", err);
        }
    };

    return (
        <div>
            <Row className="my-5">
                <Col lg={4} className="text-center">
                    <img
                        src={userProfile.avatarUrl || "user.png"}
                        alt="Avatar"
                        className="rounded-circle img-fluid"
                        style={{ width: "150px", height: "150px" }}
                    />
                    <h3>{userProfile.name} {userProfile.surname}</h3>
                    <p>@{userProfile.username}</p>
                    <p>{userProfile.email}</p>
                    <p>{userProfile.bio}</p> {/* Aggiunto campo bio */}
                    <div>
                        <p><strong>{userProfile.followersCount}</strong> Follower</p>
                        <p><strong>{userProfile.followingCount}</strong> Seguiti</p>
                        {isArtist && (
                            <p><strong>{userProfile.artworksCount}</strong> Artwork</p>
                        )}
                    </div>
                    {!isArtist && (
                        <Button onClick={handleBecomeArtist}>Diventa Artista</Button>
                    )}
                </Col>
                <Col lg={8}>
                    <h4>Post Recenti</h4>
                    <div>
                        {posts.length > 0 ? (
                            posts.map((post, index) => (
                                <div key={index} className="post-card my-3">
                                    <img src={post.imageUrl} alt="Post" className="img-fluid" />
                                    <div className="d-flex justify-content-between">
                                        <div>{post.caption}</div>
                                        <Button variant="primary">Metti Like</Button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>Non hai ancora pubblicato alcun post.</p>
                        )}
                    </div>
                    <Button onClick={() => setShowModal(true)}>Aggiungi Post</Button>
                </Col>
            </Row>

            {/* Modal per aggiungere post */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Aggiungi Post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmitPost}>
                        <Form.Group controlId="caption">
                            <Form.Label>Descrizione</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Scrivi una descrizione"
                                name="caption"
                                value={newPost.caption}
                                onChange={handlePostChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="imageUrl">
                            <Form.Label>URL Immagine</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Inserisci URL immagine"
                                name="imageUrl"
                                value={newPost.imageUrl}
                                onChange={handlePostChange}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Pubblica
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default UserProfile;
