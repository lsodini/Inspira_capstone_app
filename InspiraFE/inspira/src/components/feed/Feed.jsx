import React, { useState, useEffect } from "react";
import Artwork from "../../components/otherUserPage/Artwork";
import Posts from "../../components/otherUserPage/Post";
import "../../css/feed.css";

const Feed = () => {
  const [feedItems, setFeedItems] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("Non autenticato. Effettua il login.");
          setLoading(false);
          return;
        }

        const response = await fetch("http://localhost:3001/api/feed", {
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
        setFeedItems(data);
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
      } catch (err) {
        console.error("Errore nel recupero degli utenti suggeriti:", err);
      }
    };

    fetchFeed();
    fetchSuggestedUsers();
  }, []);

  if (loading) return <div>Caricamento in corso...</div>;
  if (error) return <div>Errore: {error}</div>;

  return (
    <div className="feed-list vh-100">
      <div className="feed-items">
        {feedItems.map((item) =>
          item.type === "artwork" ? (
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
                  <img src={user.avatarUrl || "/default-avatar.png"} alt="Avatar" />
                  <div>
                    <p>{user.name} {user.surname}</p>
                    <button
                      onClick={() => console.log(`Segui utente ${user.id}`)}
                    >
                      Segui
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
