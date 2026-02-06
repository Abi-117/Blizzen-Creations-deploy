"use client";

import { useEffect, useState } from "react";
import { apiFetch, API_BASE_URL } from "@/apiConfig";

export type GalleryImage = {
  _id: string;
  url: string;
};

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiFetch("/api/gallery");
        setImages(data);
      } catch (e) {
        console.error("Gallery fetch failed:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <p className="text-center py-20">Loading…</p>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {images.map((img) => (
        <img
          key={img._id}
          src={`${API_BASE_URL}${img.url}`}
          className="h-40 w-full object-cover rounded"
        />
      ))}
    </div>
  );
}
