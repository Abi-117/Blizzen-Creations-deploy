"use client";

import { useEffect, useState, DragEvent } from "react";

export type GalleryImage = { _id: string; url: string };

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";


export default function GalleryUpload() {
  const [files, setFiles] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchGallery = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/gallery`);
      const data: GalleryImage[] = await res.json();
      setImages(data);
    } catch (err) {
      console.error("Failed to fetch gallery:", err);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  // Cleanup previews to avoid memory leaks
  useEffect(() => {
    return () => preview.forEach(URL.revokeObjectURL);
  }, [preview]);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const selected = Array.from(e.dataTransfer.files);
    setFiles(selected);
    setPreview(selected.map((f) => URL.createObjectURL(f)));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    const formData = new FormData();
    files.forEach((f) => formData.append("images", f));

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
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = async (id: string) => {
    try {
      await fetch(`${API_BASE_URL}/api/gallery/${id}`, { method: "DELETE" });
      fetchGallery();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 p-4">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed p-6 text-center"
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
          disabled={loading || files.length === 0}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {preview.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {preview.map((url, i) => (
            <img key={i} src={url} className="h-32 w-full object-cover rounded" />
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((img) => (
          <div key={img._id} className="relative">
            <img
              src={img.url.startsWith("http") ? img.url : `${API_BASE_URL}${img.url}`}
              className="h-32 w-full object-cover rounded"
            />
            <button
              onClick={() => deleteImage(img._id)}
              className="absolute inset-0 bg-red-600/70 text-white opacity-0 hover:opacity-100 transition-opacity"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
