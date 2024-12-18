import React, { useState, useEffect } from "react";
import "../../css/UCard.css";
import { FaThumbsUp, FaRegThumbsUp } from "react-icons/fa";
import { FaCommentDots, FaEllipsisH } from "react-icons/fa";

const Posts = ({ post, onDelete }) => {
  const [postLikes, setPostLikes] = useState({});
  const [userHasLikedPost, setUserHasLikedPost] = useState({});
  const [commentLikes, setCommentLikes] = useState({});
  const [userHasLikedComment, setUserHasLikedComment] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [menuOpen, setMenuOpen] = useState(false);
  const [commentMenuOpen, setCommentMenuOpen] = useState({});
  const [showComments, setShowComments] = useState(false); 
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("authToken");
  const username = localStorage.getItem("username");

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
      const likesResponse = await fetch(`http://localhost:3001/api/likes/post/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const likes = await likesResponse.json();
      setPostLikes(likes);

      const userLikedResponse = await fetch(
        `http://localhost:3001/api/likes/post/${postId}/user/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const userLiked = await userLikedResponse.json();
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

      
      fetchedComments.forEach((comment) => {
        fetchCommentLikes(comment.id);
      });

      const userLikedComments = {};
      for (const comment of fetchedComments) {
        const userLikedResponse = await fetch(
          `http://localhost:3001/api/likes/comment/${comment.id}/user/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        userLikedComments[comment.id] = await userLikedResponse.json();
      }
      setUserHasLikedComment(userLikedComments);
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
          length: userHasLikedPost ? prev.length - 1 : prev.length + 1,
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

      const response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setUserHasLikedComment((prev) => ({
          ...prev,
          [commentId]: !prev[commentId],
        }));
        fetchCommentLikes(commentId);
      } else {
        console.error("Errore nel toggling del like al commento:", response.statusText);
      }
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

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/comments/${commentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setComments((prev) => prev.filter((comment) => comment.id !== commentId));
      } else {
        console.error("Errore nella cancellazione del commento:", response.statusText);
      }
    } catch (err) {
      console.error("Errore nella cancellazione del commento:", err.message);
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

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const toggleCommentMenu = (commentId) => {
    setCommentMenuOpen((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  
  const toggleShowComments = () => {
    setShowComments((prev) => !prev);
  };

  return (
    <div className="uCard-card">
      <div className="uCard-top">
        <div className="uCard-user_details">
          <div className="uCard-profile_img">
            <img
              src={post.avatarUrl || "/images/default-avatar.png"}
              alt="User Avatar"
              className="uCard-avatar"
              width={40}
              height={40}
            />
          </div>
          <h3>
            {post.username}
            <br />
            <span className="uCard-hour">{new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
   
  }).format(new Date(post.createdAt))}</span>
          </h3>
            
        </div>
        {post.username === username && (
          <div className="uCard-dot" onClick={toggleMenu}>
            <FaEllipsisH className="uCard-dot-icon" />
          </div>
        )}
        {menuOpen && (
          <div className="uCard-dropdown">
            <button onClick={handleStartEditing}>Edit Post</button>
            <button onClick={handleDeletePost}>Delete Post</button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div>
          <textarea className="edit-text"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
          <br />
          <button className="edit-btn"onClick={handleEditPost}>Salva</button>
          <button className="edit-btn" onClick={() => setIsEditing(false)}>Cancella</button>
        </div>
      ) : (
        <h4 className="uCard-message">{post.content}</h4>
      )}

      

      <div className="uCard-btns">
        <div className="uCard-left">
          <div className="uCard-likes" onClick={toggleLikePost}>
            {userHasLikedPost ? (
              <FaThumbsUp className="uCard-icon-image liked me-1 mb-1 " />
            ) : (
              <FaRegThumbsUp className="uCard-icon-image me-1 mb-1 " />
            )}
            {postLikes.length}
          </div>
        </div>
        <div className="uCard-right ">
          
            <FaCommentDots className="uCard-icon-image
            me-1 mb-1 " onClick={toggleShowComments} />
            {comments.length} 
          
        </div>
      </div>

      <div className="uCard-border"></div>

      {showComments && (
        <div>
          <h3>Commenti</h3>
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="uCard-comment">
                <div className="uCard-user_details">
                  <img
                    src={comment.avatarUrl || "/images/default-avatar.png"}
                    alt="Comment User Avatar"
                    className="uCard-avatar rounded-circle me-2"
                    width={30}
                    height={30}
                  />
                  <h6>{comment.username || "Anonymous"}
                    <br/>
                  <span className="uCard-hour" style={{fontSize: "0.8rem" }}>{new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
   
  }).format(new Date(post.createdAt))}</span>
                  </h6>
                </div>
                <div className="uCard-comment-content">
                  {comment.content}

                </div>
                {comment.username === username && (
                  <div className="uCard-comment-dot" onClick={() => toggleCommentMenu(comment.id)}>
                    <FaEllipsisH className="uCard-dot-icon" />
                  </div>
                )}
                <div className="uCard-likes-comment"onClick={() => toggleLikeComment(comment.id)}>

                  {userHasLikedComment[comment.id] ? (
                    <FaThumbsUp className="uCard-icon-image liked me-1 mb-1" />
                  ) : (
                    <FaRegThumbsUp className="uCard-icon-image me-1 mb-1" />
                  )}
                  {commentLikes[comment.id] || 0}
                </div>
                
                {commentMenuOpen[comment.id] && (
                  <div className="uCard-comment-dropdown">
                    <button onClick={() => handleDeleteComment(comment.id)}>Delete Comment</button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>Ancora nessun commento.</p>
          )}
        </div>
      )}

      <div className="uCard-addComments">
        <div className="uCard-userimg">
          <img
            src={post.avatarUrl || "/images/default-avatar.png"}
            alt="user"
            className="uCard-avatar rounded-circle"
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
        <button className="edit-btn" onClick={handleAddComment}>Invia</button>
      </div>
    </div>
  );
};

export default Posts;
