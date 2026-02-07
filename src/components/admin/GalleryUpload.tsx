"use client";

import { useEffect, useState, DragEvent } from "react";

export type GalleryImage = { _id: string; url: string };

const API_BASE_URL = process.env.VITE_API_URL || "http://localhost:5001";

export default function GalleryUpload() {
  const [files, setFiles] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Fetch gallery
  const fetchGallery = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/gallery`);
      if (!res.ok) throw new Error("Failed to fetch gallery");
      const data: GalleryImage[] = await res.json();
      setImages(data);
    } catch (err) {
      console.error(err);
      showMessage("error", "Failed to load gallery");
    }
  };

  useEffect(() => {
    fetchGallery();
    return () => preview.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  const showMessage = (type: "success" | "error", text: string) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 3000);
  };

  // Drag-and-drop handlers
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const dt = e.dataTransfer;
    if (!dt.files) return;
    const selected = Array.from(dt.files);
    setFiles(selected);
    setPreview(selected.map((f) => URL.createObjectURL(f)));
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files);
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

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setFiles([]);
      setPreview([]);
      fetchGallery();
      showMessage("success", "Images uploaded successfully!");
    } catch (err: any) {
      console.error("Upload error:", err);
      showMessage("error", `Upload failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = async (id: string) => {
    if (!confirm("Delete this image?")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/gallery/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");

      fetchGallery();
      showMessage("success", "Image deleted successfully!");
    } catch (err: any) {
      console.error("Delete error:", err);
      showMessage("error", `Delete failed: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6 p-4">
      {/* Toast */}
      {msg && (
        <div
          className={`fixed top-4 right-4 px-4 py-2 rounded shadow text-white ${
            msg.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {msg.text}
        </div>
      )}

      {/* Upload Section */}
      <div
        className="bg-white p-6 rounded-lg shadow border-2 border-dashed border-gray-300 text-center"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <h3 className="text-lg font-semibold mb-4">Upload Images</h3>
        <p className="mb-2 text-gray-500">Drag & drop images here or click to select files</p>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="mb-4 cursor-pointer"
        />
        {preview.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {preview.map((src, i) => (
              <img key={i} src={src} alt="Preview" className="h-32 w-full object-cover rounded" />
            ))}
          </div>
        )}
        <button
          onClick={handleUpload}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Upload Images"}
        </button>
      </div>

      {/* Gallery Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Uploaded Images</h3>
        {images.length === 0 ? (
          <p>No images uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((img) => (
              <div key={img._id} className="relative group">
                <img
                  src={img.url.startsWith("http") ? img.url : `${API_BASE_URL}${img.url}`}
                  alt="Gallery"
                  className="h-32 w-full object-cover rounded"
                />
                <button
                  onClick={() => deleteImage(img._id)}
                  className="absolute inset-0 bg-red-600/70 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center font-semibold rounded transition"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
