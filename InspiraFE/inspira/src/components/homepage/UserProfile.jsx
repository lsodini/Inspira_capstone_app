import React, { useEffect, useState } from "react";
import { Col, Container, Row, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const UserProfile = () => {
    const [userProfile, setUserProfile] = useState({});
    const [posts, setPosts] = useState([]);
    const [isArtist, setIsArtist] = useState(false); // Cambia secondo il tipo di utente

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
                    setIsArtist(data.user.isArtist);  // Impostare se l'utente è un artista
                    setPosts(data.user.posts); // Recupera i post dell'utente
                } else {
                    console.log("Dati utente non validi", data);
                }
            } catch (err) {
                console.log("Errore nel caricamento del profilo", err);
            }
        };

        fetchUserProfile();
    }, []);

    return (
        <Container>
            <Row className="my-5">
                <Col lg={4} className="text-center">
                    {/* Avatar */}
                    <img
                        src={userProfile.avatar || "default-avatar.png"} 
                        alt="Avatar"
                        className="rounded-circle img-fluid"
                        style={{ width: "150px", height: "150px" }}
                    />
                    <h3>{userProfile.name} {userProfile.surname}</h3>
                    <p>@{userProfile.username}</p>
                    <div>
                        <p><strong>{userProfile.followersCount}</strong> Follower</p>
                        <p><strong>{userProfile.followingCount}</strong> Seguiti</p>
                        {isArtist && (
                            <p><strong>{userProfile.artworksCount}</strong> Artwork</p>
                        )}
                    </div>
                </Col>
                <Col lg={8}>
                    {/* Mostra i Post dell'utente */}
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
                </Col>
            </Row>
        </Container>
    );
};

export default UserProfile;
