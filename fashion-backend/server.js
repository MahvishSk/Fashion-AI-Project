require("dotenv").config({ path: __dirname + "/.env" });

const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const cloudinary = require("./cloudinary");
const { db } = require("./firebaseAdmin");

console.log("OpenAI API key loaded:", !!process.env.OPENAI_API_KEY);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const app = express();
app.use(cors());
app.use(express.json());

// ─────────────────────────────────────────
// OCCASION NORMALIZER
// ─────────────────────────────────────────
const occasionNormalizer = {
  // casual
  casual: "casual", hangout: "casual", outing: "casual", trip: "casual",
  picnic: "casual", everyday: "casual", normal: "casual", regular: "casual",
  college: "casual", school: "casual", university: "casual", class: "casual",
  campus: "casual", study: "casual",

  // party
  party: "party", birthday: "party", celebration: "party", anniversary: "party",
  engagement: "party", reception: "party", prom: "party", concert: "party",
  club: "party", "night out": "party",

  // office
  office: "office", work: "office", meeting: "office", interview: "office",
  formal: "office", business: "office", corporate: "office", professional: "office",
  conference: "office",

  // wedding
  wedding: "wedding", bridal: "wedding", "wedding guest": "wedding",
  nikah: "wedding", shaadi: "wedding",

  // festival
  festival: "festival", ethnic: "festival", traditional: "festival",
  diwali: "festival", eid: "festival", holi: "festival", navratri: "festival",
  puja: "festival", kurta: "festival", saree: "festival", lehenga: "festival",
  "indo-western": "festival",

  // date night
  "date night": "date night", date: "date night", dinner: "date night",
  romantic: "date night", brunch: "date night",
};

function normalizeOccasion(raw) {
  if (!raw) return "casual";
  const lower = raw.toLowerCase().trim();
  // exact match first
  if (occasionNormalizer[lower]) return occasionNormalizer[lower];
  // partial match
  for (const [key, value] of Object.entries(occasionNormalizer)) {
    if (lower.includes(key)) return value;
  }
  return "casual"; // fallback
}

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
      return res.status(404).json({ success: false, message: "User not found" });

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
// SAVE TO TRENDING (called from frontend)
// ─────────────────────────────────────────
app.post("/save-to-trending", async (req, res) => {
  const { outfitId, imageUrl, occasion, gender, bodyType, skinTone } = req.body;

  if (!outfitId && !imageUrl) {
    return res.status(400).json({ success: false, message: "outfitId or imageUrl required" });
  }

  try {
    const normalizedOccasion = normalizeOccasion(occasion);

    if (outfitId) {
      // Update existing outfit doc to be public
      await db.collection("outfits").doc(outfitId).update({
        isPublic: true,
        occasion: normalizedOccasion,
      });
    } else {
      // Fallback: save new doc if no outfitId
      await db.collection("outfits").add({
        imageUrl,
        occasion: normalizedOccasion,
        gender: gender || "",
        bodyType: bodyType || "",
        skinTone: skinTone || "",
        isPublic: true,
        createdAt: new Date(),
      });
    }

    console.log(`✅ Outfit shared to trending as occasion: ${normalizedOccasion}`);
    return res.json({ success: true, occasion: normalizedOccasion });
  } catch (error) {
    console.error("❌ Save to trending error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// ─────────────────────────────────────────
// CHAT WITH AI STYLIST
// ─────────────────────────────────────────
app.post("/chat", async (req, res) => {
  const { message, profile, conversationHistory } = req.body;
  // NOTE: isPublic removed from here — we handle it separately now

  if (!message || !profile) {
    return res.status(400).json({ success: false, message: "Message and profile are required." });
  }

  try {
    const systemPrompt = `
You are StyleU, a warm and friendly AI fashion stylist assistant.

User profile:
- Name: ${profile.fullName}
- Gender: ${profile.gender}
- Body Type: ${profile.bodyType}
- Skin Tone: ${profile.skinTone}
- Height: ${profile.height}
- Age: ${profile.age}

CRITICAL RULES:

1. Your ONLY job is fashion styling. Detect the occasion and generate an outfit.

2. Once you understand the occasion, respond with ONLY this JSON — nothing else:
{"ready": true, "occasion": "detected occasion", "specificDescription": "exact clothing details if user mentioned specific items, else empty string"}

3. Be DECISIVE. These words = immediate JSON response:
   casual, party, office, wedding, college, date, festival, beach, formal, brunch, dinner,
   work, gathering, hangout, function, outing, trip, interview, meeting, celebration, traditional,
   ethnic, kurta, saree, lehenga, indo-western, salwar, dupatta, kurti, blazer, suit, gown, prom,
   picnic, concert, gym, sports, yoga, night out, club, birthday, anniversary, engagement, reception

4. If user describes specific clothes (e.g. "red top with blue jeans", "black dress with heels")
   — treat as casual AND capture their description in specificDescription field.

5. Only ask ONE follow-up question if the message has absolutely zero fashion context.

6. NEVER ask more than one follow-up. If user replied even once, generate the outfit.

7. Return PURE JSON only — no surrounding text, no explanation when occasion is known.

8. NEVER describe the outfit in text. Always return JSON when occasion is known.

9. If user asks something completely unrelated to fashion (e.g. math, news, coding, science, sports scores),
   reply warmly but redirect. Example:
   "Haha I can't understand you!😄 I'm StyleU — your personal fashion stylist!👗✨ I'm only good at making you look amazing. What occasion are you dressing for today?"

10. If user says thank you, nice, great, awesome, or gives any compliment — respond warmly and prompt next look.
    Example: "So glad you loved it!💕✨ Ready to style your next look? Just tell me the occasion!"

11. If user asks what you can do or who you are — introduce yourself nicely:
    "I'm StyleU, your personal AI fashion stylist!👗✨ Just tell me the occasion — wedding, party, office, college, date night — and I'll put together the perfect outfit for you based on your style profile!"
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

    const jsonMatch = reply.match(/\{[\s\S]*"ready"\s*:\s*true[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.ready && parsed.occasion) {
          const hasSpecificDescription =
            parsed.specificDescription &&
            parsed.specificDescription.trim().length > 0;

          const normalizedOccasion = normalizeOccasion(parsed.occasion);

          const outfitResult = await generateOutfit(
            profile.gender,
            profile.bodyType,
            profile.skinTone,
            normalizedOccasion,
            hasSpecificDescription ? parsed.specificDescription : null,
          );

          return res.json({
            success: true,
            type: "outfit",
            occasion: normalizedOccasion,   // always send normalized
            outfit: outfitResult.outfit,
            source: outfitResult.source,
          });
        }
      } catch (e) {}
    }

    const cleanReply = reply.replace(/\{[\s\S]*?\}/g, "").trim();

    return res.json({
      success: true,
      type: "message",
      reply:
        cleanReply ||
        "I'm here to style you!👗✨ Just tell me the occasion — wedding, party, college, office, or anything else!",
    });
  } catch (error) {
    console.error("❌ Chat error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// ─────────────────────────────────────────
// HELPER: GENERATE OR FETCH OUTFIT
// isPublic is always FALSE now — sharing is done separately
// ─────────────────────────────────────────
async function generateOutfit(
  gender,
  bodyType,
  skinTone,
  occasion,
  specificDescription = null,
) {
  // Only check DB for generic requests
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

  console.log("🎨 Generating new outfit with AI...");

  const prompt = specificDescription
    ? `A full-body professional fashion photo of a ${gender} model with ${bodyType} body type and ${skinTone} skin tone.
The model is wearing exactly: ${specificDescription}.
Full body visible from head to toe. No cropping. Standing straight, centered in frame.
Clean white studio background. Professional fashion photography, sharp focus, high quality.`
    : `A full-body fashion photo of a ${gender} model with ${bodyType} body type and ${skinTone} skin tone.
Wearing a complete ${occasion} outfit from head to toe.
Full body visible. No cropping. Standing straight, centered in frame.
Clean white studio background. Professional fashion photography. Sharp focus, high quality.`;

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

  const newOutfit = {
    gender,
    bodyType,
    skinTone,
    occasion,
    imageUrl,
    isPublic: false,   // ← NEVER auto-public, user decides
    createdAt: new Date(),
  };

  const docRef = await db.collection("outfits").add({
    ...newOutfit,
    ...(specificDescription && { customDescription: specificDescription }),
  });

  console.log("💾 Outfit saved (private) with ID:", docRef.id);
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
    const result = await generateOutfit(gender, bodyType, skinTone, occasion, null);
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