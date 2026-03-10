require("dotenv").config();

const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const cloudinary = require("./cloudinary");
const { db } = require("./firebaseAdmin");

console.log("Loaded Key:", process.env.OPENAI_API_KEY);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
// GET USER PROFILE
// ─────────────────────────────────────────
app.get("/get-profile/:uid", async (req, res) => {
  const { uid } = req.params;
  if (!uid)
    return res.status(400).json({ success: false, message: "UID is required" });

  try {
    const userDoc = await db.collection("users").doc(uid).get();
    if (!userDoc.exists)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

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
// CHAT WITH AI STYLIST
// ─────────────────────────────────────────
app.post("/chat", async (req, res) => {
  const { message, profile, conversationHistory, isPublic } = req.body;

  if (!message || !profile) {
    return res
      .status(400)
      .json({ success: false, message: "Message and profile are required." });
  }

  try {
    const systemPrompt = `
You are Style-U, a friendly AI fashion stylist assistant.

User profile:
- Name: ${profile.fullName}
- Gender: ${profile.gender}
- Body Type: ${profile.bodyType}
- Skin Tone: ${profile.skinTone}
- Height: ${profile.height}
- Age: ${profile.age}

CRITICAL RULES:

1. Your ONLY job is to detect the occasion and optionally capture specific clothing details.

2. Once you understand the occasion, respond with ONLY this JSON — nothing else:
{"ready": true, "occasion": "detected occasion", "specificDescription": "exact clothing details if user mentioned specific items, else empty string"}

3. Be DECISIVE. These words = immediate JSON response:
   casual, party, office, wedding, college, date, festival, beach, formal, brunch, dinner, 
   work, gathering, hangout, function, outing, trip, interview, meeting, celebration, traditional

4. If user describes specific clothes (e.g. "red top with blue jeans", "black dress with heels") 
   — treat as casual AND capture their description in specificDescription field.

5. Only ask ONE follow-up question if the message has absolutely zero context.

6. NEVER ask more than one follow-up. If user replied even once, generate the outfit.

7. Return PURE JSON only — no surrounding text, no explanation.

8. NEVER describe the outfit in text. Always return JSON when occasion is known.
`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...(conversationHistory || []),
      { role: "user", content: message },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 150,
    });

    const reply = completion.choices[0].message.content.trim();

    // Extract JSON even if GPT adds text around it
    const jsonMatch = reply.match(/\{[\s\S]*"ready"\s*:\s*true[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.ready && parsed.occasion) {
          const hasSpecificDescription =
            parsed.specificDescription &&
            parsed.specificDescription.trim().length > 0;

          const outfitResult = await generateOutfit(
            profile.gender,
            profile.bodyType,
            profile.skinTone,
            parsed.occasion,
            isPublic !== undefined ? isPublic : true,
            hasSpecificDescription ? parsed.specificDescription : null,
          );

          return res.json({
            success: true,
            type: "outfit",
            occasion: parsed.occasion,
            outfit: outfitResult.outfit,
            source: outfitResult.source,
          });
        }
      } catch (e) {}
    }

    // Clean reply — remove any leaked JSON
    const cleanReply = reply.replace(/\{[\s\S]*?\}/g, "").trim();

    return res.json({
      success: true,
      type: "message",
      reply:
        cleanReply || "Could you tell me what occasion you're dressing for?",
    });
  } catch (error) {
    console.error("❌ Chat error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// ─────────────────────────────────────────
// HELPER: GENERATE OR FETCH OUTFIT
// ─────────────────────────────────────────
async function generateOutfit(
  gender,
  bodyType,
  skinTone,
  occasion,
  isPublic = true,
  specificDescription = null,
) {
  // Only check DB for generic requests (no specific description)
  if (!specificDescription) {
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
  }

  console.log(
    "🎨 Generating new outfit with AI...",
    specificDescription ? "(custom description)" : "",
  );

  // Build prompt — use user's specific description if provided
  const prompt = specificDescription
    ? `
A full-body professional fashion photo of a ${gender} model with ${bodyType} body type and ${skinTone} skin tone.
The model is wearing exactly: ${specificDescription}.
Full body visible from head to toe — head, torso, legs, and feet all in frame.
No cropping. Entire body shown.
Standing straight, centered in frame.
Clean white studio background.
Professional fashion photography, sharp focus, high quality.
`
    : `
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
    isPublic,
    createdAt: new Date(),
  };

  // Save ALL outfits to DB — including custom descriptions for Trending
  const docRef = await db.collection("outfits").add({
    ...newOutfit,
    ...(specificDescription && { customDescription: specificDescription }),
  });

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
    const result = await generateOutfit(
      gender,
      bodyType,
      skinTone,
      occasion,
      true,
    );
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

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🔥 API server running on http://localhost:${PORT}`);
});
