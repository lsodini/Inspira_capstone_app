import React, { useState } from "react";
import "../../css/UCard.css";

const Artwork = ({ artwork, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedArtwork, setUpdatedArtwork] = useState({
    title: artwork.title,
    description: artwork.description,
    price: artwork.price,
    mediaFile: null,
  });

  const token = localStorage.getItem("authToken");

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    setUpdatedArtwork({ ...updatedArtwork, mediaFile: file });
  };

  const handleUpdateArtwork = async () => {
    try {
      const formData = new FormData();
      formData.append("title", updatedArtwork.title);
      formData.append("description", updatedArtwork.description);
      formData.append("price", updatedArtwork.price);
      if (updatedArtwork.mediaFile) {
        formData.append("file", updatedArtwork.mediaFile);
      }

      const response = await fetch(`http://localhost:3001/api/artworks/${artwork.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Errore HTTP: ${response.status}`);
      }

      const data = await response.json();
      setIsEditing(false); 
      onUpdate(data);
    } catch (err) {
      console.error("Errore nell'aggiornamento dell'opera:", err.message);
    }
  };

  return (
    <div className="uCard-card">
      {isEditing ? (
        <div className="uCard-edit">
          <input
            type="text"
            value={updatedArtwork.title}
            onChange={(e) => setUpdatedArtwork({ ...updatedArtwork, title: e.target.value })}
          />
          <textarea
            value={updatedArtwork.description}
            onChange={(e) => setUpdatedArtwork({ ...updatedArtwork, description: e.target.value })}
          />
          <input
            type="number"
            value={updatedArtwork.price}
            onChange={(e) => setUpdatedArtwork({ ...updatedArtwork, price: e.target.value })}
          />
          <div className="media-upload">
            <label>
              Cambia immagine (opzionale):
              <input type="file" accept="image/*,video/*" onChange={handleMediaChange} />
            </label>
            {artwork.mediaUrls && (
              <div className="current-media">
                {artwork.mediaUrls.map((url, index) => (
                  <img key={index} src={url} alt={`artwork-${index}`} width="100" height="100" />
                ))}
              </div>
            )}
          </div>
          <button onClick={handleUpdateArtwork}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <>
          <div className="uCard-top">
            <div className="uCard-user_details">
              <div className="uCard-profile_img">
                <img src={artwork.user.avatarUrl} alt="artist" className="uCard-cover" />
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

          {artwork.mediaUrls && artwork.mediaUrls.length > 0 && (
            <div className="uCard-imgBg">
              {artwork.mediaUrls.map((url, index) => (
                <img key={index} src={url} alt={`artwork-${index}`} className="uCard-coverFull" />
              ))}
            </div>
          )}

          <div className="uCard-btns">
            <button className="uCard-edit" onClick={() => setIsEditing(true)}>
              Edit
            </button>
            <button className="uCard-delete" onClick={() => onDelete(artwork.id)}>
  Delete
</button>

          </div>
        </>
      )}
      <div className="uCard-border"></div>
    </div>
  );
};

export default Artwork;
