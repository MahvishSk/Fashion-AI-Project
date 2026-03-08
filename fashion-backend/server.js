require("dotenv").config();

const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

// Cloudinary
const cloudinary = require("./cloudinary");

// Firebase
const { db } = require("./firebaseAdmin");

console.log("Loaded Key:", process.env.OPENAI_API_KEY);

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
app.use(cors());
app.use(express.json());

// ─────────────────────────────────────────
// TEST ROUTES
// ─────────────────────────────────────────

app.get("/test-firebase", async (req, res) => {
  res.json({ message: "Firebase connected successfully" });
});

app.get("/", (req, res) => {
  res.send("Fashion Outfit API is running ✅");
});

// ─────────────────────────────────────────
// NEW ROUTE: GET USER PROFILE FROM FIREBASE
// ─────────────────────────────────────────

app.get("/get-profile/:uid", async (req, res) => {
  const { uid } = req.params;

  if (!uid) {
    return res.status(400).json({ success: false, message: "UID is required" });
  }

  try {
    const userDoc = await db.collection("users").doc(uid).get();

    if (!userDoc.exists) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const userData = userDoc.data();

    return res.json({
      success: true,
      profile: {
        fullName: userData.fullName || "",
        gender: userData.gender || "",
        bodyType: userData.body_type || "",
        skinTone: userData.skin_tone || "",
        height: userData.height || "",
        weight: userData.weight || "",
        age: userData.age || "",
      },
    });
  } catch (error) {
    console.error("❌ Error fetching profile:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// ─────────────────────────────────────────
// NEW ROUTE: CHAT WITH AI STYLIST
// ─────────────────────────────────────────

app.post("/chat", async (req, res) => {
  const { message, profile, conversationHistory } = req.body;

  if (!message || !profile) {
    return res
      .status(400)
      .json({ success: false, message: "Message and profile are required." });
  }

  try {
    // Build conversation for GPT
    const systemPrompt = `
You are Style-U, a warm and friendly AI fashion stylist assistant.

You already know the user's profile:
- Name: ${profile.fullName}
- Gender: ${profile.gender}
- Body Type: ${profile.bodyType}
- Skin Tone: ${profile.skinTone}
- Height: ${profile.height}
- Age: ${profile.age}

Your job is to understand what occasion or outfit the user wants.
Once you clearly understand the occasion (e.g. wedding, party, office, casual, date night etc.), 
respond with ONLY this exact JSON format and nothing else:

{
  "ready": true,
  "occasion": "the detected occasion"
}

If the user's message is unclear or you need more info, respond naturally as a friendly stylist 
in plain text (NOT JSON). Keep responses short and warm.

Examples of ready occasions: wedding, party, office, casual, college, date night, festival, beach, formal dinner.
`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...(conversationHistory || []),
      { role: "user", content: message },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 200,
    });

    const reply = completion.choices[0].message.content.trim();

    // Check if GPT detected the occasion and is ready
    try {
      const parsed = JSON.parse(reply);

      if (parsed.ready && parsed.occasion) {
        // Trigger outfit generation
        const outfitResult = await generateOutfit(
          profile.gender,
          profile.bodyType,
          profile.skinTone,
          parsed.occasion,
        );

        return res.json({
          success: true,
          type: "outfit",
          occasion: parsed.occasion,
          outfit: outfitResult.outfit,
          source: outfitResult.source,
        });
      }
    } catch (e) {
      // Not JSON — GPT is still asking questions, return text reply
    }

    return res.json({
      success: true,
      type: "message",
      reply,
    });
  } catch (error) {
    console.error("❌ Chat error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// ─────────────────────────────────────────
// HELPER: GENERATE OR FETCH OUTFIT
// ─────────────────────────────────────────

async function generateOutfit(gender, bodyType, skinTone, occasion) {
  // Check database first
  const snapshot = await db
    .collection("outfits")
    .where("gender", "==", gender)
    .where("bodyType", "==", bodyType)
    .where("skinTone", "==", skinTone)
    .where("occasion", "==", occasion)
    .limit(1)
    .get();

  if (!snapshot.empty) {
    const outfitData = snapshot.docs[0].data();
    console.log("✅ Returning outfit from database");
    return {
      source: "database",
      outfit: { id: snapshot.docs[0].id, ...outfitData },
    };
  }

  console.log("🎨 Generating new outfit with AI...");

  // Generate with AI
  const prompt = `
A full-body fashion photo of a ${gender} model with ${bodyType} body type and ${skinTone} skin tone.
Wearing a complete ${occasion} outfit from head to toe.
Full body visible: head, torso, legs, and feet all in frame.
No cropping. Entire body shown.
Standing straight, centered in frame.
Clean white studio background.
Professional fashion photography.
Sharp focus, high quality.
`;

  const result = await openai.images.generate({
    model: "gpt-image-1-mini",
    prompt,
    size: "1024x1024",
    n: 1,
  });

  const base64Image = result.data[0].b64_json;

  // Upload to Cloudinary
  const uploadResult = await cloudinary.uploader.upload(
    `data:image/png;base64,${base64Image}`,
    { folder: "styleu-outfits" },
  );

  const imageUrl = uploadResult.secure_url;

  const stylingTips = [
    "Choose comfortable breathable fabrics.",
    "Match colors according to your skin tone.",
    "Keep accessories minimal for balance.",
    "Wear well-fitted clothing for better proportions.",
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
  console.log("💾 Outfit saved with ID:", docRef.id);

  return { source: "ai-generated", outfit: { id: docRef.id, ...newOutfit } };
}

// ─────────────────────────────────────────
// ORIGINAL ROUTE (KEPT FOR COMPATIBILITY)
// ─────────────────────────────────────────

app.post("/recommend-outfit", async (req, res) => {
  const { gender, bodyType, skinTone, occasion } = req.body;

  if (!gender || !bodyType || !skinTone || !occasion) {
    return res.status(400).json({
      success: false,
      message: "Please send gender, bodyType, skinTone and occasion.",
    });
  }

  try {
    const result = await generateOutfit(gender, bodyType, skinTone, occasion);

    return res.json({
      success: true,
      source: result.source,
      outfit: result.outfit,
      outfits: [result.outfit],
    });
  } catch (error) {
    console.error("❌ Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// ─────────────────────────────────────────

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🔥 API server running on http://localhost:${PORT}`);
});
