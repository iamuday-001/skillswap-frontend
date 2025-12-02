import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Navbar.css";
import logo from "../assets/transfer.png";

const Navbar = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [requestsCount, setRequestsCount] = useState(0);
  const [teams, setTeams] = useState([]);

  const [user, setUser] = useState({
    name: "Guest",
    email: "No email",
    avatar: "",
  });

  // 🌍 Backend URL
  const BASE_URL = "https://skillswap-backend-hj73.onrender.com/api";

  function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00ffffff).toString(16).toUpperCase();
    return "#" + "00000".substring(0, 6 - c.length) + c;
  }

  const Avatar = ({ name }) => {
    const letter = name?.charAt(0).toUpperCase();
    return (
      <div
        style={{
          width: "42px",
          height: "42px",
          borderRadius: "50%",
          backgroundColor: stringToColor(name),
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "20px",
          fontWeight: 700,
          color: "#fff",
          cursor: "pointer",
        }}
      >
        {letter}
      </div>
    );
  };

  useEffect(() => {
    const fetchUserAndRequests = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/auth/me`, {
          withCredentials: true,
        });

        const currentUser = {
          name: res.data.username || "Guest",
          email: res.data.email || "No email",
          avatar: res.data.profilePic || "",
        };
        setUser(currentUser);

        if (res.data.email) {
          const ownerRes = await axios.get(
            `${BASE_URL}/requests/owner?email=${res.data.email}`
          );
          const requesterRes = await axios.get(
            `${BASE_URL}/requests/requester?email=${res.data.email}`
          );

          const ownerNotifs = ownerRes.data.filter(
            (r) => r.status === "pending"
          );
          const requesterNotifs = requesterRes.data.filter(
            (r) => r.status !== "pending"
          );

          setRequestsCount(ownerNotifs.length + requesterNotifs.length);

          const teamRes = await axios.get(
            `${BASE_URL}/teams/user/${res.data.email}`
          );
          setTeams(teamRes.data);
        }
      } catch (err) {
        console.error("Error fetching user/requests:", err);
      }
    };
    fetchUserAndRequests();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${BASE_URL}/auth/logout`,
        {},
        { withCredentials: true }
      );
      localStorage.removeItem("userEmail");
      setShowDropdown(false);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    const form = e.target;
    const updatedName = form.name.value;
    const updatedAvatar = form.avatar.value;

    setUser((prev) => ({
      ...prev,
      name: updatedName,
      avatar: updatedAvatar,
    }));

    setShowEditProfile(false);
  };

  return (
    <>
      <div className="navbar">
        <div className="navbar-left" onClick={() => navigate("/")}>
          <img src={logo} alt="Logo" className="navbar-logo" />
        </div>

        <div className="navbar-center">
          <h1 className="navbar-title">Collaborative Innovation Platform</h1>
        </div>

        <div className="navbar-right">
          <div
            className="notification-bell"
            onClick={() => navigate("/requests")}
          >
            🔔
            {requestsCount > 0 && (
              <span className="notification-badge">{requestsCount}</span>
            )}
          </div>

          {teams.length > 0 &&
            teams.map((t) => (
              <Link key={t._id} to={`/workspace/${t._id}`} className="nav-btn">
                🚀 {t.ideaId?.ideaName || "Workspace"}
              </Link>
            ))}

          <div
            className="user-info"
            onClick={() => setShowDropdown((prev) => !prev)}
          >
            <span className="user-name">{user.name}</span>
            <span className="user-email">{user.email}</span>
            {user.avatar ? (
              <img src={user.avatar} className="user-avatar" alt="Profile" />
            ) : (
              <Avatar name={user.name} />
            )}
          </div>

          {showDropdown && (
            <div className="dropdown-menu">
              <button onClick={() => navigate("/myposts")}>📌 My Posts</button>
              <button onClick={handleLogout}>🚪 Logout</button>
            </div>
          )}
        </div>
      </div>

      {showEditProfile && (
        <div className="modal-overlay">
          <div className="edit-profile-modal">
            <form onSubmit={handleProfileUpdate} className="edit-profile-form">
              <h3>Edit Profile</h3>
              <input
                type="text"
                name="name"
                defaultValue={user.name}
                required
              />
              <input
                type="text"
                name="avatar"
                defaultValue={user.avatar}
                required
              />
              <div className="modal-buttons">
                <button type="submit" className="save-btn">
                  Save
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowEditProfile(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
