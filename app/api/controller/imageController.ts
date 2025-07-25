import sharp from "sharp";
import { adminStorage } from "../config/firebase";

const UploadImage = async (file: any) => {
  try {
    // Removed file size limit check
    const arrayBuffer = await file.arrayBuffer(); // Convert Blob to ArrayBuffer
    const buffer = Buffer.from(arrayBuffer); // Convert to Buffer

    const bucket = adminStorage.bucket();
    const filePath = `travelink/${Date.now()}_${file.name}`; // Generate unique file path
    const firebaseFile = bucket.file(filePath);

    // Compress and resize image using sharp
    const resizedBuffer = await sharp(buffer)
      .resize({ width: 1200, withoutEnlargement: true }) // Resize to max width 1200px
      .jpeg({ quality: 80 }) // Compress to JPEG with quality 80
      .toBuffer();

    const blobStream = firebaseFile.createWriteStream({
      metadata: { contentType: file.type },
    });

    return new Promise((resolve, reject) => {
      blobStream.on("error", reject);
      blobStream.on("finish", async () => {
        const [url] = await firebaseFile.getSignedUrl({ action: "read", expires: "03-09-2491" });
        resolve(url);
      });
      blobStream.end(resizedBuffer);
    });
  } catch (error: any) {
    throw new Error("Error uploading image: " + error.message);
  }
};

const UploadMultipleImages = async (files: any[]) => {
  try {
    // Only upload up to 5 images
    const limitedFiles = files.slice(0, 5);
    const uploadPromises = limitedFiles.map(file => UploadImage(file));
    return await Promise.all(uploadPromises);
  } catch (error: any) {
    throw new Error("Error uploading multiple images: " + error.message);
  }
};

const ReplaceImage = async (file: any, oldImageUrl: string) => {
  try {
    const bucket = adminStorage.bucket();

    // Delete old image if exists
    if (oldImageUrl) {
      try {
        console.log("Old Image URL:", oldImageUrl); // Debugging

        let oldFilePath;
        if (oldImageUrl.includes("/o/")) {
          // Handle public URL format
          oldFilePath = oldImageUrl.split("/o/")[1].split("?")[0];
        } else if (oldImageUrl.includes("storage.googleapis.com")) {
          // Handle signed URL format
          const urlParts = oldImageUrl.split("storage.googleapis.com/")[1].split("?")[0];
          // Remove the bucket name from the file path
          oldFilePath = urlParts.split("/").slice(1).join("/");
        } else {
          throw new Error("Invalid old image URL format");
        }

        const decodedOldFilePath = decodeURIComponent(oldFilePath);
        
        // Delete the old image
        await bucket.file(decodedOldFilePath).delete();
        console.log("Old image deleted:", decodedOldFilePath);
      } catch (deleteError: any) {
        console.warn("Failed to delete old image:", deleteError.message);
        throw new Error("Failed to delete old image: " + deleteError.message);
      }
    }

    // Upload new image if provided
    if (file) {
      return await UploadImage(file);
    } else {
      return null; // Return null if no new image is provided
    }
  } catch (error: any) {
    throw new Error("Error replacing image: " + error.message);
  }
};

export { UploadImage, UploadMultipleImages, ReplaceImage };