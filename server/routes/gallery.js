import express from "express";
import upload from "../middleware/upload.js";
import Gallery from "../models/Gallery.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

// upload images
router.post("/upload", upload.array("images", 10), async (req, res) => {
  try {
    const images = req.files.map((file) => ({
      url: file.path,        // Cloudinary URL
      public_id: file.filename,
    }));

    const saved = await Gallery.insertMany(images);
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: "Upload failed" });
  }
});

// delete image
router.delete("/:id", async (req, res) => {
  const img = await Gallery.findById(req.params.id);
  if (!img) return res.status(404).json({ error: "Not found" });

  await cloudinary.uploader.destroy(img.public_id);
  await img.deleteOne();

  res.json({ success: true });
});

export default router;
