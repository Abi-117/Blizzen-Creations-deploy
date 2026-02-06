import express from "express";

const router = express.Router();

// TEMP storage (replace with Mongo later if needed)
let landingData = {
  hero: { title: "", subtitle: "", cta: "" },
  about: { description: "" },
  courses: [],
  features: [],
};

// GET landing data
router.get("/", async (req, res) => {
  try {
    res.json(landingData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch landing data" });
  }
});

// SAVE landing data (ADMIN)
router.post("/", async (req, res) => {
  try {
    landingData = req.body;
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save landing data" });
  }
});

export default router;
