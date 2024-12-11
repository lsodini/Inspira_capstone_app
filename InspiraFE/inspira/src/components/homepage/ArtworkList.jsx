import React, { useState, useEffect } from "react";
import Artwork from "./Artwork";
import "../../css/UserPage.css";

const ArtworkList = ({ userId }) => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [role, setRole] = useState(null);
  const [newArtwork, setNewArtwork] = useState({
    title: "",
    description: "",
    mediaFiles: [],
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

    newArtwork.mediaFiles.forEach((file) => {
      formData.append("file", file);
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

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    setNewArtwork({
      ...newArtwork,
      mediaFiles: [...newArtwork.mediaFiles, ...files],
    });
  };

  const handleRemoveMedia = (index) => {
    const updatedMediaFiles = newArtwork.mediaFiles.filter((_, i) => i !== index);
    setNewArtwork({ ...newArtwork, mediaFiles: updatedMediaFiles });
  };

  const handleBecomeArtist = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Non autenticato. Effettua il login.");
        return;
      }

      const response = await fetch(
        "http://localhost:3001/api/utenti/me/become-artist",
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

      const userData = await response.json();
      setRole(userData.role); // Aggiorna il ruolo a ARTIST
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Non autenticato. Effettua il login.");
        return;
      }
  
      const response = await fetch(`http://localhost:3001/api/artworks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Errore HTTP: ${response.status}`);
      }
  
     
      setArtworks(artworks.filter((artwork) => artwork.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };
  

  const handleUpdate = (updatedArtwork) => {
    setArtworks(
      artworks.map((artwork) => (artwork.id === updatedArtwork.id ? updatedArtwork : artwork))
    );
  };

  if (loading) return <div>Caricamento in corso...</div>;
  if (error) return <div>Errore: {error}</div>;

  return (
    <div className="artwork-list">
      {role === "ARTIST" ? (
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
      ) : (
        <div className="not-artist">
          <p>Non sei ancora un artista. Diventa un artista per creare artwork!</p>
          <button onClick={handleBecomeArtist}>Diventa Artista</button>
        </div>
      )}

      <div className="artworks">
        {artworks.map((artwork) => (
          <Artwork
            key={artwork.id}
            artwork={artwork}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        ))}
      </div>
    </div>
  );
};

export default ArtworkList;
