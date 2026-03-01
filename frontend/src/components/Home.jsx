import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo1.png";
import icon1 from "../assets/dress.png";
import icon2 from "../assets/trending.png";
import icon3 from "../assets/saved.png";
import casualImg from "../assets/casual.jpg";
import partyImg from "../assets/party.jpg";
import officeImg from "../assets/office.jpg";
import traditionalImg from "../assets/traditional.jpg";
import fashion1 from "../assets/Fashionimg1.jpg";
import fashion2 from "../assets/Fashionimg2.jpg";
import fashion3 from "../assets/Fashionimg3.jpg";
import fashion4 from "../assets/Fashionimg4.jpg";
import fashion5 from "../assets/Fashionimg5.jpg";
import fashion6 from "../assets/Fashionimg6.jpg";
import "../styles/Home.css";
import Popup from "./Popup";
import Header from "../components/Header";
import { useApp } from "./Appcontext";

const Home = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("User");
  const [currentSlide, setCurrentSlide] = useState(0);
  const { t, language } = useApp();
  const h = t.home;
  const isHindi = language === "Hindi";

  // State for popup management
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem("username");
    if (storedName) {
      setUsername(storedName);
    }
  }, []);

  // Hero carousel images
  const heroImages = [
    fashion1,
    fashion2,
    fashion3,
    fashion4,
    fashion5,
    fashion6,
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-container">
      {/* ✅ ONLY ONE HEADER - Using the Header Component */}
      <Header
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        isProfileOpen={isProfileOpen}
        setIsProfileOpen={setIsProfileOpen}
      />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-carousel">
          {heroImages.map((img, index) => (
            <div
              key={index}
              className={`hero-slide ${index === currentSlide ? "active" : ""}`}
            >
              <img src={img} alt={`Fashion ${index + 1}`} />
            </div>
          ))}
        </div>

        <div className="hero-overlay">
          <div className="hero-content">
            <h1>Hello, {username}</h1>
            <h2>Welcome to StyleU</h2>
            <p>Your Personal AI Fashion Stylist</p>

            <button
              className="suggestions-btn"
              onClick={() => navigate("/chatbot")}
            >
              Suggestions
            </button>
          </div>
        </div>
      </section>

      {/* Decorative Divider */}
      <div className="divider">
        <span className="divider-icon">✧ ✦ ✧</span>
      </div>

      {/* Feature Cards */}
      <section className="features-section">
        <div className="features-grid">
          <div className="feature-card">
            <img src={icon1} alt="Dress Icon" className="card-icon-img" />
            <h4>AI Outfit Recommendation</h4>
            <button onClick={() => navigate("/chatbot")}>Explore</button>
          </div>

          <div className="feature-card">
            <img src={icon2} alt="Trending Icon" className="card-icon-img" />
            <h4>Trending Fashion</h4>
            <button onClick={() => navigate("/trends")}>View Trends</button>
          </div>

          <div className="feature-card">
            <img src={icon3} alt="Saved Icon" className="card-icon-img" />
            <h4>Saved Looks</h4>
            <button onClick={() => navigate("/saved")}>View Saved</button>
          </div>
        </div>
      </section>

      {/* Tips of the Day */}
      <section className="tips-section">
        <div className="tip-card">
          <h3>Fashion Tip of the Day :</h3>
          <p>Mix patterns with neutrals for a bold yet balanced look!</p>
        </div>
      </section>

      {/* Category Slider */}
      <div className="category-section">
        <div className="category-slider">
          <div
            className="category-card"
            onClick={() => navigate("/category/casual")}
          >
            <img src={casualImg} alt="Casual" />
            <div className="category-overlay">Casual</div>
          </div>

          <div
            className="category-card"
            onClick={() => navigate("/category/party")}
          >
            <img src={partyImg} alt="Party" />
            <div className="category-overlay">Party Wear</div>
          </div>

          <div
            className="category-card"
            onClick={() => navigate("/category/office")}
          >
            <img src={officeImg} alt="Office" />
            <div className="category-overlay">Office Wear</div>
          </div>

          <div
            className="category-card"
            onClick={() => navigate("/category/traditional")}
          >
            <img src={traditionalImg} alt="Traditional" />
            <div className="category-overlay">Traditional</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <h3>StyleU</h3>
            <p>Your Personal AI Fashion Stylist</p>
          </div>

          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li onClick={() => navigate("/")}>Home</li>
              <li onClick={() => navigate("/chatbot")}>Chatbot</li>
              <li onClick={() => navigate("/profile")}>Profile</li>
              <li onClick={() => navigate("/saved")}>Saved Looks</li>
            </ul>
          </div>

          <div className="footer-support">
            <h4>Support</h4>
            <ul>
              <li>Help</li>
              <li>Feedback</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 StyleU. All rights reserved.</p>
        </div>
      </footer>

      {/* Popup */}
      <Popup
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        isProfileOpen={isProfileOpen}
        setIsProfileOpen={setIsProfileOpen}
      />
    </div>
  );
};

export default Home;
