const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.createUserInFirestore = functions.auth.user().onCreate(async (user) => {
  const db = admin.firestore();

  await db.collection("users").doc(user.uid).set({
    uid: user.uid,
    email: user.email,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  console.log("User added to Firestore:", user.email);
});
