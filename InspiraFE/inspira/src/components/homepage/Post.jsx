import React, { useState, useEffect } from "react";
import "../../css/UCard.css";
import { FaThumbsUp, FaRegThumbsUp } from "react-icons/fa"; 
import { FaCommentDots } from "react-icons/fa"; 

const Posts = ({ post, onDelete }) => {
  const [postLikes, setPostLikes] = useState({}); 
  const [userHasLikedPost, setUserHasLikedPost] = useState(false); 
  const [commentLikes, setCommentLikes] = useState({}); 
  const [userHasLikedComment, setUserHasLikedComment] = useState({}); 
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content); 
  const [user, setUser] = useState(null); 
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (userId && token) {
      fetchPostLikes(post.id);
      fetchComments(post.id);
      fetchUserData(post.userId); 
    } else {
      console.log("Utente non autenticato.");
    }
  }, [post.id, userId, token]);

  const fetchUserData = async (userId) => {
    if (!userId) return; // Controllo se l'ID dell'utente è valido

    try {
      const response = await fetch(`http://localhost:3001/api/utenti/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = await response.json();
      setUser(userData);  
    } catch (err) {
      console.error("Errore nel recupero dei dati dell'utente:", err.message);
    }
  };

  const fetchPostLikes = async (postId) => {
    if (!postId) return;

    try {
      const response = await fetch(`http://localhost:3001/api/likes/post/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const likes = await response.json();
      setPostLikes(likes);
  
      const userLiked = likes.some((like) => like.userId === userId);
      setUserHasLikedPost(userLiked);
    } catch (err) {
      console.error("Errore nel recupero dei likes del post:", err.message);
    }
  };

  const fetchComments = async (postId) => {
    if (!postId) return;

    try {
      const response = await fetch(`http://localhost:3001/api/comments/post/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const fetchedComments = await response.json();
      setComments(fetchedComments);
  
      fetchedComments.forEach((comment) => {
        fetchUserDataForComment(comment.userId);
      });
    } catch (err) {
      console.error("Errore nel recupero dei commenti:", err.message);
    }
  };
  
  const fetchUserDataForComment = async (userId) => {
    if (!userId) return;

    try {
      const response = await fetch(`http://localhost:3001/api/utenti/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = await response.json();
      setComments((prevComments) => {
        return prevComments.map((comment) =>
          comment.userId === userId
            ? { ...comment, userAvatarUrl: userData.avatarUrl } 
            : comment
        );
      });
    } catch (err) {
      console.error("Errore nel recupero dei dati dell'utente per il commento:", err.message);
    }
  };

  const fetchCommentLikes = async (commentId) => {
    if (!commentId) return;

    try {
      const response = await fetch(`http://localhost:3001/api/likes/count/comment/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const likeCount = await response.json();
      setCommentLikes((prev) => ({ ...prev, [commentId]: likeCount })); 
    } catch (err) {
      console.error("Errore nel recupero dei likes dei commenti:", err.message);
    }
  };

  const toggleLikePost = async () => {
    if (!userId || !token) return;

    try {
      const url = `http://localhost:3001/api/likes/post/${post.id}/user/${userId}`;
      const method = userHasLikedPost ? "DELETE" : "POST"; 
      
      const response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (response.ok) {
        setUserHasLikedPost((prev) => !prev);
        setPostLikes((prev) => ({
          ...prev,
          length: userHasLikedPost ? Math.max(0, prev.length - 1) : prev.length + 1,
        }));
      } else {
        console.error("Errore nel toggling del like al post:", response.statusText);
      }
    } catch (err) {
      console.error("Errore nel toggling del like al post:", err.message);
    }
  };

  const toggleLikeComment = async (commentId) => {
    if (!userId || !token) return;

    try {
      const url = `http://localhost:3001/api/likes/comment/${commentId}/user/${userId}`;
      const method = userHasLikedComment[commentId] ? "DELETE" : "POST"; 
      await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserHasLikedComment((prev) => ({
        ...prev,
        [commentId]: !prev[commentId],
      }));

      fetchCommentLikes(commentId); 
    } catch (err) {
      console.error("Errore nel toggling del like al commento:", err.message);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    if (!userId || !token) return; // Aggiungi il controllo di autenticazione

    try {
      await fetch(`http://localhost:3001/api/comments/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: newComment,
          post: { id: post.id },
          user: { id: userId },
        }),
      });
      setNewComment("");
      fetchComments(post.id); 
    } catch (err) {
      console.error("Errore nell'aggiungere un commento:", err.message);
    }
  };

  const handleEditPost = async () => {
    if (!editedContent.trim()) return;

    try {
      const response = await fetch(`http://localhost:3001/api/posts/${post.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: editedContent,
        }),
      });

      if (!response.ok) throw new Error("Errore nella modifica del post");

      const updatedPost = await response.json();
      post.content = updatedPost.content; 
      setIsEditing(false); 
      fetchPostLikes(post.id); 
      fetchComments(post.id); 
    } catch (err) {
      console.error("Errore nel modificare il post:", err.message);
    }
  };

  const handleDeletePost = () => {
    onDelete(post.id); 
  };

  const handleStartEditing = () => {
    setIsEditing(true); 
    setEditedContent(post.content);
  };

  return (
    <div className="uCard-card">
      <div className="uCard-top">
        <div className="uCard-user_details">
          <div className="uCard-profile_img">
            <img
              src={post.user?.avatarUrl || "default-avatar.png"}
              alt="User Avatar"
              className="uCard-avatar"
            />
          </div>
          <h3>
            {post.username}
            <br />
            <span className="uCard-hour">{new Date(post.createdAt).toLocaleString()}</span>
            <span className="uCard-globDot">.</span>
          </h3>
        </div>
        <div className="uCard-dot">
          <img src="dot.png" alt="dot" />
        </div>
      </div>

      {isEditing ? (
        <div>
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
          <button onClick={handleEditPost}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <h4 className="uCard-message">{post.content}</h4>
      )}

      {post.mediaUrl && (
        <div className="uCard-imgBg">
          <img src={post.mediaUrl} alt="post" className="uCard-coverFull" />
        </div>
      )}

      <div className="uCard-btns">
        <div className="uCard-left">
          <div className="uCard-likes" onClick={toggleLikePost}>
            {userHasLikedPost ? (
              <FaThumbsUp className="uCard-icon-image liked" />
            ) : (
              <FaRegThumbsUp className="uCard-icon-image" />
            )}
            {postLikes.length}
          </div>
        </div>
        <div className="uCard-right">
          <h4>
            <FaCommentDots className="uCard-icon-image" />
            {comments.length} comments
          </h4>
        </div>
      </div>

      <div className="uCard-border"></div>

      <div>
        <h3>Comments</h3>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="uCard-comment">
              <div>{comment.content}</div>
              <div onClick={() => toggleLikeComment(comment.id)}>
                {userHasLikedComment[comment.id] ? (
                  <FaThumbsUp className="uCard-icon-image liked" />
                ) : (
                  <FaRegThumbsUp className="uCard-icon-image" />
                )}
                {commentLikes[comment.id] || 0}
              </div>
            </div>
          ))
        ) : (
          <p>No comments yet.</p>
        )}
      </div>

      <div className="uCard-addComments">
        <div className="uCard-userimg">
          <img
            src={user?.avatarUrl || "default-avatar.png"}
            alt="user-avatar"
            className="uCard-avatar2"
          />
        </div>
        <input
          type="text"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button onClick={handleAddComment}>Add Comment</button>
      </div>
    </div>
  );
};

export default Posts;
