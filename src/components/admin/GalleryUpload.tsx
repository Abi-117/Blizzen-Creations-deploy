"use client";

import { useEffect, useState, DragEvent } from "react";

export type GalleryImage = { _id: string; url: string };

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";


export default function GalleryUpload() {
  const [files, setFiles] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchGallery = async () => {
    const res = await fetch(`${API_BASE_URL}/api/gallery`);
    const data = await res.json();
    setImages(data);
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const selected = Array.from(e.dataTransfer.files);
    setFiles(selected);
    setPreview(selected.map((f) => URL.createObjectURL(f)));
  };

  const handleUpload = async () => {
    const formData = new FormData();
    files.forEach((f) => formData.append("images", f));

    setLoading(true);
    await fetch(`${API_BASE_URL}/api/gallery/upload`, {
      method: "POST",
      body: formData,
    });
    setLoading(false);
    setFiles([]);
    setPreview([]);
    fetchGallery();
  };

  const deleteImage = async (id: string) => {
    await fetch(`${API_BASE_URL}/api/gallery/${id}`, {
      method: "DELETE",
    });
    fetchGallery();
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
          onChange={(e) =>
            setFiles(Array.from(e.target.files || []))
          }
        />
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
              src={
                img.url.startsWith("http")
                  ? img.url
                  : `${API_BASE_URL}${img.url}`
              }
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
