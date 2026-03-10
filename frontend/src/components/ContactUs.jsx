import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, Mail, Send, ChevronDown, ArrowRight } from "lucide-react";
import Header from "./Header";
import Popup from "./Popup";
import "../styles/ContactUs.css";

const ContactUs = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Phone dropdown
  const [phoneOpen, setPhoneOpen] = useState(false);
  const [selectedPhone, setSelectedPhone] = useState({
    number: "+1 (234) 567-890",
    label: "Main Support",
  });

  // Email dropdown (Admin emails)
  const [emailOpen, setEmailOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState({
    email: "support@styleu.com",
    label: "General Support",
  });

  // Form state (User's info)
  const [formData, setFormData] = useState({
    name: "",
    email: "", // User's own email
    message: "",
  });

  const [submitSuccess, setSubmitSuccess] = useState(false);

  const phoneOptions = [
    { number: "+91 8693893798", label: "Main Support" },
    { number: "+1 (234) 567-891", label: "Urgent / Priority Support" },
  ];

  const emailOptions = [
    { email: "mahvishshaikh246@gmail.com", label: "General Support" },
    { email: "help@styleu.com", label: "Help & Queries" },
    { email: "feedback@styleu.com", label: "Feedback & Suggestions" },
  ];

  const handlePhoneSelect = (phone) => {
    setSelectedPhone(phone);
    setPhoneOpen(false);
  };

  const handleEmailSelect = (email) => {
    setSelectedEmail(email);
    setEmailOpen(false);
    // ✅ Do NOT auto-fill user email - let user type their own
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate user email
    if (!formData.email || !formData.email.includes("@")) {
      alert("Please enter a valid email address");
      return;
    }

    // Create mailto link
    const subject = `Contact Form - ${formData.name}`;
    const body = `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`;
    const mailtoLink = `mailto:${selectedEmail.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Open email client
    window.location.href = mailtoLink;

    // Show success message
    setSubmitSuccess(true);
    setFormData({ name: "", email: "", message: "" });
    setTimeout(() => setSubmitSuccess(false), 5000);
  };

  const handleCall = () => {
    // Open phone dialer
    window.location.href = `tel:${selectedPhone.number.replace(/\s/g, "")}`;
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

        {/* TWO COLUMN LAYOUT */}
        <div className="contact-grid">
          {/* LEFT CARD - Contact Info */}
          <div className="contact-card">
            <h2 className="card-title">Contact Information</h2>

            {/* Phone Dropdown */}
            <div className="contact-field">
              <label>Call Us</label>
              <div className="dropdown-wrapper">
                <button
                  className="dropdown-btn"
                  onClick={() => setPhoneOpen(!phoneOpen)}
                >
                  <Phone size={18} />
                  <span className="dropdown-text">
                    {selectedPhone.number}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`dropdown-arrow ${phoneOpen ? "rotate" : ""}`}
                  />
                </button>
                {phoneOpen && (
                  <div className="dropdown-menu">
                    {phoneOptions.map((phone, index) => (
                      <button
                        key={index}
                        className="dropdown-item"
                        onClick={() => handlePhoneSelect(phone)}
                      >
                        <Phone size={16} />
                        <span>{phone.number}</span>
                        <small>{phone.label}</small>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {/* Call Button */}
              <button className="call-btn" onClick={handleCall}>
                <Phone size={16} /> Call Now
              </button>
            </div>

            {/* Email Dropdown (Admin emails) */}
            <div className="contact-field">
              <label>Email Us (Admin)</label>
              <div className="dropdown-wrapper">
                <button
                  className="dropdown-btn"
                  onClick={() => setEmailOpen(!emailOpen)}
                >
                  <Mail size={18} />
                  <span className="dropdown-text">
                    {selectedEmail.email}
                  </span>
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
          </div>

          {/* RIGHT CARD - Message Form */}
          <div className="contact-card">
            <h2 className="card-title">Send Us a Message</h2>

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

              <button
                type="submit"
                className="submit-btn"
              >
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
        </div>

        {/* BOTTOM BAR - Help Center */}
        <div className="help-bar">
          <p>Need more help? Visit our Help Center</p>
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