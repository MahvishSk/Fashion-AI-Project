import dotenv from "dotenv";
import OpenAI from "openai";
import fs from "fs";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateImage() {
  try {
    const prompt = `
    A high-quality realistic fashion photo of a modest casual outfit
    suitable for college, neutral background, natural lighting
    `;

    const result = await openai.images.generate({
      model: "gpt-image-1-mini",
      prompt: prompt,
      size: "512x512",
    });

    const image_base64 = result.data[0].b64_json;
    fs.writeFileSync("test-outfit.png", Buffer.from(image_base64, "base64"));

    console.log("✅ Image generated: test-outfit.png");
  } catch (error) {
    console.error("❌ Error generating image:", error.message);
  }
}

generateImage();
