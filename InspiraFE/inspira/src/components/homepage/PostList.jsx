
import React, { useState, useEffect } from "react";
import Post from "./Post";
import "../../css/UserPage.css";

const PostList = ({ userId }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newPost, setNewPost] = useState("");

  useEffect(() => {
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
            "Authorization": `Bearer ${token}`,
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
          "Authorization": `Bearer ${token}`,
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

  if (loading) return <div>Caricamento in corso...</div>;
  if (error) return <div>Errore: {error}</div>;

  return (
    <div className="post-list">
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
          <Post key={post.id} post={post} />  
        ))}
      </div>
    </div>
  );
};

export default PostList;
