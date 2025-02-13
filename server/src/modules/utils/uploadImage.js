import config from "../../config/config.js"
import { v2 as cloudinary } from "cloudinary";

// Configuration
cloudinary.config({
  cloud_name: config.cloudinary.name,
  api_key: config.cloudinary.key,
  api_secret: config.cloudinary.secret,
});

export const uploadImage = async (imageFile) => {
  try {
    const imageBuffer = imageFile?.buffer?.toString("base64");
    const response = await cloudinary.uploader.upload(
      `data:${imageFile?.mimetype};base64,${imageBuffer}`,
      {
        folder: "Bioafya",
      }
    );
    return response.secure_url;
  } catch (error) {
    throw error;
  }
};
