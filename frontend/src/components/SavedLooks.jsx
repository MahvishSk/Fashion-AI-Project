import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import Header from "./Header";
import "../styles/SavedLooks.css";

const SavedLooks = () => {
  const navigate = useNavigate();
  const [savedOutfits, setSavedOutfits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // ─────────────────────────────────────────
  // FETCH SAVED OUTFITS FROM FIREBASE
  // ─────────────────────────────────────────

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          navigate("/login");
          return;
        }

        const favRef = collection(db, "users", user.uid, "favourites");
        const snapshot = await getDocs(favRef);

        const outfits = [];
        snapshot.forEach((doc) => {
          outfits.push({ id: doc.id, ...doc.data() });
        });

        setSavedOutfits(outfits);
      } catch (error) {
        console.error("Error fetching saved outfits:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSaved();
  }, []);

  // ─────────────────────────────────────────
  // REMOVE FROM SAVED
  // ─────────────────────────────────────────

  const removeFavourite = async (outfitId) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      await deleteDoc(doc(db, "users", user.uid, "favourites", outfitId));
      setSavedOutfits((prev) => prev.filter((o) => o.id !== outfitId));
    } catch (error) {
      console.error("Error removing favourite:", error);
    }
  };

  // ─────────────────────────────────────────
  // DOWNLOAD IMAGE
  // ─────────────────────────────────────────

  const downloadOutfit = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `StyleU_Outfit_${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      window.open(imageUrl, "_blank");
    }
  };

  // ─────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────

  return (
    <div>
      <div className="home-container">
        <Header
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          isProfileOpen={isProfileOpen}
          setIsProfileOpen={setIsProfileOpen}
        />

        <div className="saved-page">
          {/* PAGE TITLE */}
          <div className="saved-title-section">
            <h1 className="saved-title">❤️ My Saved Looks</h1>
            <p className="saved-subtitle">
              Your personal collection of AI styled outfits
            </p>
          </div>

          <div className="divider">
            <span className="divider-icon">✧ ✦ ✧</span>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="saved-empty">
              <p>✨ Loading your saved looks...</p>
            </div>
          )}

          {/* EMPTY STATE */}
          {!loading && savedOutfits.length === 0 && (
            <div className="saved-empty">
              <div className="empty-icon">🤍</div>
              <h3>No Saved Looks Yet</h3>
              <p>Go to the chatbot and save your favourite outfits!</p>
              <button
                className="go-chatbot-btn"
                onClick={() => navigate("/chatbot")}
              >
                Get Outfit Recommendations
              </button>
            </div>
          )}

          {/* OUTFITS GRID */}
          {!loading && savedOutfits.length > 0 && (
            <>
              <p className="saved-count">
                {savedOutfits.length} outfit{savedOutfits.length > 1 ? "s" : ""}{" "}
                saved
              </p>

              <div className="saved-grid">
                {savedOutfits.map((outfit) => (
                  <div key={outfit.id} className="saved-card">
                    {/* IMAGE */}
                    <div className="saved-image-wrapper">
                      <img
                        src={outfit.imageUrl}
                        alt="Saved Outfit"
                        className="saved-image"
                        onClick={() => setSelectedImage(outfit.imageUrl)}
                      />
                      <div className="saved-badge">❤️ Saved</div>
                    </div>

                    {/* OUTFIT INFO */}
                    <div className="saved-info">
                      {outfit.gender && (
                        <span className="saved-tag">👤 {outfit.gender}</span>
                      )}
                      {outfit.bodyType && (
                        <span className="saved-tag">📐 {outfit.bodyType}</span>
                      )}
                      {outfit.skinTone && (
                        <span className="saved-tag">🎨 {outfit.skinTone}</span>
                      )}
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="saved-actions">
                      <button
                        className="saved-action-btn download-btn"
                        onClick={() => downloadOutfit(outfit.imageUrl)}
                      >
                        ⬇️ Download
                      </button>

                      <button
                        className="saved-action-btn remove-btn"
                        onClick={() => removeFavourite(outfit.id)}
                      >
                        🗑 Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* BACK BUTTON */}
          <div className="saved-back">
            <button className="back-home-btn" onClick={() => navigate("/home")}>
              ← Back to Home
            </button>
          </div>
        </div>

        {/* FULLSCREEN IMAGE MODAL */}
        {selectedImage && (
          <div className="image-modal" onClick={() => setSelectedImage(null)}>
            <img src={selectedImage} alt="Full View" />
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedLooks;
