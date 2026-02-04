import express from "express";
import Gallery from "../models/gallery.js"; // Mongoose model
import multer from "multer";
import fs from "fs";
import path from "path";

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// GET all images
router.get("/", async (req, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch images" });
  }
});

// UPLOAD images
router.post("/upload", upload.array("images", 20), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0)
      return res.status(400).json({ error: "No files uploaded" });

    const savedImages = await Promise.all(
      req.files.map(async (file) => {
        const newImage = new Gallery({ url: `/uploads/${file.filename}` });
        await newImage.save();
        return newImage;
      })
    );

    res.status(201).json(savedImages);
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

// DELETE image
router.delete("/:id", async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    if (!image) return res.status(404).json({ error: "Image not found" });

    // Delete file from uploads
    if (!image.url.startsWith("http")) {
      const filePath = path.join("uploads", path.basename(image.url));
      fs.unlink(filePath, (err) => {
        if (err) console.error("Failed to delete file:", err);
      });
    }

    await image.deleteOne();
    res.json({ message: "Image deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Delete failed" });
  }
});

export default router;
