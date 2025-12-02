// client/src/pages/Workspace.js

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import "./Workspace.css";
import { io } from "socket.io-client";

const API_BASE = "http://localhost:5000/api";
const SOCKET_URL = "http://localhost:5000";

export default function Workspace() {
  const [teams, setTeams] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [newMessageMap, setNewMessageMap] = useState({});
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL, { withCredentials: true });

    socketRef.current.on("connect", () => {
      console.log("Connected to socket:", socketRef.current.id);
    });

    socketRef.current.on("receiveMessage", (msg) => {
      if (!msg?.teamId) return;

      setTeams((prev) =>
        prev.map((t) =>
          String(t._id) === String(msg.teamId)
            ? {
                ...t,
                messages: [
                  ...(t.messages || []).filter(
                    (m) =>
                      !(
                        m.senderEmail === msg.senderEmail &&
                        m.text === msg.text &&
                        m.createdAt === msg.createdAt
                      )
                  ),
                  msg,
                ],
              }
            : t
        )
      );
    });

    socketRef.current.on("memberJoined", ({ email, teamId }) => {
      setTeams((prev) =>
        prev.map((t) =>
          String(t._id) === String(teamId)
            ? {
                ...t,
                members: [...(t.members || []), { email, role: "member" }],
              }
            : t
        )
      );
    });

    socketRef.current.on("memberRemoved", ({ email, teamId }) => {
      setTeams((prev) =>
        prev.map((t) =>
          String(t._id) === String(teamId)
            ? {
                ...t,
                members: (t.members || []).filter((m) => m.email !== email),
              }
            : t
        )
      );
    });

    return () => socketRef.current && socketRef.current.disconnect();
  }, []);

  useEffect(() => {
    axios
      .get(`${API_BASE}/auth/me`, { withCredentials: true })
      .then((res) => {
        setUserEmail(res.data.email);
        fetchTeams(res.data.email);
      })
      .catch((err) => console.error("Failed to fetch user", err));
  }, []);

  const fetchTeams = async (email) => {
    try {
      const res = await axios.get(`${API_BASE}/teams/user/${email}`);
      const teamsData = res.data || [];
      setTeams(teamsData);

      if (socketRef.current) {
        teamsData.forEach((t) => {
          if (t?._id) socketRef.current.emit("joinRoom", String(t._id));
        });
      }
    } catch (err) {
      console.error("Failed to fetch teams", err);
    }
  };

  const handleKick = async (teamId, memberEmail) => {
    if (!window.confirm(`Remove ${memberEmail} from the team?`)) return;

    try {
      await axios.delete(`${API_BASE}/teams/${teamId}/members/${memberEmail}`);
      fetchTeams(userEmail);
    } catch (err) {
      console.error("Failed to remove member", err);
      alert("Failed to remove member");
    }
  };

  const handleSendMessage = (teamId) => {
    const text = (newMessageMap[teamId] || "").trim();
    if (!text) return;

    socketRef.current.emit("sendMessage", {
      teamId,
      senderEmail: userEmail,
      text,
    });

    setNewMessageMap((prev) => ({ ...prev, [teamId]: "" }));
  };

  const handleInputChange = (teamId, value) => {
    setNewMessageMap((prev) => ({ ...prev, [teamId]: value }));
  };

  return (
    <div className="workspace-container">
      <Navbar />
      <h2 className="workspace-title">My Workspaces</h2>

      {teams.length === 0 ? (
        <p className="no-teams">You are not part of any team. Join a team.</p>
      ) : (
        <div className="workspace-list">
          {teams.map((team) => (
            <div key={team._id} className="workspace-card">
              <div className="workspace-header">
                <h3>{team.ideaId?.ideaName || "Untitled Project"}</h3>
                <p>{team.ideaId?.description || "No description"}</p>
              </div>

              <div className="workspace-body">
                <div className="members-section">
                  <h4>Team Members</h4>
                  <ul>
                    {(team.members || []).map((member) => (
                      <li key={member.email}>
                        <span>
                          {member.email}
                          {member.role === "owner" && (
                            <span className="owner-badge">(Owner)</span>
                          )}
                        </span>

                        {team.members.find((m) => m.email === userEmail)
                          ?.role === "owner" &&
                          member.role !== "owner" && (
                            <button
                              className="kick-btn"
                              onClick={() => handleKick(team._id, member.email)}
                            >
                              Kick
                            </button>
                          )}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="chat-section">
                  <h4>Group Chat</h4>

                  <div className="chat-box" id={`chat-box-${team._id}`}>
                    {!team.messages || team.messages.length === 0 ? (
                      <p className="no-messages">No messages yet.</p>
                    ) : (
                      (team.messages || []).map((msg, index) => (
                        <div
                          key={index}
                          className={`chat-msg ${
                            msg.senderEmail === userEmail
                              ? "own-msg"
                              : "other-msg"
                          }`}
                        >
                          <strong>{msg.senderEmail}:</strong> {msg.text}
                        </div>
                      ))
                    )}
                  </div>

                  <div className="chat-input">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={newMessageMap[team._id] || ""}
                      onChange={(e) =>
                        handleInputChange(team._id, e.target.value)
                      }
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleSendMessage(team._id)
                      }
                    />
                    <button onClick={() => handleSendMessage(team._id)}>
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
