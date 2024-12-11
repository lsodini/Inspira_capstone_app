import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";  
import UserCard from "./UserCard";
import PostList from "./PostList";
import ArtworkList from "./ArtworkList";


const OtherUserPage = () => {
  const { username } = useParams();  
  const [userData, setUserData] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPosts, setShowPosts] = useState(true);  
  const [isAuthenticated, setIsAuthenticated] = useState(false); 

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (token) {
          setIsAuthenticated(true); 
        }

        const response = await fetch(`http://localhost:3001/api/utenti/${username}`, { 
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `Bearer ${token}` : "",
          },
        });

        if (!response.ok) {
          throw new Error(`Errore HTTP: ${response.status}`);
        }

        const data = await response.json();
        setUserData(data);  
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username]);

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
      {userData && <UserCard user={userData} />}  
      
      <div className="toggle-buttons">
        <button onClick={handleShowPosts} className={showPosts ? "active" : ""}>Posts</button>
        <button onClick={handleShowArtwork} className={!showPosts ? "active" : ""}>Artworks</button>
      </div>

      {userData && showPosts && <PostList userId={userData.id} isAuthenticated={isAuthenticated} />}
      {userData && !showPosts && <ArtworkList userId={userData.id} isAuthenticated={isAuthenticated} />}
    </div>
  );
};

export default OtherUserPage;
