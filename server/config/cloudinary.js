import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const uploadOnCloudinary = async (filePath) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  try {
    if (!filePath) {
      console.log("No file path provided");
      return null;
    }

    // Upload file
    const response = await cloudinary.uploader.upload(filePath);

    // Delete local file
    try {
      fs.unlinkSync(filePath);
      console.log("Local file deleted:", filePath);
    } catch (deleteError) {
      console.log("Error deleting local file:", deleteError.message);
    }

    console.log("File uploaded successfully:", response.secure_url);
    return response.secure_url;

  } catch (error) {
    console.error("Error uploading to Cloudinary:", error.message);
    return null;
  }
};

export default uploadOnCloudinary;
