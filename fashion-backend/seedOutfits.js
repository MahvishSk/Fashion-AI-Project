const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

// Initialize app only if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

// 👉 Add your outfits here
const outfits = [
  {
    gender: "female",
    bodyType: "pear",
    skinTone: "wheatish",
    occasion: "college",
    imageUrl: "https://in.pinterest.com/pin/26951297766353982/",
    description: "White top with denim jeans and sneakers — ideal for college wear."
  },
  {
    gender: "female",
    bodyType: "hourglass",
    skinTone: "fair",
    occasion: "party",
    imageUrl: "https://example.com/party-outfit-1.jpg",
    description: "Black bodycon dress with heels for party nights."
  },
  {
    gender: "male",
    bodyType: "athletic",
    skinTone: "dusky",
    occasion: "office",
    imageUrl: "https://example.com/office-outfit-1.jpg",
    description: "Formal shirt with tailored trousers and leather shoes for office."
  },
  {
    gender: "female",
    bodyType: "rectangle",
    skinTone: "wheatish",
    occasion: "interview",
    imageUrl: "https://example.com/interview-outfit-1.jpg",
    description: "Blazer with straight pants and loafers for interviews."
  }
];

async function seedOutfits() {
  const batch = db.batch();

  outfits.forEach((outfit) => {
    const docRef = db.collection("outfits").doc(); // auto ID
    batch.set(docRef, outfit);
  });

  try {
    await batch.commit();
    console.log("✅ Seed data inserted successfully!");
  } catch (err) {
    console.error("❌ Error inserting seed data:", err);
  }
}

seedOutfits();
