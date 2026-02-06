"use client";

import { useEffect, useState, DragEvent } from "react";

export type GalleryImage = {
  _id: string;
  url: string;
};

const API_BASE_URL = "https://blizzen-creations-deploy.onrender.com";

export default function GalleryUpload() {
  const [files, setFiles] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(false);

  /* ===== FETCH GALLERY ===== */
  const fetchGallery = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/gallery`);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data: GalleryImage[] = await res.json();
      setImages(data);
    } catch (error) {
      console.error("Gallery fetch failed:", error);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  /* ===== CLEANUP PREVIEW URLS ===== */
  useEffect(() => {
    return () => {
      preview.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [preview]);

  /* ===== DRAG & DROP ===== */
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const selected = Array.from(e.dataTransfer.files);
    setFiles(selected);
    setPreview(selected.map((file) => URL.createObjectURL(file)));
  };

  /* ===== UPLOAD ===== */
  const handleUpload = async () => {
    if (!files.length) return;

    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/gallery/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      setFiles([]);
      setPreview([]);
      fetchGallery();
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ===== DELETE ===== */
  const deleteImage = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/gallery/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");
      fetchGallery();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="space-y-6 p-4">
      {/* Upload box */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed p-6 text-center rounded-lg"
      >
        <input
          type="file"
          multiple
          onChange={(e) => {
            const selected = Array.from(e.target.files || []);
            setFiles(selected);
            setPreview(selected.map((f) => URL.createObjectURL(f)));
          }}
        />

        <button
          onClick={handleUpload}
          disabled={loading || !files.length}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {/* Preview */}
      {preview.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {preview.map((url, i) => (
            <img
              key={i}
              src={url}
              className="h-32 w-full object-cover rounded"
            />
          ))}
        </div>
      )}

      {/* Gallery */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((img) => (
          <div key={img._id} className="relative group">
            <img
              src={
                img.url.startsWith("http")
                  ? img.url
                  : `${API_BASE_URL}${img.url}`
              }
              className="h-32 w-full object-cover rounded"
            />

            <button
              onClick={() => deleteImage(img._id)}
              className="absolute inset-0 bg-red-600/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
