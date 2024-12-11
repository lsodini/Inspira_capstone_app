import React, { useState, useEffect } from "react";
import Artwork from "./ArtWorkCard";
import "../../css/UserPage.css";

const ArtworkList = ({ userId }) => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newArtwork, setNewArtwork] = useState({
    title: "",
    description: "",
    mediaFiles: [], // Usa mediaFiles invece di mediaUrls
    price: "",
  });

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

    fetchArtworks();
  }, [userId]);

  const handleCreateArtwork = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Non autenticato. Effettua il login.");
      return;
    }

    const formData = new FormData();
    formData.append("title", newArtwork.title);
    formData.append("description", newArtwork.description);
    formData.append("price", newArtwork.price);

    // Usa mediaFiles invece di mediaUrls
    newArtwork.mediaFiles.forEach((file) => {
      formData.append("file", file); // Aggiungi il file come FormData
    });

    try {
      const response = await fetch("http://localhost:3001/api/artworks/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Errore HTTP: ${response.status}`);
      }

      const data = await response.json();
      setArtworks([data, ...artworks]);
      setNewArtwork({ title: "", description: "", mediaFiles: [], price: "" });
    } catch (err) {
      setError(err.message);
    }
  };

  // Modifica `handleMediaChange` per usare mediaFiles
  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    setNewArtwork({
      ...newArtwork,
      mediaFiles: [...newArtwork.mediaFiles, ...files], // Usa mediaFiles per aggiungere i file
    });
  };

  const handleRemoveMedia = (index) => {
    const updatedMediaFiles = newArtwork.mediaFiles.filter((_, i) => i !== index);
    setNewArtwork({ ...newArtwork, mediaFiles: updatedMediaFiles });
  };

  if (loading) return <div>Caricamento in corso...</div>;
  if (error) return <div>Errore: {error}</div>;

  return (
    <div className="artwork-list">
      <div className="create-artwork">
        <input
          type="text"
          value={newArtwork.title}
          onChange={(e) => setNewArtwork({ ...newArtwork, title: e.target.value })}
          placeholder="Title"
        />
        <textarea
          value={newArtwork.description}
          onChange={(e) => setNewArtwork({ ...newArtwork, description: e.target.value })}
          placeholder="Description"
        />
        <div className="media-upload">
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleMediaChange}
          />
          <div className="media-preview">
            {newArtwork.mediaFiles.map((file, index) => (
              <div key={index} className="media-item">
                <button onClick={() => handleRemoveMedia(index)}>Remove</button>
                {file.type.startsWith("video/") ? (
                  <video
                    src={URL.createObjectURL(file)}
                    controls
                    width="100"
                    height="100"
                  />
                ) : (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`media-preview-${index}`}
                    width="100"
                    height="100"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        <input
          type="number"
          value={newArtwork.price}
          onChange={(e) => setNewArtwork({ ...newArtwork, price: e.target.value })}
          placeholder="Price"
        />
        <button onClick={handleCreateArtwork}>Create Artwork</button>
      </div>

      <div className="artworks">
        {artworks.map((artwork) => (
          <Artwork key={artwork.id} artwork={artwork} />
        ))}
      </div>
    </div>
  );
};

export default ArtworkList;