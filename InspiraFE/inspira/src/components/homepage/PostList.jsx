import React, { useState, useEffect } from "react";
import Posts from "./Post";
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

  const handleDeletePost = async (postId) => {
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");  

    if (!token || !userId) {
      setError("Non autenticato. Effettua il login.");
      return;
    }
  
    try {
      // 1. Recupera i commenti associati al post
      const commentsResponse = await fetch(`http://localhost:3001/api/comments/post/${postId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
  
      if (!commentsResponse.ok) {
        throw new Error(`Errore nel recupero dei commenti: ${commentsResponse.status}`);
      }
  
      const comments = await commentsResponse.json();
  
      // 2. Elimina i like associati ai commenti
      for (const comment of comments) {
        const likesResponse = await fetch(`http://localhost:3001/api/likes/comment/${comment.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
  
        if (!likesResponse.ok) {
          throw new Error(`Errore nel recupero dei like del commento: ${likesResponse.status}`);
        }
  
        const likes = await likesResponse.json();
  
        // Elimina ogni like associato al commento
        for (const like of likes) {
          const deleteLikeResponse = await fetch(`http://localhost:3001/api/likes/comment/${comment.id}/user/${like.userId}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          });
  
          if (!deleteLikeResponse.ok) {
            throw new Error(`Errore nell'eliminazione dei like del commento: ${deleteLikeResponse.status}`);
          }
        }
  
        // 3. Elimina il commento
        const deleteCommentResponse = await fetch(`http://localhost:3001/api/comments/${comment.id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
  
        if (!deleteCommentResponse.ok) {
          throw new Error(`Errore nell'eliminazione del commento: ${deleteCommentResponse.status}`);
        }
      }
  
      // 4. Elimina i like associati al post
      const postLikesResponse = await fetch(`http://localhost:3001/api/likes/post/${postId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
  
      if (!postLikesResponse.ok) {
        throw new Error(`Errore nel recupero dei like del post: ${postLikesResponse.status}`);
      }
  
      const postLikes = await postLikesResponse.json();
  
      // Elimina ogni like associato al post
      for (const like of postLikes) {
        const deletePostLikeResponse = await fetch(`http://localhost:3001/api/likes/post/${postId}/user/${like.userId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
  
        if (!deletePostLikeResponse.ok) {
          throw new Error(`Errore nell'eliminazione dei like del post: ${deletePostLikeResponse.status}`);
        }
      }
  
      // 5. Elimina il post
      const deletePostResponse = await fetch(`http://localhost:3001/api/posts/delete/${postId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
  
      if (!deletePostResponse.ok) {
        throw new Error(`Errore nell'eliminazione del post: ${deletePostResponse.status}`);
      }
  
      // 6. Rimuovi il post dalla lista locale
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
          "Authorization": `Bearer ${token}`,
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
