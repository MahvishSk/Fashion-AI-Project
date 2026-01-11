import React from "react";
import "../styles/Home.css";
import logo from "../assets/logo.png"; // put your logo in src/assets

const Home = ({ userName = "Beautiful" }) => {
  return (
    <div className="home-container">
      <div className="home-card">
        <img src={logo} alt="StyleU Logo" className="home-logo" />

        <h2 className="home-greeting">Hello, {userName} ✨</h2>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search outfits, styles, trends..."
            className="search-input"
          />
        </div>

        <p className="home-subtext">
          Let StyleU help you discover your perfect look today 💕
        </p>
      </div>
    </div>
  );
};

export default Home;
