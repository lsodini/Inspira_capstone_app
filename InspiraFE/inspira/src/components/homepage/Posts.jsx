import React, { useState, useEffect } from "react";
import "../../css/UCard.css"; 

const Posts = ({ post }) => {
  const [postLikes, setPostLikes] = useState([]);
  const [commentLikes, setCommentLikes] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
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

  const handleLikePost = async (postId) => {
    try {
      await fetch(`http://localhost:3001/api/likes/post/${postId}/user/${userId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPostLikes(postId);
    } catch (err) {
      console.error("Errore nel mettere like al post:", err.message);
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
            <img src={post.userImage} alt="user" className="uCard-cover" />
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

      <h4 className="uCard-message">{post.content}</h4>

      {post.mediaUrl && (
        <div className="uCard-imgBg">
          <img src={post.mediaUrl} alt="post" className="uCard-coverFull" />
        </div>
      )}

      <div className="uCard-btns">
        <div className="uCard-left">
          <img src="like.png" alt="like" onClick={() => handleLikePost(post.id)} />
          <h4 className="uCard-likes">{postLikes.length}</h4>
        </div>
        <div className="uCard-right">
          <h4>
            {comments.length} comments {post.sharesCount || 0} shares
          </h4>
        </div>
      </div>

      <div className="uCard-border"></div>

      <div className="uCard-icon">
        <div className="uCard-like">
          <img src="gray_like.png" alt="like" onClick={() => handleLikePost(post.id)} />
          <img src="comments.png" alt="comments" />
          <img src="share.png" alt="share" />
        </div>
      </div>

      <div className="uCard-border_bott"></div>

      <div>
        <h3>Comments</h3>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="uCard-comment">
              <div>{comment.content}</div>
              <div>Likes: {commentLikes[comment.id] || 0}</div>
            </div>
          ))
        ) : (
          <p>No comments yet.</p>
        )}
      </div>

      <div className="uCard-addComments">
        <div className="uCard-userimg">
          <img src={post.userImage} alt="user" className="uCard-cover" />
        </div>
        <input
          type="text"
          className="uCard-text"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button onClick={handleAddComment}>Add Comment</button>
      </div>
    </div>
  );
};

export default Posts;
