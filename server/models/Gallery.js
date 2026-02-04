import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema({
  url: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("Gallery", gallerySchema);
