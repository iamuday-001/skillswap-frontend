import React from "react";
import { useNavigate } from "react-router-dom";
import "./intro.css";
import introImage from "./assets/intro-image.png";

const Intro = () => {
  const navigate = useNavigate();

  return (
    <div className="intro-container">
      <div className="intro-left">
        <h1 className="intro-title">
          <span className="intro-title-first">C</span>ollaborative{" "}
          <span className="intro-title-first">I</span>nnovation{" "}
          <span className="intro-title-first">P</span>latform
        </h1>
        <h2 className="intro-heading">Collaborate. Build. Succeed.</h2>
        <p className="intro-description">
          Collaborative Innovation Platform is where innovators and learners
          come together. Share your project ideas, form teams, and bring your
          visions to life. Whether you're a coder, designer, or strategist —
          find the right team and start building today!
        </p>
        <div className="intro-buttons">
          <button
            onClick={() => navigate("/login")}
            className="intro-btn login"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="intro-btn register"
          >
            Register
          </button>
        </div>
      </div>
      <div className="intro-right">
        <img
          src={introImage}
          alt="Collaborative Innovation Visual"
          className="intro-image"
        />
      </div>
    </div>
  );
};

export default Intro;
