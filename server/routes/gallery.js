import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Gallery from "../models/Gallery.js";

const router = express.Router();

const uploadDir = path.resolve("uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// GET all gallery images
router.get("/", async (req, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    console.error("Gallery fetch error:", err);
    res.status(500).json({ error: "Failed to fetch gallery" });
  }
});

// UPLOAD images
router.post("/upload", upload.array("images", 20), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0)
      return res.status(400).json({ error: "No files uploaded" });

    const BASE_URL = process.env.BASE_URL || "http://localhost:5001";

    const savedImages = await Promise.all(
      req.files.map(async (file) => {
        const image = new Gallery({
          url: `${BASE_URL}/uploads/${file.filename}`, // full URL
        });
        await image.save();
        return image;
      })
    );

    res.status(201).json(savedImages);
  } catch (err) {
    console.error("Gallery upload error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

// DELETE image
router.delete("/:id", async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    if (!image) return res.status(404).json({ error: "Image not found" });

    // Remove file from disk
    const filePath = path.resolve("uploads", path.basename(image.url));
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await image.deleteOne();
    res.json({ message: "Image deleted successfully" });
  } catch (err) {
    console.error("Gallery delete error:", err);
    res.status(500).json({ error: "Delete failed" });
  }
});

export default router;
