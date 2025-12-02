import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import "../pages/Requests.css";

const Requests = () => {
  const [userEmail, setUserEmail] = useState("");
  const [ownerRequests, setOwnerRequests] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load current user + requests
  useEffect(() => {
    const loadRequests = async () => {
      try {
        const userRes = await axios.get("http://localhost:5000/api/auth/me", {
          withCredentials: true,
        });
        const email = userRes.data.email;
        setUserEmail(email);

        const ownerRes = await axios.get(
          "http://localhost:5000/api/requests/owner",
          { params: { email }, withCredentials: true }
        );

        const myRes = await axios.get(
          "http://localhost:5000/api/requests/requester",
          { params: { email }, withCredentials: true }
        );

        setOwnerRequests(ownerRes.data || []);
        setMyRequests(myRes.data || []);
      } catch (err) {
        console.error(
          "Error loading requests:",
          err.response?.data || err.message
        );
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, []);

  // ✅ Accept / Reject action
  const handleAction = async (reqId, action) => {
    if (!window.confirm(`Are you sure you want to ${action} this request?`))
      return;

    try {
      await axios.put(
        `http://localhost:5000/api/requests/${reqId}`,
        { status: action },
        { withCredentials: true }
      );

      setOwnerRequests((prev) =>
        prev.map((r) => (r._id === reqId ? { ...r, status: action } : r))
      );

      alert(`Request ${action} successfully`);
    } catch (err) {
      console.error("Action error:", err.response?.data || err.message);
      alert("Failed to update request");
    }
  };

  // ✅ Helper to display nice status labels
  const formatStatus = (status) => {
    if (status === "kicked") return "Removed from team";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="center">Loading...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="requests-page">
        <h2>Requests Center</h2>

        {/* Incoming Requests (I am Owner) */}
        <h3>Requests to Review</h3>
        {ownerRequests.length === 0 ? (
          <div className="no-requests">No incoming requests</div>
        ) : (
          ownerRequests.map((r) => {
            const idea = r.ideaId || {};
            return (
              <div className="request-card" key={r._id}>
                <div className="request-left">
                  <h3>{idea.ideaName || "Project"}</h3>
                  <p className="small">
                    Requested by:{" "}
                    <strong>{r.requesterName || r.requesterEmail}</strong>
                  </p>
                  <p className="small">
                    Requested at: {new Date(r.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="request-actions">
                  {r.status === "pending" ? (
                    <>
                      <button
                        className="accept"
                        onClick={() => handleAction(r._id, "accepted")}
                      >
                        Accept
                      </button>
                      <button
                        className="reject"
                        onClick={() => handleAction(r._id, "rejected")}
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span className={`status-badge ${r.status}`}>
                      {formatStatus(r.status)}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* My Requests (I am Requester) */}
        <h3>My Requests Status</h3>
        {myRequests.length === 0 ? (
          <div className="no-requests">No requests made</div>
        ) : (
          myRequests.map((r) => {
            const idea = r.ideaId || {};
            return (
              <div className="request-card" key={r._id}>
                <div className="request-left">
                  <h3>{idea.ideaName || "Project"}</h3>
                  <p className="small">
                    Owner: <strong>{r.ownerEmail}</strong>
                  </p>
                  <p className="small">
                    Requested at: {new Date(r.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="request-actions">
                  <span className={`status-badge ${r.status}`}>
                    {formatStatus(r.status)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
};

export default Requests;
