import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import teachImg from "../assets/teach.png";
import exploreImg from "../assets/explore.png";
import "../pages/Dashboard.css";
import axios from "axios";

const Dashboard = () => {
  const [showIdeaForm, setShowIdeaForm] = useState(false);
  const [step, setStep] = useState(1);

  const [ideaName, setIdeaName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [skillsNeeded, setSkillsNeeded] = useState("");
  const [rolesNeeded, setRolesNeeded] = useState("");
  const [level, setLevel] = useState("");

  const [userEmail, setUserEmail] = useState("");

  const navigate = useNavigate();

  // 🌍 **Backend URL**
  const BASE_URL = "https://skillswap-backend-hj73.onrender.com/api";

  // ✅ Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/auth/me`, {
          withCredentials: true,
        });
        setUserEmail(res.data.email);
      } catch (err) {
        console.error("User fetch failed:", err);
        navigate("/login");
      }
    };
    fetchUser();
  }, [navigate]);

  const handleExploreClick = () => {
    navigate("/explore");
  };

  // 🚀 Submit idea
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${BASE_URL}/ideas`,
        {
          ideaName,
          description,
          category,
          teamSize,
          membersFilled: 1,
          skillsNeeded,
          rolesNeeded,
          level,
          email: userEmail,
        },
        { withCredentials: true }
      );

      setShowIdeaForm(false);
      setStep(1);
      setIdeaName("");
      setDescription("");
      setCategory("");
      setTeamSize("");
      setSkillsNeeded("");
      setRolesNeeded("");
      setLevel("");

      alert("✅ Idea posted successfully!");
    } catch (err) {
      console.error("❌ Error posting idea:", err);
      alert("Failed to post idea");
    }
  };

  return (
    <>
      <Navbar />
      <div className="stars-bg">
        <div className="dashboard-container">
          <div className="box" onClick={() => setShowIdeaForm(true)}>
            <img src={teachImg} alt="Post Idea" className="box-image" />
            <h2 className="box-title">Post a Project Idea</h2>
            <p className="box-description">
              “Share your idea and build your team.”
            </p>
          </div>

          <div className="box" onClick={handleExploreClick}>
            <img src={exploreImg} alt="Explore" className="box-image" />
            <h2 className="box-title">Explore Projects to Join</h2>
            <p className="box-description">
              “Find projects that match your skills.”
            </p>
          </div>
        </div>
      </div>

      {showIdeaForm && (
        <div className="popup-form">
          <h3>{step === 1 ? "Basic Project Info" : "Team & Requirements"}</h3>
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <>
                <label>Idea Name</label>
                <input
                  type="text"
                  value={ideaName}
                  onChange={(e) => setIdeaName(e.target.value)}
                  required
                />

                <label>Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />

                <label>Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Technology">Technology</option>
                  <option value="Science">Science</option>
                  <option value="Art">Art</option>
                  <option value="Social">Social</option>
                  <option value="Other">Other</option>
                </select>

                <div className="form-buttons">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowIdeaForm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="next-btn"
                    onClick={() => setStep(2)}
                  >
                    Next ➡️
                  </button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <label>Team Size</label>
                <input
                  type="number"
                  value={teamSize}
                  onChange={(e) => setTeamSize(e.target.value)}
                  required
                />

                <label>Skills Needed</label>
                <input
                  type="text"
                  value={skillsNeeded}
                  onChange={(e) => setSkillsNeeded(e.target.value)}
                  required
                />

                <label>Roles Needed</label>
                <input
                  type="text"
                  value={rolesNeeded}
                  onChange={(e) => setRolesNeeded(e.target.value)}
                  required
                />

                <label>Level</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  required
                >
                  <option value="">Select Level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Expert">Expert</option>
                </select>

                <div className="form-buttons">
                  <button
                    type="button"
                    className="back-btn"
                    onClick={() => setStep(1)}
                  >
                    ⬅️ Back
                  </button>
                  <button type="submit" className="submit-btn">
                    ✅ Submit
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      )}
    </>
  );
};

export default Dashboard;
