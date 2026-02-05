"use client";

import { useEffect, useState, DragEvent } from "react";

export type GalleryImage = { _id: string; url: string };

const API_BASE_URL = import.meta.env.VITE_API_URL!;

export default function GalleryUpload() {
  const [files, setFiles] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showMessage = (type: "success" | "error", text: string) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 3000);
  };

  const fetchGallery = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/gallery`);
      if (!res.ok) throw new Error("Fetch failed");
      const data = await res.json();
      setImages(data);
    } catch (err) {
      console.error("FETCH ERROR:", err);
      showMessage("error", "Failed to load gallery");
    }
  };

  useEffect(() => {
    fetchGallery();
    return () => preview.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const selected = Array.from(e.dataTransfer.files);
    setFiles(selected);
    setPreview(selected.map((f) => URL.createObjectURL(f)));
  };

  const handleUpload = async () => {
    if (!files.length) return showMessage("error", "Select images first");
    setLoading(true);

    const formData = new FormData();
    files.forEach((f) => formData.append("images", f));

    try {
      const res = await fetch(`${API_BASE_URL}/api/gallery/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      setFiles([]);
      setPreview([]);
      fetchGallery();
      showMessage("success", "Images uploaded successfully");
    } catch (err: any) {
      console.error(err);
      showMessage("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = async (id: string) => {
    if (!confirm("Delete this image?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/gallery/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      fetchGallery();
      showMessage("success", "Image deleted");
    } catch (err: any) {
      console.error(err);
      showMessage("error", err.message);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {msg && (
        <div className={`fixed top-4 right-4 px-4 py-2 rounded text-white ${
          msg.type === "success" ? "bg-green-500" : "bg-red-500"
        }`}>
          {msg.text}
        </div>
      )}

      <div
        className="border-2 border-dashed p-6 rounded text-center"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <input type="file" multiple accept="image/*" onChange={(e) => {
          if (!e.target.files) return;
          const selected = Array.from(e.target.files);
          setFiles(selected);
          setPreview(selected.map((f) => URL.createObjectURL(f)));
        }} />

        <button
          onClick={handleUpload}
          disabled={loading}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((img) => (
          <div key={img._id} className="relative">
            <img
              src={img.url.startsWith("http") ? img.url : `${API_BASE_URL}${img.url}`}
              className="h-32 w-full object-cover rounded"
            />
            <button
              onClick={() => deleteImage(img._id)}
              className="absolute inset-0 bg-red-600/70 text-white opacity-0 hover:opacity-100"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
