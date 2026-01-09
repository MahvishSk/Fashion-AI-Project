import dotenv from "dotenv";
dotenv.config();
console.log(process.env.OPENAI_API_KEY ? "API KEY LOADED" : "NO KEY");

const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

// Load service account key
const serviceAccount = require("./serviceAccountKey.json");

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const app = express();
app.use(cors());
app.use(express.json());

// Simple test route
app.get("/", (req, res) => {
  res.send("Fashion Outfit API is running ✅");
});

// MAIN API: Recommend outfit
app.post("/recommend-outfit", async (req, res) => {
  const { gender, bodyType, skinTone, occasion } = req.body;

  if (!gender || !bodyType || !skinTone || !occasion) {
    return res.status(400).json({
      success: false,
      message: "Please send gender, bodyType, skinTone and occasion.",
    });
  }

  try {
    let query = db.collection("outfits")
      .where("gender", "==", gender)
      .where("bodyType", "==", bodyType)
      .where("skinTone", "==", skinTone)
      .where("occasion", "==", occasion);

    const snapshot = await query.get();

    if (snapshot.empty) {
      return res.status(404).json({
        success: false,
        message: "No matching outfits found.",
      });
    }

    const outfits = [];
    snapshot.forEach((doc) => {
      outfits.push({ id: doc.id, ...doc.data() });
    });

    res.json({
      success: true,
      outfits,
    });
  } catch (err) {
    console.error("❌ Error in /recommend-outfit:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🔥 API server running on http://localhost:${PORT}`);
});
