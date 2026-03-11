import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Send, ChevronDown, ArrowRight } from "lucide-react";
import Header from "./Header";
import Popup from "./Popup";
import "../styles/ContactUs.css";

const ContactUs = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Email dropdown (Admin emails)
  const [emailOpen, setEmailOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState({
    email: "mehvish.sk0805@gmail.com",
    label: "General Support",
  });

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitSuccess, setSubmitSuccess] = useState(false);

  const emailOptions = [
    { email: "mehvish.sk0805@gmail.com", label: "General Support" },
    { email: "aaframalgundkar@gmail.com", label: "Help & Queries" },
    { email: "aymankhann777@gmail.com", label: "Feedback & Suggestions" },
  ];

  const handleEmailSelect = (email) => {
    setSelectedEmail(email);
    setEmailOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.email || !formData.email.includes("@")) {
      alert("Please enter a valid email address");
      return;
    }

    const subject = `Contact Form - ${formData.name}`;
    const body = `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`;
    const mailtoLink = `mailto:${selectedEmail.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoLink;

    setSubmitSuccess(true);
    setFormData({ name: "", email: "", message: "" });
    setTimeout(() => setSubmitSuccess(false), 5000);
  };

  return (
    <div className="contact-page">
      <Header
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        isProfileOpen={isProfileOpen}
        setIsProfileOpen={setIsProfileOpen}
      />

      <div className="contact-container">
        {/* PAGE TITLE */}
        <div className="contact-title-section">
          <h1 className="contact-title">Contact Us</h1>
          <p className="contact-subtitle">We'd love to hear from you!</p>
        </div>

        <div className="divider">
          <span className="divider-icon">✧ ✦ ✧</span>
        </div>

        {/* SINGLE CENTERED CARD */}
        <div className="contact-card">
          <h2 className="card-title">Send Us a Message</h2>

          {/* Admin Email Dropdown */}
          <div className="contact-field">
            <label>Email Us (Admin)</label>
            <div className="dropdown-wrapper">
              <button
                className="dropdown-btn"
                onClick={() => setEmailOpen(!emailOpen)}
              >
                <Mail size={18} />
                <span className="dropdown-text">{selectedEmail.email}</span>
                <ChevronDown
                  size={18}
                  className={`dropdown-arrow ${emailOpen ? "rotate" : ""}`}
                />
              </button>
              {emailOpen && (
                <div className="dropdown-menu">
                  {emailOptions.map((email, index) => (
                    <button
                      key={index}
                      className="dropdown-item"
                      onClick={() => handleEmailSelect(email)}
                    >
                      <Mail size={16} />
                      <span>{email.email}</span>
                      <small>{email.label}</small>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Form */}
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Your Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="form-group">
              <label>Your Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label>Your Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Write your message here..."
                rows="5"
                required
              />
            </div>

            <button type="submit" className="submit-btn">
              <Send size={18} /> Send Message
            </button>
          </form>

          {/* Success Message */}
          {submitSuccess && (
            <div className="success-message">
              ✓ Message sent successfully! We'll get back to you soon.
            </div>
          )}
        </div>

        {/* BOTTOM BAR - Help Center */}
        <div className="help-bar">
          <div className="help-bar-text">
          <p>Need more help?</p>
          <p>Visit our Help Center</p>
          </div>
          <button className="help-btn" onClick={() => navigate("/help")}>
            Go to Help Center
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      <Popup
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        isProfileOpen={isProfileOpen}
        setIsProfileOpen={setIsProfileOpen}
      />
    </div>
  );
};

export default ContactUs;