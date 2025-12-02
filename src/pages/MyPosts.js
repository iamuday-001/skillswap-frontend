// src/components/MyPosts.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MyPosts.css"; // ✅ Import CSS

function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);

  // ✅ Get logged-in user
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/auth/me", { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  // ✅ Fetch only this user’s posts
  useEffect(() => {
    if (user?.email) {
      axios
        .get(`http://localhost:5000/api/skills?email=${user.email}`, {
          withCredentials: true,
        })
        .then((res) => setPosts(res.data))
        .catch((err) => console.error(err));
    }
  }, [user]);

  // ✅ Delete a post (with confirmation)
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "⚠️ Are you sure you want to delete this post?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/skills/${id}`, {
        withCredentials: true,
      });
      setPosts(posts.filter((post) => post._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete post");
    }
  };

  return (
    <div className="myposts-container">
      <h2 className="myposts-title">📌 My Posts</h2>

      {!user && <p>Loading user...</p>}
      {user && posts.length === 0 && <p>No posts yet</p>}

      <div className="myposts-list">
        {posts.map((post) => (
          <div className="mypost-card" key={post._id}>
            <h3>{post.skill}</h3>
            <p>{post.description}</p>
            <p>
              <strong>Category:</strong> {post.category}
            </p>
            <p>
              <strong>Availability:</strong> {post.availability}
            </p>
            <p>
              <strong>Experience:</strong> {post.experience}
            </p>
            <button
              className="delete-btn"
              onClick={() => handleDelete(post._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyPosts;
