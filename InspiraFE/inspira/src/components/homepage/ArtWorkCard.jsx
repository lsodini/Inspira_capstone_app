import React, { useState, useEffect } from "react";
import "../../css/UCard.css";

const Artwork = ({ artwork }) => {
  const [isSold, setIsSold] = useState(artwork.sold); 
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (userId && token) {
      
    } else {
      console.log("Utente non autenticato.");
    }
  }, [artwork.id, userId, token]);

  const handleBuyArtwork = async () => {
    try {
      await fetch(`http://localhost:3001/api/artworks/${artwork.id}/mark-sold`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIsSold(true); 
    } catch (err) {
      console.error("Errore nell'acquisto dell'opera:", err.message);
    }
  };

  return (
    <div className="uCard-card">
      <div className="uCard-top">
        <div className="uCard-user_details">
          <div className="uCard-profile_img">
            <img src={artwork.user.image} alt="artist" className="uCard-cover" />
          </div>
          <h3>
            {artwork.user.username}
            <br />
            <span className="uCard-hour">{new Date(artwork.createdAt).toLocaleString()}</span>
            <span className="uCard-globDot">.</span>
          </h3>
        </div>
      </div>
  
      <h4 className="uCard-message">{artwork.title}</h4>
      <p className="uCard-description">{artwork.description}</p>
      <h5 className="uCard-price">Price: ${artwork.price}</h5>
  
      {/* Verifica che l'array mediaUrls esista e abbia contenuti */}
      {artwork.mediaUrls && artwork.mediaUrls.length > 0 && (
        <div className="uCard-imgBg">
          {artwork.mediaUrls.map((url, index) => (
            <img key={index} src={url} alt={`artwork-${index}`} className="uCard-coverFull" />
          ))}
        </div>
      )}
  
      <div className="uCard-btns">
        {!isSold && (
          <button className="uCard-buy" onClick={handleBuyArtwork}>Buy</button>
        )}
      </div>
  
      <div className="uCard-border"></div>
    </div>
  );
};

export default Artwork;
