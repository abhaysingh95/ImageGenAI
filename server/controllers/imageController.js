import userModel from '../models/userModel.js';
import FormData from 'form-data';
import axios from 'axios';

export const generateImage = async (req, res) => {
  try {
    const { prompt } = req.body;  // ✅ only prompt from body
    const userId = req.userId;    // ✅ from auth middleware

    if (!prompt) {
      return res.status(400).json({ success: false, message: "Prompt is required" });
    }

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.creditBalance <= 0) {
      return res.status(400).json({
        success: false,
        message: "No Credit Balance",
        creditBalance: user.creditBalance,
      });
    }

    // Prepare API request
    const formData = new FormData();
    formData.append("prompt", prompt);

    const { data } = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: {
          "x-api-key": process.env.CLIPDROP_API,
          ...formData.getHeaders(), // ✅ include form headers
        },
        responseType: "arraybuffer",
      }
    );

    // Convert to base64
    const base64Image = Buffer.from(data, "binary").toString("base64");
    const resultImage = `data:image/png;base64,${base64Image}`;

    // Deduct credit
    user.creditBalance -= 1;
    await user.save();

    return res.json({
      success: true,
      message: "Image Generated",
      creditBalance: user.creditBalance,
      resultImage,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};
