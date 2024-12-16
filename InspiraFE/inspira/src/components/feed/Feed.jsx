import React, { useState, useEffect } from "react";
import Artwork from "../../components/otherUserPage/Artwork";
import Posts from "../../components/otherUserPage/Post";
import "../../css/feed.css";

const Feed = () => {
  const [feedItems, setFeedItems] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [followingStatus, setFollowingStatus] = useState({}); // Track follow status for each user

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("Non autenticato. Effettua il login.");
          setLoading(false);
          return;
        }

        const postsResponse = await fetch("http://localhost:3001/api/posts/feed", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!postsResponse.ok) {
          throw new Error(`Errore HTTP: ${postsResponse.status}`);
        }
        const postsData = await postsResponse.json();

        const artworksResponse = await fetch("http://localhost:3001/api/artworks/feed", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!artworksResponse.ok) {
          throw new Error(`Errore HTTP: ${artworksResponse.status}`);
        }
        const artworksData = await artworksResponse.json();

        const combinedFeed = [...postsData, ...artworksData];

        setFeedItems(combinedFeed);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchSuggestedUsers = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("Non autenticato. Effettua il login.");
          return;
        }

        const userId = localStorage.getItem("userId");
        const response = await fetch(`http://localhost:3001/api/follow/${userId}/suggestions`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Errore HTTP: ${response.status}`);
        }

        const suggestedUsersData = await response.json();
        setSuggestedUsers(suggestedUsersData);

        // Initialize the following status for each suggested user
        const initialStatus = {};
        suggestedUsersData.forEach(user => {
          initialStatus[user.id] = user.isFollowing; // Assuming `isFollowing` field is available
        });
        setFollowingStatus(initialStatus);
      } catch (err) {
        console.error("Errore nel recupero degli utenti suggeriti:", err);
      }
    };

    fetchFeed();
    fetchSuggestedUsers();
  }, []);

  const handleFollowUnfollow = async (userId) => {
    const token = localStorage.getItem("authToken");
    const currentUserId = localStorage.getItem("userId");
    if (!token || !currentUserId) {
      setError("Non autenticato. Effettua il login.");
      return;
    }

    try {
      const action = followingStatus[userId] ? "unfollow" : "follow";
      const url = `http://localhost:3001/api/follow/${currentUserId}/${action}/${userId}`;

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

      setFollowingStatus((prevStatus) => ({
        ...prevStatus,
        [userId]: !prevStatus[userId], // Toggle the following status
      }));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Caricamento in corso...</div>;
  if (error) return <div>Errore: {error}</div>;

  return (
    <div className="feed-list">
      <div className="feed-items">
        {feedItems.map((item) =>
          item.title ? (
            <Artwork
              key={`artwork-${item.id}`}
              artwork={item}
              onMarkAsSold={(id) => console.log(`Marking artwork ${id} as sold`)}
            />
          ) : (
            <Posts
              key={`post-${item.id}`}
              post={item}
              onDelete={() => console.log("Delete post")}
              onEdit={() => console.log("Edit post")}
            />
          )
        )}
      </div>

      {/* Sezione per suggerimenti */}
      {suggestedUsers.length > 0 && (
        <div className="suggested-users">
          <h2>Utenti da seguire</h2>
          <ul>
            {suggestedUsers.map((user) => (
              <li key={user.id}>
                <div className="user-card">
                  <img
                    src={user.avatarUrl || "images/default-avatar.png"}
                    alt="Avatar"
                    className="rounded-5"
                    width={40}
                    height={40}
                  />
                  <div>
                    <p>{user.name} {user.surname}</p>
                    <button
                      onClick={() => handleFollowUnfollow(user.id)}
                    >
                      {followingStatus[user.id] ? "Non Seguire" : "Segui"}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Feed;
