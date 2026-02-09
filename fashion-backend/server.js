require("dotenv").config();
console.log("Loaded Key:", process.env.OPENAI_API_KEY);


const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const OpenAI = require("openai");

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Load Firebase service account
const serviceAccount = require("./serviceAccountKey.json");

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket:"fashion-ai-project-b9c86.firebasestorage.app", // 🔥 change if needed
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

const app = express();
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Fashion Outfit API is running ✅");
});

// MAIN ROUTE
app.post("/recommend-outfit", async (req, res) => {
  const { gender, bodyType, skinTone, occasion } = req.body;

  if (!gender || !bodyType || !skinTone || !occasion) {
    return res.status(400).json({
      success: false,
      message: "Please send gender, bodyType, skinTone and occasion.",
    });
  }

  try {
    const query = db.collection("outfits")
      .where("gender", "==", gender)
      .where("bodyType", "==", bodyType)
      .where("skinTone", "==", skinTone)
      .where("occasion", "==", occasion);

    const snapshot = await query.get();

    // ✅ IF OUTFIT EXISTS (FAST PATH)
    if (!snapshot.empty) {
      const outfits = [];
      snapshot.forEach((doc) => {
        outfits.push({ id: doc.id, ...doc.data() });
      });

      return res.json({
        success: true,
        source: "database",
        outfits,
      });
    }

    // 🔥 IF NOT EXISTS → GENERATE IMAGE

    const prompt = `
A realistic full-body fashion photograph of a ${gender} model with ${bodyType} body type and ${skinTone} skin tone wearing a stylish ${occasion} outfit.

Professional fashion photography, natural lighting, sharp focus, high detail fabric texture, clean minimal background, no distortion, no extra limbs.
`;

    const result = await openai.images.generate({
      model: "gpt-image-1",
      prompt: prompt,
      size: "1024x1024",
    });

    const base64Image = result.data[0].b64_json;
    const imageBuffer = Buffer.from(base64Image, "base64");

    const fileName = `outfits/${gender}-${bodyType}-${skinTone}-${occasion}-${Date.now()}.png`;
    const file = bucket.file(fileName);

    await file.save(imageBuffer, {
      metadata: {
        contentType: "image/png",
      },
    });

    await file.makePublic();

    const imageUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

    const stylingTips = [
      "Choose comfortable breathable fabrics.",
      "Match colors according to your skin tone.",
      "Keep accessories minimal for balance.",
      "Wear well-fitted clothing for better proportions."
    ];

    const newOutfit = {
      gender,
      bodyType,
      skinTone,
      occasion,
      imageUrl,
      stylingTips,
      createdAt: new Date(),
    };

    const docRef = await db.collection("outfits").add(newOutfit);

    return res.json({
      success: true,
      source: "ai-generated",
      outfit: { id: docRef.id, ...newOutfit },
    });

  } catch (error) {
    console.error("❌ Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🔥 API server running on http://localhost:${PORT}`);
});
