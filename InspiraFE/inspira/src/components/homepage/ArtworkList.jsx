import React, { useEffect, useState } from "react";
import ArtworkModal from "./ArtWorkCard"; 

const ArtworkList = ({ userId, authToken }) => {
  const [artworks, setArtworks] = useState([]);
  const [selectedArtwork, setSelectedArtwork] = useState(null);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/artworks/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`, 
          },
        });
        const data = await response.json();
        setArtworks(data);
      } catch (error) {
        console.error("Error fetching artworks:", error);
      }
    };

    fetchArtworks();
  }, [userId, authToken]);

  const openArtworkModal = (artwork) => {
    setSelectedArtwork(artwork);
  };

  return (
    <div className="artwork-list">
      {artworks.map((artwork) => (
        <div key={artwork.id} className="artwork-item" onClick={() => openArtworkModal(artwork)}>
          <img src={artwork.mediaUrl || "https://via.placeholder.com/100"} alt="Artwork" />
          <p>{artwork.title}</p>
        </div>
      ))}

      {selectedArtwork && <ArtworkModal artwork={selectedArtwork} closeModal={() => setSelectedArtwork(null)} />}
    </div>
  );
};

export default ArtworkList;
