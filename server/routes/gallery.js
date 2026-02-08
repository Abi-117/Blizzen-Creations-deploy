import express from "express";
import upload from "../middleware/upload.js";
import Gallery from "../models/Gallery.js";

const router = express.Router();

// upload images
router.post("/upload", upload.array("images", 10), async (req, res) => {
  try {
    const images = req.files.map((file) => ({
      url: file.path,        // Cloudinary URL ✅
      public_id: file.filename,
    }));

    const saved = await Gallery.insertMany(images);
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: "Upload failed" });
  }
});

// get gallery
router.get("/", async (req, res) => {
  const images = await Gallery.find().sort({ createdAt: -1 });
  res.json(images);
});

// delete image
router.delete("/:id", async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    if (!image) return res.status(404).json({ error: "Image not found" });

    // 🔥 Delete from Cloudinary
    await cloudinary.uploader.destroy(image.public_id);

    // 🔥 Delete from DB
    await image.deleteOne();

    res.json({ message: "Image deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

export default router;
