import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../../css/UserCard.css";


const UserCard = () => {
  const { username } = useParams(); 
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false); 
  const [currentUser, setCurrentUser] = useState(null);

  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("Non autenticato. Effettua il login.");
          setLoading(false);
          return;
        }

        const response = await fetch(`http://localhost:3001/api/utenti/${username}`, {
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

        
        const followerCountResponse = await fetch(
          `http://localhost:3001/api/follow/${data.id}/followers/count`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const postCountResponse = await fetch(
          `http://localhost:3001/api/posts/user/${data.id}/posts-count`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const artworkCountResponse = await fetch(
          `http://localhost:3001/api/artworks/user/${data.id}/count`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const followingCountResponse = await fetch(
          `http://localhost:3001/api/follow/${data.id}/following/count`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const [followerCount, postCount, artworkCount, followingCount] = await Promise.all([
          followerCountResponse.json(),
          postCountResponse.json(),
          artworkCountResponse.json(),
          followingCountResponse.json(),
        ]);

        setUser((prevUser) => ({
          ...prevUser,
          followersCount: followerCount,
          postCount: postCount,
          artworksCount: artworkCount,
          followingCount: followingCount,
        }));

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchAuthenticatedUserData = async () => {
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

        const data = await response.json();
        setCurrentUser(data);

       
        checkIfFollowing(data.id, user?.id);
      } catch (err) {
        setError(err.message);
      }
    };

    const checkIfFollowing = async (currentUserId, profileUserId) => {
      if (!profileUserId) return;

      try {
        const response = await fetch(`http://localhost:3001/api/follow/${currentUserId}/is-following/${profileUserId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setIsFollowing(data); 
        }
      } catch (err) {
        console.error("Error checking follow status:", err);
      }
    };

    fetchUserData();
    fetchAuthenticatedUserData();
  }, [username, user?.id]); 

  const handleFollowUnfollow = async () => {
    if (!currentUser) {
      setError("Utente non trovato. Assicurati di essere autenticato.");
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Non autenticato. Effettua il login.");
      return;
    }

    try {
      const url = isFollowing
        ? `http://localhost:3001/api/follow/${currentUser.id}/unfollow/${user.id}`
        : `http://localhost:3001/api/follow/${currentUser.id}/follow/${user.id}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Errore HTTP: ${response.status}`);
      }

      const data = await response.json();

     
      setUser((prevUser) => ({
        ...prevUser,
        followersCount: data.followersCount, 
      }));

      
      setIsFollowing(!isFollowing);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Caricamento...</div>;
  if (error) return <div>Errore: {error}</div>;

  return (
    <div className="user-card">
      <div className="user-card-left">
        <img
          src={user ? user.avatarUrl : "/images/default-avatar.png"}
          alt={`${user ? user.name : "Utente"} profile`}
          className="profile-image"
        />
      </div>
      <div className="user-card-right">
        <div className="user-header">
          <h2>{`${user ? user.name : "Nome"} ${user ? user.surname : "Cognome"}`}</h2>
          {currentUser && currentUser.username !== user.username && (
            <button className="follow-button" onClick={handleFollowUnfollow}>
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          )}
        </div>
        <div className="user-stats">
          <span>Post: {user ? user.postCount || 0 : 0}</span>
          <span>Artwork: {user ? user.artworksCount || 0 : 0}</span>
          <span>Follower: {user ? user.followersCount || 0 : 0}</span>
          <span>Followed: {user ? user.followingCount || 0 : 0}</span>
        </div>
        <div className="user-username">@{user ? user.username : "username"}</div>
        <div className="user-bio">{user ? user.bio || "Nessuna bio disponibile." : "Nessuna bio disponibile."}</div>
      </div>
    </div>
  );
};

export default UserCard;
