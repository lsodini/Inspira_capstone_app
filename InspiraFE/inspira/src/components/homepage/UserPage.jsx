import React, { useState, useEffect } from "react";
import UserCard from "./UserCard";  
import PostList from "./PostList";
import ArtworkList from "./ArtworkList";

const UserPage = () => {
  const [userId, setUserId] = useState(null);  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPosts, setShowPosts] = useState(true); // Stato per gestire quale lista mostrare

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
        setUserId(data.id); // Imposta l'ID dell'utente
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

  // Funzione per mostrare i post
  const handleShowPosts = () => {
    setShowPosts(true);
  };

  // Funzione per mostrare gli artwork
  const handleShowArtwork = () => {
    setShowPosts(false);
  };

  return (
    <div className="user-page">
      <UserCard />
      
      <div className="toggle-buttons">
        {/* Bottoni per cambiare visualizzazione */}
        <button onClick={handleShowPosts} className={showPosts ? "active" : ""}>Posts</button>
        <button onClick={handleShowArtwork} className={!showPosts ? "active" : ""}>Artworks</button>
      </div>

      {/* Mostra solo uno dei due componenti in base allo stato */}
      {userId && showPosts && <PostList userId={userId} />}
      {userId && !showPosts && <ArtworkList userId={userId} />}
    </div>
  );
};

export default UserPage;
