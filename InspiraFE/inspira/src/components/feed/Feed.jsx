import React, { useState, useEffect } from "react";
import Artwork from "../../components/otherUserPage/Artwork";
import Posts from "../../components/otherUserPage/Post";
import "../../css/feed.css";

const Feed = () => {
  const [feedItems, setFeedItems] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [followingStatus, setFollowingStatus] = useState({});
  const [activeSection, setActiveSection] = useState("posts");

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("Non autenticato. Effettua il login.");
          setLoading(false);
          return;
        }

        const postsResponse = await fetch("http://localhost:3001/api/posts/feed", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!postsResponse.ok) {
          throw new Error(`Errore HTTP: ${postsResponse.status}`);
        }
        const postsData = await postsResponse.json();

        const artworksResponse = await fetch("http://localhost:3001/api/artworks/feed", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!artworksResponse.ok) {
          throw new Error(`Errore HTTP: ${artworksResponse.status}`);
        }
        const artworksData = await artworksResponse.json();

        setFeedItems({ posts: postsData, artworks: artworksData });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchSuggestedUsers = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("Non autenticato. Effettua il login.");
          return;
        }

        const userId = localStorage.getItem("userId");
        const response = await fetch(`http://localhost:3001/api/follow/${userId}/suggestions`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Errore HTTP: ${response.status}`);
        }

        const suggestedUsersData = await response.json();
        setSuggestedUsers(suggestedUsersData);

        const initialStatus = {};
        suggestedUsersData.forEach((user) => {
          initialStatus[user.id] = user.isFollowing;
        });
        setFollowingStatus(initialStatus);
      } catch (err) {
        console.error("Errore nel recupero degli utenti suggeriti:", err);
      }
    };

    fetchFeed();
    fetchSuggestedUsers();
  }, []);

  const handleUpdateArtwork = (updatedArtwork) => {
    setFeedItems(prevItems => ({
      ...prevItems,
      artworks: prevItems.artworks.map(item =>
        item.id === updatedArtwork.id ? updatedArtwork : item
      )
    }));
  };
  

  const handleDeleteArtwork = async (artworkId) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://localhost:3001/api/artworks/${artworkId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Errore HTTP: ${response.status}`);
      }
  
      setFeedItems(prevItems => ({
        ...prevItems,
        artworks: prevItems.artworks.filter(item => item.id !== artworkId)
      }));
    } catch (err) {
      setError(`Errore durante l'eliminazione: ${err.message}`);
    }
  };
  
  const handleDeletePost = async (postId) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://localhost:3001/api/posts/delete/${postId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Errore HTTP: ${response.status}`);
      }
  
      setFeedItems((prevItems) => ({
        ...prevItems,
        posts: prevItems.posts.filter((item) => item.id !== postId),
      }));
    } catch (err) {
      setError(`Errore durante l'eliminazione: ${err.message}`);
    }
  };

  const handleFollowUnfollow = async (userId) => {
    const token = localStorage.getItem("authToken");
    const currentUserId = localStorage.getItem("userId");
    if (!token || !currentUserId) {
      setError("Non autenticato. Effettua il login.");
      return;
    }

    try {
      const action = followingStatus[userId] ? "unfollow" : "follow";
      const url = `http://localhost:3001/api/follow/${currentUserId}/${action}/${userId}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Errore HTTP: ${response.status}`);
      }

      setFollowingStatus((prevStatus) => ({
        ...prevStatus,
        [userId]: !prevStatus[userId],
      }));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Caricamento in corso...</div>;
  if (error) return <div>Errore: {error}</div>;

  return (
    <div className="feed-container">
      {/* Selettore per cambiare sezione */}
      <div className="feed-selector">
        <button className="edit-button"type="button" onClick={(e) => {e.preventDefault(); setActiveSection("posts")}}>Post</button>
        <button className="edit-button" type="button" onClick={(e) => {e.preventDefault(); setActiveSection("artworks")}}>Artwork</button>
        <button className="edit-button" type="button" onClick={(e) => {e.preventDefault(); setActiveSection("suggestedUsers")}}>Utenti da seguire</button>
      </div>

      {/* Sezione Post */}
      {activeSection === "posts" && (
        <div className="feed-section mb-3">
          <h2 className="ms-3 ">Post</h2>
          <div className="feed-items">
            {feedItems.posts && feedItems.posts.length > 0 ? (
              feedItems.posts.map((post) => (
                <Posts
                  key={`post-${post.id}`}
                  post={post}
                  onDelete={(handleDeletePost)}
                  onEdit={() => console.log("Edit post")}
                />
              ))
            ) : (
              <p>Nessun post disponibile.</p>
            )}
          </div>
        </div>
      )}

      {/* Sezione Artwork */}
      {activeSection === "artworks" && (
        <div className="feed-section">
          <h2 className="ms-3">Artwork</h2>
          <div className="feed-items">
            {feedItems.artworks && feedItems.artworks.length > 0 ? (
              feedItems.artworks.map((artwork) => (
                <Artwork
                key={artwork.id}
                artwork={artwork}
                onDelete={handleDeleteArtwork}
                onUpdate={handleUpdateArtwork}/>
              ))
            ) : (
              <p>Nessun artwork disponibile.</p>
            )}
          </div>
        </div>
      )}

      {/* Sezione Utenti Suggeriti */}
      {activeSection === "suggestedUsers" && (
        <div className="feed-section">
          <h2  className="ms-3">Utenti da seguire</h2>
          <ul className="suggested-users">
            {suggestedUsers.length > 0 ? (
              suggestedUsers.map((user) => (
                <li key={user.id}>
                  <div className="user-card rounded-4">
                    <img
                      src={user.avatarUrl || "images/default-avatar.png"}
                      alt="Avatar"
                      className="rounded-circle me-2"
                      width={50}
                      height={50}
                    />
                    <div>
                      <h5 className="mb-0">{user.username}
                        
                      </h5>
                      <p className="text-muted mb-1">
                      {user.name} {user.surname}
                      </p>
                      <button className="suggested-btn" onClick={() => handleFollowUnfollow(user.id)}>
                        {followingStatus[user.id] ? "Non Seguire" : "Segui"}
                      </button>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <p>Nessun utente suggerito al momento.</p>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Feed;
