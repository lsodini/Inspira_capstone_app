import React, { useState, useEffect } from "react";
import "../../css/UserPage.css";

const Post = ({ post }) => {
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
      console.log("User not logged in.");
    }
  }, [post.id, userId, token]);

  
  const fetchPostLikes = async (postId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/likes/post/${postId}`, {
        headers: {
          "Authorization": `Bearer ${token}`, 
        },
      });
      const likes = await response.json();
      setPostLikes(likes);
    } catch (err) {
      console.error("Error fetching post likes:", err.message);
    }
  };

 
  const fetchComments = async (postId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/comments/post/${postId}`, {
        headers: {
          "Authorization": `Bearer ${token}`, 
        },
      });
      const fetchedComments = await response.json();
      console.log(fetchedComments); 
      setComments(fetchedComments);
      
      fetchedComments.forEach(comment => fetchCommentLikes(comment.id));
    } catch (err) {
      console.error("Error fetching comments:", err.message);
    }
  };

  
  const fetchCommentLikes = async (commentId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/likes/count/comment/${commentId}`, {
        headers: {
          "Authorization": `Bearer ${token}`, 
        },
      });
      const likeCount = await response.json();
      setCommentLikes(prevLikes => ({
        ...prevLikes,
        [commentId]: likeCount,
      }));
    } catch (err) {
      console.error("Error fetching comment likes:", err.message);
    }
  };

  
 const handleLikePost = async (postId) => {
  if (!userId || !token) {
    alert("You must be logged in to like a post.");
    return;
  }

  try {
    const response = await fetch(`http://localhost:3001/api/likes/post/${postId}/user/${userId}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,  
      },
    });

    if (!response.ok) {
      throw new Error("Error liking the post.");
    }

    fetchPostLikes(postId); 
  } catch (err) {
    console.error("Error liking post:", err.message);
  }
};


  
  const handleLikeComment = async (commentId) => {
    if (!userId || !token) {
      alert("You must be logged in to like a comment.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/likes/comment/${commentId}/user/${userId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`, 
        },
      });

      console.log("Like comment response:", response.status);
      if (!response.ok) {
        throw new Error("Error liking the comment.");
      }

      fetchCommentLikes(commentId); 
    } catch (err) {
      console.error("Error liking comment:", err.message);
    }
  };

  
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    if (!userId || !token) {
      alert("You must be logged in to add a comment.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/comments/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, 
        },
        body: JSON.stringify({
          content: newComment,
          post: { id: post.id }, 
          user: { id: userId },
        }),
      });

      console.log("Create comment response:", response.status);

      if (!response.ok) {
        throw new Error("Error creating comment.");
      }

      setNewComment(""); 
      fetchComments(post.id); 
    } catch (err) {
      console.error("Error adding comment:", err.message);
    }
  };

  return (
    <div className="post">
      <div className="post-header">
        <h3>{post.username}</h3>
        <span>{new Date(post.createdAt).toLocaleString()}</span>
      </div>
      <p>{post.content}</p>
      {post.mediaUrl && <img src={post.mediaUrl} alt="Post media" />}

      {/* Like Post */}
      <div>
        <button onClick={() => handleLikePost(post.id)}>Like Post</button>
        <div>Likes: {postLikes.length}</div>
      </div>

      {/* Comments Section */}
      <div>
        <h3>Comments</h3>
        {comments && Array.isArray(comments) ? (
          comments.map((comment) => (
            <div key={comment.id}>
              <div>{comment.content}</div>
              <div>{comment.message ? comment.message : ""}</div>
              <div>{comment.timestamp ? new Date(comment.timestamp).toLocaleString() : ""}</div> 
              <button onClick={() => handleLikeComment(comment.id)}>Like Comment</button>
              <div>Likes: {commentLikes[comment.id] || 0}</div> 
            </div>
          ))
        ) : (
          <p>No comments yet.</p>
        )}

        {/* Add Comment */}
        <div>
          <textarea
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button onClick={handleAddComment}>Add Comment</button>
        </div>
      </div>
    </div>
  );
};

export default Post;
