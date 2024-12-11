import React, { useState, useEffect } from "react";
import Artwork from "./Artwork";
import "../../css/UCard.css";

const ArtworkList = ({ userId }) => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("Non autenticato. Effettua il login.");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `http://localhost:3001/api/artworks/user/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Errore HTTP: ${response.status}`);
        }

        const data = await response.json();
        setArtworks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserRole = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("Non autenticato. Effettua il login.");
          return;
        }

        const response = await fetch("http://localhost:3001/api/utenti/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Errore HTTP: ${response.status}`);
        }

        const userData = await response.json();
        setRole(userData.role);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchArtworks();
    fetchUserRole();
  }, [userId]);

  const handleMarkAsSold = async (artworkId) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Non autenticato. Effettua il login.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3001/api/artworks/${artworkId}/mark-sold`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Errore HTTP: ${response.status}`);
      }

      const updatedArtwork = await response.json();
      setArtworks((prevArtworks) =>
        prevArtworks.map((artwork) =>
          artwork.id === updatedArtwork.id ? updatedArtwork : artwork
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Caricamento in corso...</div>;
  if (error) return <div>Errore: {error}</div>;

  return (
    <div className="artwork-list">
      <div className="artworks">
        {artworks.map((artwork) => (
          <Artwork
            key={artwork.id}
            artwork={artwork}
            onMarkAsSold={handleMarkAsSold}
            role={role} 
          />
        ))}
      </div>
    </div>
  );
};

export default ArtworkList;
