import React, { useState, useEffect } from "react";
import UserCard from "./UserCard";  
import PostList from "./PostList";
import ArtworkList from "./ArtworkList";

const UserPage = () => {
  const [userId, setUserId] = useState(null);  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPosts, setShowPosts] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("Non autenticato. Effettua il login.");
          setLoading(false);
          return;
        }

        const response = await fetch("http://localhost:3001/api/utenti/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Errore HTTP: ${response.status}`);
        }

        const data = await response.json();
        setUserId(data.id);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <div>Caricamento in corso...</div>;
  if (error) return <div>Errore: {error}</div>;

  
  const handleShowPosts = () => {
    setShowPosts(true);
  };

 
  const handleShowArtwork = () => {
    setShowPosts(false);
  };

  return (
    <div className="user-page">
      <UserCard />
      
      <div className="toggle-buttons">
        
        <button onClick={handleShowPosts} className={showPosts ? "active" : ""}><img src="/images/post-icon.png" alt="post" style={{
      cursor: "pointer",
      width: "32px",
      height: "32px",
    }}></img></button>
        <button onClick={handleShowArtwork} className={!showPosts ? "active" : ""}><img src="/images/artwork-icon.png" alt="artwork" style={{
      cursor: "pointer",
      width: "32px",
      height: "32px",
    }}></img></button>
      </div>

      
      {userId && showPosts && <PostList userId={userId} />}
      {userId && !showPosts && <ArtworkList userId={userId} />}
    </div>
  );
};

export default UserPage;
