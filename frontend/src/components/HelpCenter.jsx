import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ArrowLeft } from "lucide-react";
import Header from "./Header";
import Popup from "./Popup";
import "../styles/HelpCenter.css";

const FAQS = [
  {
    category: "Account & Profile",
    questions: [
      {
        q: "How do I create a StyleU account?",
        a: "Users can sign up by entering their email address and creating a password. After signing up, they can set up their profile by adding body details and preferences.",
      },
      {
        q: "How can I update my profile information?",
        a: "You can update your personal details such as height, body type, and style preferences from the Profile section in the settings.",
      },
      {
        q: "I forgot my password. How can I reset it?",
        a: "Click on Forgot Password on the login page and follow the instructions sent to your registered email.",
      },
    ],
  },
  {
    category: "AI Stylist & Recommendations",
    questions: [
      {
        q: "How does the AI stylist work?",
        a: "The AI stylist analyzes your profile information and preferences to recommend outfits that suit your body type, style, and occasion.",
      },
      {
        q: "What kind of outfit recommendations can I get?",
        a: "StyleU provides outfit ideas for different occasions such as casual wear, office wear, parties, and traditional events.",
      },
      {
        q: "Can I see how an outfit will look on me?",
        a: "Yes, StyleU can generate visual outfit suggestions based on your input and preferences.",
      },
      {
        q: "Can I customize or regenerate outfit suggestions?",
        a: "Yes, you can regenerate recommendations or adjust your preferences to get different outfit suggestions tailored to your style.",
      },
      {
        q: "Can I tell the AI my preferred colors or style?",
        a: "Yes, you can mention color preferences and style choices in your profile or directly while chatting with the AI stylist.",
      },
    ],
  },
  {
    category: "Explore & Trending Styles",
    questions: [
      {
        q: "What are Trending Looks?",
        a: "Trending Looks showcase popular fashion styles shared by the community or recommended by the system.",
      },
      {
        q: "How often are Trending Looks updated?",
        a: "Trending Looks are updated regularly to reflect the latest fashion styles and seasonal trends, so you always have fresh inspiration to explore.",
      },
    ],
  },
  {
    category: "Saved Looks",
    questions: [
      {
        q: "How can I save outfit recommendations?",
        a: "You can save any outfit suggestion by clicking the Save option, which will store it in your Saved Looks section.",
      },
      {
        q: "Where can I view my saved outfits?",
        a: "All saved outfits can be accessed from the Saved Looks page in the app.",
      },
      {
        q: "Can I remove a saved outfit?",
        a: "Yes, go to your Saved Looks page and click the Remove button on any outfit card to delete it.",
      },
      {
        q: "Can I download my saved outfits?",
        a: "Yes, each saved outfit has a Download button so you can save the image to your device.",
      },
    ],
  },
  {
    category: "General Usage",
    questions: [
      {
        q: "Is StyleU free to use?",
        a: "Yes, StyleU provides outfit recommendations and styling assistance for free.",
      },
      {
        q: "What devices can I use StyleU on?",
        a: "StyleU can be accessed on desktop, tablet, and mobile devices through a web browser.",
      },
      {
        q: "Does StyleU have a dark mode?",
        a: "Yes! StyleU has a built-in dark mode option. You can switch between light and dark theme from the settings.",
      },
      {
        q: "Is my personal data safe on StyleU?",
        a: "Yes, your profile information is kept private and is only used to generate personalized outfit recommendations.",
      },
      {
        q: "Why am I not seeing outfit recommendations?",
        a: "Make sure your profile details are completed, as the system uses this information to generate personalized suggestions.",
      },
      {
        q: "Does StyleU work without completing my profile?",
        a: "Basic features are available, but for accurate outfit recommendations, completing your profile with body details and style preferences is strongly recommended.",
      },
    ],
  },
  {
    category: "Support",
    questions: [
      {
        q: "How can I contact support if I need help?",
        a: "You can reach our support team through the Contact Us section in the settings page.",
      },
    ],
  },
];

const HelpCenter = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="help-container">
      <Header
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        isProfileOpen={isProfileOpen}
        setIsProfileOpen={setIsProfileOpen}
      />

      <div className="help-page">
        {/* PAGE TITLE */}
        <div className="help-title-section">
          <h1 className="help-title">Help Center</h1>
          <p className="help-subtitle">
            We've got answers for your burning questions!
          </p>
        </div>

        <div className="divider">
          <span className="divider-icon">✧ ✦ ✧</span>
        </div>

        {/* FAQ ACCORDION */}
        <div className="faq-container">
          {FAQS.map((category, catIndex) => (
            <div key={catIndex} className="faq-category">
              <h2 className="faq-category-title">{category.category}</h2>
              {category.questions.map((faq, qIndex) => {
                const index = catIndex * 10 + qIndex;
                return (
                  <div key={index} className="faq-item">
                    <button
                      className={`faq-question ${activeIndex === index ? "active" : ""}`}
                      onClick={() => toggleFAQ(index)}
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        size={20}
                        className={`faq-icon ${activeIndex === index ? "rotate" : ""}`}
                      />
                    </button>
                    <div
                      className={`faq-answer ${activeIndex === index ? "active" : ""}`}
                    >
                      {faq.a}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* BACK BUTTON */}
        <div className="help-back">
          <button className="back-setting-btn" onClick={() => navigate("/settings")}>
            <ArrowLeft size={16} /> Back to Setting
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

export default HelpCenter;