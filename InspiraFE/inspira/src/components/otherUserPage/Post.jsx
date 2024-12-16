import React, { useState, useEffect } from "react";
import "../../css/UCard.css";
import { FaThumbsUp, FaRegThumbsUp } from "react-icons/fa"; // Icone per il like
import { FaCommentDots } from "react-icons/fa"; // Icona per commenti

const Posts = ({ post, onDelete, onEdit }) => {
  const [postLikes, setPostLikes] = useState({});
  const [userHasLikedPost, setUserHasLikedPost] = useState({});
  const [commentLikes, setCommentLikes] = useState({});
  const [userHasLikedComment, setUserHasLikedComment] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (userId && token) {
      fetchPostLikes(post.id);
      fetchComments(post.id);
    } else {
      console.log("Utente non autenticato.");
    }
  }, [post.id, userId, token]);

  const fetchPostLikes = async (postId) => {
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
    try {
      const response = await fetch(`http://localhost:3001/api/comments/post/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const fetchedComments = await response.json();
      setComments(fetchedComments);
  
      fetchedComments.forEach((comment) => fetchCommentLikes(comment.id));
    } catch (err) {
      console.error("Errore nel recupero dei commenti:", err.message);
    }
  };

  const fetchCommentLikes = async (commentId) => {
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

  return (
    <div className="uCard-card">
      <div className="uCard-top">
        <div className="uCard-user_details">
          <div className="uCard-profile_img">
            <img
              src={post.avatarUrl || "images/default-avatar.png"}
              alt="User Avatar"
              className="uCard-avatar"
              width={40}
              height={40}
            />
          </div>
          <h3>
            {post.username}
            <br />
            <span className="uCard-hour">{new Date(post.createdAt).toLocaleString()}</span>
            <span className="uCard-globDot">.</span>
          </h3>
        </div>
        
      </div>

      <h4 className="uCard-message">{post.content}</h4>

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
            {comments.length} commenti
          </h4>
        </div>
      </div>

      <div>
        <h3>Commenti</h3>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="uCard-comment">
              <div className="uCard-user_details">
                <img
                  src={comment.avatarUrl || "/images/default-avatar.png"}
                  alt="Comment User Avatar"
                  className="uCard-avatar rounded-5"
                  width={30}
                  height={30}
                />
                <h4>{comment.username || "Anonymous"}</h4>
              </div>
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
          <p>Ancora nessun commento.</p>
        )}
      </div>

      <div className="uCard-addComments">
        <div className="uCard-userimg">
          <img
            src={post.avatarUrl || "default-avatar.png"}
            alt="user"
            className="uCard-avatar rounded-5"
            width={40}
            height={40}
          />
        </div>
        <input
          type="text"
          className="uCard-text"
          placeholder="Scrivi un commento..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button onClick={handleAddComment}>Add Comment</button>
      </div>
    </div>
  );
};

export default Posts;
