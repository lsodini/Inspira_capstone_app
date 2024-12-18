import React, { useState } from "react";
import "../../css/UCard.css";
import { FaEllipsisH } from "react-icons/fa";

const Artwork = ({ artwork, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedArtwork, setUpdatedArtwork] = useState({
    title: artwork.title,
    description: artwork.description,
    price: artwork.price,
    mediaFile: null,
  });

  const [menuOpen, setMenuOpen] = useState(false);

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

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleDeleteArtwork = () => {
    onDelete(artwork.id);
  };

  return (
    <div className="uCard-card-artwork ">
      <div className="uCard-top">
        <div className="uCard-user_details">
          <div className="uCard-profile_img">
            <img src={artwork.user.avatarUrl || "/images/default-avatar.png"} alt="artist" className="uCard-cover" />
          </div>
          <h3>
            {artwork.user.username}
            <br />
            <span className="uCard-hour">
              {new Intl.DateTimeFormat("it-IT", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              }).format(new Date(artwork.createdAt))}
            </span>
          </h3>
        </div>

        {/* Pallini per il menu */}
        {artwork.user.username === localStorage.getItem("username") && (
          <div className="uCard-dot" onClick={toggleMenu}>
            <FaEllipsisH className="uCard-dot-icon" />
          </div>
        )}

        {/* Menu del dropdown */}
        {menuOpen && (
          <div className="uCard-dropdown-artwork">
            <button onClick={() => setIsEditing(true)}>Edit Artwork</button>
            <button onClick={handleDeleteArtwork}>Delete Artwork</button>
          </div>
        )}
      </div>

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
              <input className="file-artwork" type="file" accept="image/*,video/*" onChange={handleMediaChange} />
            </label>
            {artwork.mediaUrls && (
              <div className="current-media">
                {artwork.mediaUrls.map((url, index) => (
                  <img key={index} src={url} alt={`artwork-${index}`} width="100" height="100" />
                ))}
              </div>
            )}
          </div>
          <button className="edit-btn" onClick={handleUpdateArtwork}>Salva</button>
          <button className="edit-btn mt-5" onClick={() => setIsEditing(false)}>Annulla</button>
        </div>
      ) : (
        <>
          <h4 className="uCard-message-artwork">{artwork.title}</h4>
          <p className="uCard-description">{artwork.description}</p>

          {artwork.mediaUrls && artwork.mediaUrls.length > 0 && (
            <div className="uCard-imgBg">
              {artwork.mediaUrls.map((url, index) => (
                <img key={index} src={url} alt={`artwork-${index}`} className="uCard-coverFull" />
              ))}
            </div>
          )}
          <h5 className="uCard-price">
            Prezzo: ${artwork.price} {artwork.sold && "(venduto)"}
          </h5>
        </>
      )}
    </div>
  );
};

export default Artwork;
