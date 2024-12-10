
import React, { useState, useEffect } from "react";
import UserCard from "./UserCard";  
import PostList from "./PostList";

const UserPage = () => {
  const [userId, setUserId] = useState(null);  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 
  useEffect(() => {
    const fetchUser = async () => {
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
        setUserId(data.id); 
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <div>Caricamento in corso...</div>;
  if (error) return <div>Errore: {error}</div>;

  return (
    <div className="user-page">
      <UserCard /> 
      {userId && <PostList userId={userId} />}  
    </div>
  );
};

export default UserPage;
