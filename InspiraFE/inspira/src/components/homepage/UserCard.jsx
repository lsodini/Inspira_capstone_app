import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import { IoClose } from "react-icons/io5";
import "../../css/UserCard.css";

const UserCard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [postCount, setPostCount] = useState(0);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [artworkCount, setArtworkCount] = useState(0);
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);
  const [isFollowingModalOpen, setIsFollowingModalOpen] = useState(false);

  const navigate = useNavigate();

  const handleUserClick = (username) => {
    navigate(`/user/${username}`); 
  };


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
            Authorization: `Bearer ${token}`,
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

  useEffect(() => {
    const fetchFollowCounts = async () => {
      try {
        if (user) {
          const token = localStorage.getItem("authToken");

          if (!token) {
            setError("Non autenticato. Effettua il login.");
            return;
          }

          const followerResponse = await fetch(
            `http://localhost:3001/api/follow/${user.id}/followers/count`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!followerResponse.ok) {
            throw new Error("Errore nel recupero dei follower.");
          }
          const followers = await followerResponse.json();
          setFollowerCount(followers);

          const followingResponse = await fetch(
            `http://localhost:3001/api/follow/${user.id}/following/count`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!followingResponse.ok) {
            throw new Error("Errore nel recupero degli utenti seguiti.");
          }
          const following = await followingResponse.json();
          setFollowingCount(following);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    if (user) {
      fetchFollowCounts();
    }
  }, [user]);

  const fetchFollowers = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `http://localhost:3001/api/follow/${user.id}/followers`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Errore nel recupero dei follower.");
      const followers = await response.json();
      setFollowersList(followers);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchFollowing = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `http://localhost:3001/api/follow/${user.id}/following`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Errore nel recupero degli utenti seguiti.");
      const following = await response.json();
      setFollowingList(following);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchFollowers();
      fetchFollowing();
    }
  }, [user]);

  const fetchAuthenticatedUserPostCount = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Non autenticato. Effettua il login.");
        return;
      }

      const response = await fetch(
        "http://localhost:3001/api/posts/authenticated-user/posts-count",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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

  const fetchArtworkCount = async () => {
    try {
      if (user) {
        const token = localStorage.getItem("authToken");

        if (!token) {
          setError("Non autenticato. Effettua il login.");
          return;
        }

        const artworkResponse = await fetch(
          `http://localhost:3001/api/artworks/user/${user.id}/count`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!artworkResponse.ok) {
          throw new Error("Errore nel recupero dei dati degli artworks.");
        }

        const artworkCount = await artworkResponse.json();
        setArtworkCount(artworkCount);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchArtworkCount();
  }, [user]);

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

      const profileResponse = await fetch(
        "http://localhost:3001/api/utenti/me",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: formData.name,
            surname: formData.surname,
            bio: formData.bio,
            username: formData.username,
          }),
        }
      );

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
              Authorization: `Bearer ${token}`,
            },
            body: avatarFormData,
          }
        );

        if (!avatarResponse.ok) {
          throw new Error(
            `Errore HTTP nell'aggiornamento avatar: ${avatarResponse.status}`
          );
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

  const getAvatarUrl = (user) => {
    return user && user.avatarUrl ? user.avatarUrl : "/images/default-avatar.png";
  };

  return (
    <>
      <div className="user-card">
        <div className="user-card-left">
          <img
            src={getAvatarUrl(user)}
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
            <span className="stats">{postCount || 0}</span>
            <span className="me-5">post</span>
            <span className="stats">{artworkCount || 0}</span>
            <span className="me-5">artworks</span>
            <span className="stats stat-button" onClick={() => setIsFollowersModalOpen(true)}>
              {followerCount || 0}
            </span>
            <span className="stat-button me-5" onClick={() => setIsFollowersModalOpen(true)}>follower</span>
            <span className="stats stat-button" onClick={() => setIsFollowingModalOpen(true)}>
              {followingCount || 0}
            </span>
            <span className="me-5 stat-button" onClick={() => setIsFollowingModalOpen(true)}>seguiti</span>
          </div>
          <div className="user-username">@{user ? user.username : "username"}</div>
          <div className="user-bio">
            {user ? user.bio || "Nessuna bio disponibile." : "Nessuna bio disponibile."}
          </div>
        </div>

        {/* Modale per Profilo */}
        {isModalOpen && (
          <div className="user-modal">
            <div className="user-modal-content">
             <button className="close-modal" type="button" onClick={() => setIsModalOpen(false)}><IoClose  /></button>
              <h3>Modifica Profilo</h3>
              <form>
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
                  Username:
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleFormChange}
                  />
                </label>
               
             
                <label>
                  Bio:
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleFormChange}
                  />
                </label>
               
                <label className="last-label">
                  Avatar:
                  <input type="file" onChange={handleFileChange} />
                </label>
                <button className="save-modal" type="button" onClick={handleSaveChanges}>Salva modifiche</button>
               
              </form>
            </div>
          </div>
        )}

        {/* Modale per Follower */}
        {isFollowersModalOpen && (
          <div className="stat-modal">
            <div className="stat-modal-content">
            <button className="close-modal" onClick={() => setIsFollowersModalOpen(false)}><IoClose  /></button>
              <h3>Follower</h3>
              <ul>
                {followersList.length > 0 ? (
                  followersList.map((follower) => (
                    <li key={follower.id}
                    onClick={() => handleUserClick(follower.username)} 
                      style={{ cursor: "pointer" }}>
                       <img className="rounded-circle me-2"src={follower.avatarUrl || "/images/default-avatar.png"} alt="avatar"
                      width={30} height={30}></img>
                      {follower.username}</li>
                  ))
                ) : (
                  <li>Nessun follower trovato.</li>
                )}
              </ul>
              
            </div>
          </div>
        )}

        {/* Modale per Following */}
        {isFollowingModalOpen && (
          <div className="stat-modal">
            <div className="stat-modal-content">
            <button className="close-modal" onClick={() => setIsFollowingModalOpen(false)}><IoClose  /></button>
              <h3>Seguiti</h3>
              <ul>
                {followingList.length > 0 ? (
                  followingList.map((followed) => (
                    <li key={followed.id}
                    onClick={() => handleUserClick(followed.username)}
                      style={{ cursor: "pointer" }}>
                     
                      <img className="rounded-circle me-2"src={followed.avatarUrl || "/images/default-avatar.png"} alt="avatar"
                      width={30} height={30}></img>
                      {followed.username}</li>
                      
                      
                  ))
                ) : (
                  <li>Nessun utente seguito.</li>
                  
                )}
                
              </ul>
              
            </div>
          </div>
        )}
      </div>
      <hr className="linea" />
    </>
  );
};

export default UserCard;
