"use client";

import { useEffect, useState, DragEvent } from "react";

export type GalleryImage = { _id: string; url: string };

const API_BASE_URL =
  import.meta.env.VITE_API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:5001";

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

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const selected = Array.from(e.dataTransfer.files || []);
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
      showMessage("error", err.message);
    }
  };

  return (
    <div className="space-y-6 p-4">
      {msg && (
        <div
          className={`fixed top-4 right-4 px-4 py-2 rounded text-white ${
            msg.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {msg.text}
        </div>
      )}

      {/* Upload */}
      <div
        className="border-2 border-dashed p-6 text-center"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <input type="file" multiple accept="image/*" onChange={(e) => {
          const f = Array.from(e.target.files || []);
          setFiles(f);
          setPreview(f.map((x) => URL.createObjectURL(x)));
        }} />

        <div className="grid grid-cols-4 gap-3 mt-4">
          {preview.map((p, i) => (
            <img key={i} src={p} className="h-24 w-full object-cover rounded" />
          ))}
        </div>

        <button
          onClick={handleUpload}
          disabled={loading}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {/* Gallery */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((img) => {
          const imgSrc = img.url.startsWith("http")
            ? img.url
            : `${API_BASE_URL}${img.url}`;

          return (
            <div key={img._id} className="relative group">
              <img src={imgSrc} className="h-32 w-full object-cover rounded" />
              <button
                onClick={() => deleteImage(img._id)}
                className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100"
              >
                Delete
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
