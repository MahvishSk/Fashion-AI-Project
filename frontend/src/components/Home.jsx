import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import logo from "../assets/logo1.png";
import icon1 from "../assets/dress.png";
import icon2 from "../assets/trending.png";
import icon3 from "../assets/saved.png";
import fashion1 from "../assets/Fashionimg1.jpg";
import fashion2 from "../assets/Fashionimg2.jpg";
import fashion3 from "../assets/Fashionimg3.jpg";
import fashion4 from "../assets/Fashionimg4.jpg";
import fashion5 from "../assets/Fashionimg5.jpg";
import fashion6 from "../assets/Fashionimg6.jpg";
import "../styles/Home.css";
import Popup from "./Popup";
import Header from "../components/Header";
import PromoPopup from "./PromoPopup";

// Fashion Tips
const fashionTips = [
  "Mix patterns with neutrals for a bold yet balanced look!",
  "Invest in classic pieces — a white shirt and well-fitted jeans never go out of style.",
  "Accessorize wisely — one statement piece is better than wearing everything at once.",
  "Dress for your body type, not just the trend.",
  "Colors close to your skin tone in the upper body make your face glow.",
  "A well-fitted outfit always looks better than an expensive ill-fitted one.",
  "Layer smartly — a denim jacket or blazer can transform any basic outfit.",
  "Shoes can make or break an outfit — always keep them clean!",
  "Neutral tones are your best friends for mixing and matching.",
  "Confidence is the best accessory — wear what makes you feel amazing!",
];

const Home = ({ onLogout }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("User");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [todayTip, setTodayTip] = useState("");

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem("username");
    if (storedName) setUsername(storedName);

    const randomTip =
      fashionTips[Math.floor(Math.random() * fashionTips.length)];
    setTodayTip(randomTip);
  }, []);

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
    <>
      {/* ✅ Popup OUTSIDE container */}
      <PromoPopup />

      <div className="home-container">
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
                className="stylist-btn"
                onClick={() => navigate("/chatbot")}
              >
                Your Stylist
              </button>
            </div>
          </div>
        </section>

        <div className="divider">
          <span className="divider-icon">✧ ✦ ✧</span>
        </div>

        {/* Features */}
        <section className="features-section">
          <div className="features-grid">
            <div className="feature-card">
              <img src={icon1} alt="" className="card-icon-img" />
              <h4>AI Outfit Recommendation</h4>
              <button onClick={() => navigate("/chatbot")}>Explore</button>
            </div>

            <div className="feature-card">
              <img src={icon2} alt="" className="card-icon-img" />
              <h4>Trending Fashion</h4>
              <button onClick={() => navigate("/trends")}>View Trends</button>
            </div>

            <div className="feature-card">
              <img src={icon3} alt="" className="card-icon-img" />
              <h4>Saved Looks</h4>
              <button onClick={() => navigate("/saved")}>View Saved</button>
            </div>
          </div>
        </section>

        {/* Tip */}
        <section className="tips-section">
          <div className="tip-card">
            <h3>Fashion Tip for You :</h3>
            <p>{todayTip}</p>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-content">
            <div>
              <h3>StyleU</h3>
              <p>Your Personal AI Fashion Stylist</p>
            </div>
          </div>
          <p>© 2026 StyleU. All rights reserved.</p>
        </footer>

        <Popup
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          isProfileOpen={isProfileOpen}
          setIsProfileOpen={setIsProfileOpen}
        />
      </div>
    </>
  );
};

export default Home;