// src/pages/Explore.js
import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import "../pages/Explore.css";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://skillswap-backend-hj73.onrender.com/api";

const Explore = () => {
  const [ideas, setIdeas] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [loadingIdeas, setLoadingIdeas] = useState(true);
  const [sendingId, setSendingId] = useState(null);
  const [requestedIdeaIds, setRequestedIdeaIds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      try {
        const me = await axios.get(`${API_BASE}/auth/me`, {
          withCredentials: true,
        });
        const email = me.data?.email || "";
        setUserEmail(email);

        if (email) {
          const myReq = await axios.get(`${API_BASE}/requests/requester`, {
            params: { email },
            withCredentials: true,
          });
          const ids = (myReq.data || []).map((r) =>
            r.ideaId && r.ideaId._id ? r.ideaId._id : String(r.ideaId)
          );
          setRequestedIdeaIds(ids);
        }
      } catch (err) {
        console.error(
          "Error fetching user or my requests:",
          err.response?.data || err.message
        );
      }
    };
    init();
  }, []);

  useEffect(() => {
    const fetchIdeas = async () => {
      setLoadingIdeas(true);
      try {
        const res = await axios.get(`${API_BASE}/ideas`);
        setIdeas(res.data || []);
      } catch (err) {
        console.error(
          "Error fetching ideas:",
          err.response?.data || err.message
        );
      } finally {
        setLoadingIdeas(false);
      }
    };
    fetchIdeas();
  }, []);

  const handleRequestJoin = async (idea) => {
    if (!userEmail) {
      alert("Please log in to request to join a project.");
      navigate("/login");
      return;
    }
    if (!idea || !idea._id) {
      alert("Invalid idea.");
      return;
    }
    if (idea.email === userEmail) {
      alert(
        "You are the owner of this project — you cannot request to join your own idea."
      );
      return;
    }
    if (requestedIdeaIds.includes(idea._id)) {
      alert("You already sent a request for this project.");
      return;
    }

    if (!window.confirm(`Send join request to "${idea.ideaName}"?`)) return;

    setSendingId(idea._id);
    try {
      const payload = {
        ideaId: idea._id,
        requesterEmail: userEmail,
        ownerEmail: idea.email,
      };

      await axios.post(`${API_BASE}/requests`, payload, {
        withCredentials: true,
      });

      setRequestedIdeaIds((prev) => [...prev, idea._id]);
      alert("✅ Request sent successfully!");
    } catch (err) {
      const serverMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data ||
        err.message;
      console.error("Request join error:", err.response || err);
      alert(serverMsg);
    } finally {
      setSendingId(null);
    }
  };

  return (
    <>
      <Navbar />
      <div className="stars-bg">
        <div className="explore-container">
          <h2 className="explore-title">🚀 Explore Project Ideas</h2>

          {loadingIdeas ? (
            <p className="no-ideas">Loading ideas...</p>
          ) : ideas.length === 0 ? (
            <p className="no-ideas">No project ideas posted yet.</p>
          ) : (
            <div className="ideas-grid">
              {ideas.map((idea) => {
                const alreadyRequested = requestedIdeaIds.includes(idea._id);
                const isOwner = userEmail && idea.email === userEmail;

                return (
                  <div className="idea-card" key={idea._id}>
                    <div className="idea-header">
                      <h3 className="idea-title">{idea.ideaName}</h3>
                      <span className="idea-level">{idea.level}</span>
                    </div>

                    <p className="idea-description">
                      {idea.description?.length > 100
                        ? idea.description.slice(0, 100) + "..."
                        : idea.description}
                    </p>

                    <div className="idea-details">
                      <p>
                        <strong>Category:</strong> {idea.category}
                      </p>
                      <p>
                        <strong>Team Size:</strong> {idea.teamSize}
                      </p>
                      <p>
                        <strong>Skills Needed:</strong> {idea.skillsNeeded}
                      </p>
                      <p>
                        <strong>Roles Needed:</strong> {idea.rolesNeeded}
                      </p>
                    </div>

                    <p className="posted-by">👤 Posted by: {idea.email}</p>

                    <div className="idea-actions">
                      <button
                        className="join-btn"
                        onClick={() => handleRequestJoin(idea)}
                        disabled={
                          sendingId === idea._id || alreadyRequested || isOwner
                        }
                      >
                        {isOwner
                          ? "Your Post"
                          : alreadyRequested
                          ? "Requested"
                          : sendingId === idea._id
                          ? "Sending..."
                          : "Request to Join"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Explore;
