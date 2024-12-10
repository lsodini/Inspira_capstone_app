import React, { useState, useEffect } from "react";
import "../../css/UserCard.css"; 

const UserCard = () => {
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [formData, setFormData] = useState({});
  const [postCount, setPostCount] = useState(0); 
  useEffect(() => {
    const fetchUserData = async () => {
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
        setUser(data);
        setFormData({
          name: data.name || "",
          surname: data.surname || "",
          bio: data.bio || "",
          username: data.username || "",
          avatarUrl: data.avatarUrl || "",
        }); 
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); 
      }
    };

    fetchUserData();
  }, []);

  const fetchAuthenticatedUserPostCount = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Non autenticato. Effettua il login.");
        return;
      }

      const response = await fetch("http://localhost:3001/api/posts/authenticated-user/posts-count", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Errore nel recupero dei dati.");
      }

      const postCount = await response.json();
      setPostCount(postCount); 
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchAuthenticatedUserPostCount(); 
  }, []); 

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      avatarUrl: e.target.files[0],
    }));
  };

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem("authToken");
  
      const profileResponse = await fetch("http://localhost:3001/api/utenti/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          surname: formData.surname,
          bio: formData.bio,
          username: formData.username,
        }),
      });
  
      if (!profileResponse.ok) {
        throw new Error(`Errore HTTP: ${profileResponse.status}`);
      }
  
      if (formData.avatarUrl && formData.avatarUrl instanceof File) {
        const avatarFormData = new FormData();
        avatarFormData.append("avatar", formData.avatarUrl);
  
        const avatarResponse = await fetch(
          "http://localhost:3001/api/utenti/me/avatar",
          {
            method: "PATCH",
            headers: {
              "Authorization": `Bearer ${token}`,
            },
            body: avatarFormData,
          }
        );
  
        if (!avatarResponse.ok) {
          throw new Error(`Errore HTTP nell'aggiornamento avatar: ${avatarResponse.status}`);
        }
  
        const avatarUrl = await avatarResponse.text();
        setUser((prevUser) => ({ ...prevUser, avatarUrl })); 
      }
  
      const updatedUser = await profileResponse.json();
      setUser(updatedUser); 
      setIsModalOpen(false); 
  
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="user-card">
      <div className="user-card-left">
        <img
          src={user ? user.avatarUrl : "https://via.placeholder.com/80"}
          alt={`${user ? user.name : "Utente"} profile`}
          className="profile-image"
        />
      </div>
      <div className="user-card-right">
        <div className="user-header">
          <h2>{`${user ? user.name : "Nome"} ${user ? user.surname : "Cognome"}`}</h2>
          <button className="edit-button" onClick={() => setIsModalOpen(true)}>
            Modifica Profilo
          </button>
        </div>
        <div className="user-stats">
          <span>Post: {postCount || 0}</span> {/* Use postCount */}
          <span>Artwork: {user ? user.artworksCount || 0 : 0}</span>
          <span>Follower: {user ? user.followersCount || 0 : 0}</span>
          <span>Followed: {user ? user.followingCount || 0 : 0}</span>
        </div>
        <div className="user-username">@{user ? user.username : "username"}</div>
        <div className="user-bio">{user ? user.bio || "Nessuna bio disponibile." : "Nessuna bio disponibile."}</div>
      </div>
  
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Modifica Profilo</h3>
            <label>
              Nome:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
              />
            </label>
            <label>
              Cognome:
              <input
                type="text"
                name="surname"
                value={formData.surname}
                onChange={handleFormChange}
              />
            </label>
            <label>
              Bio:
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleFormChange}
              ></textarea>
            </label>
            <label>
              Username:
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleFormChange}
              />
            </label>
            <label>
              Immagine del profilo:
              <input type="file" onChange={handleFileChange} />
            </label>
            <button onClick={handleSaveChanges}>Salva</button>
            <button onClick={() => setIsModalOpen(false)}>Annulla</button>
          </div>
        </div>
      )}
  
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default UserCard;
