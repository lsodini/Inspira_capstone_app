import React, { useState, useEffect } from "react";
import Posts from "./Post";
import "../../css/UserPage.css";

const PostList = ({ userId }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newPost, setNewPost] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
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
        setUser(userData);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("Non autenticato. Effettua il login.");
          setLoading(false);
          return;
        }

        const response = await fetch(`http://localhost:3001/api/posts/user/${userId}`, {
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
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    fetchPosts();
  }, [userId]);

  const handleCreatePost = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Non autenticato. Effettua il login.");
      return;
    }

    const postDTO = {
      content: newPost,
      mediaUrl: "",
    };

    try {
      const response = await fetch("http://localhost:3001/api/posts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postDTO),
      });

      if (!response.ok) {
        throw new Error(`Errore HTTP: ${response.status}`);
      }

      const data = await response.json();
      setPosts([data, ...posts]);
      setNewPost("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeletePost = async (postId) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Non autenticato. Effettua il login.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/posts/delete/${postId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Errore nell'eliminazione del post: ${response.status}`);
      }

      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditPost = async (postId, newContent) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Non autenticato. Effettua il login.");
      return;
    }

    const updatedPostDTO = {
      content: newContent,
    };

    try {
      const response = await fetch(`http://localhost:3001/api/posts/edit/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedPostDTO),
      });

      if (!response.ok) {
        throw new Error(`Errore HTTP: ${response.status}`);
      }

      const updatedPost = await response.json();
      setPosts((prevPosts) => prevPosts.map((post) => (post.id === postId ? updatedPost : post)));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Caricamento in corso...</div>;
  if (error) return <div>Errore: {error}</div>;

  return (
    <div className="post-list d-flex ">
      {user && (
        <div className="user-info text-center">
          <h2>Benvenuto, {user.name}</h2>
          
        </div>
      )}

      <div className="create-post">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Scrivi un nuovo post..."
        />
        <button onClick={handleCreatePost}>Crea Post</button>
      </div>

      <div className="posts">
        {posts.map((post) => (
          <Posts
            key={post.id}
            post={post}
            onDelete={handleDeletePost}
            onEdit={handleEditPost}
          />
        ))}
      </div>
    </div>
  );
};

export default PostList;
