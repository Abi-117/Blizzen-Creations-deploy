"use client";

import { useEffect, useState } from "react";
import {
  AiOutlineLeft,
  AiOutlineRight,
  AiOutlineClose,
} from "react-icons/ai";

export type GalleryImage = {
  _id: string;
  url: string;       // ✅ FULL HTTPS URL
  caption?: string;
};

// ✅ ONLY API URL (not image URL)
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5001";

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Fetch gallery
  const fetchGallery = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/gallery`, {
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Failed to fetch gallery");

      const data: GalleryImage[] = await res.json();
      setImages(data);
    } catch (err) {
      console.error("FETCH ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const prevImage = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex(
      (lightboxIndex + images.length - 1) % images.length
    );
  };

  const nextImage = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % images.length);
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-gray-500 text-lg animate-pulse">
          Loading gallery...
        </div>
      </div>
    );
  }

  // Empty
  if (images.length === 0) {
    return (
      <p className="text-center text-gray-500 text-lg">
        No images available.
      </p>
    );
  }

  return (
    <section className="relative bg-gradient-to-b from-blue-50 to-white py-40 px-4">
      {/* Title */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">
          Our Gallery
        </h2>
        <div className="flex justify-center gap-2">
          <div className="w-16 h-1 bg-blue-500 rounded-full" />
          <div className="w-2 h-1 bg-blue-300 rounded-full" />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {images.map((img, i) => (
          <div
            key={img._id}
            onClick={() => openLightbox(i)}
            className="relative overflow-hidden rounded-xl shadow-lg cursor-pointer group transition hover:scale-105 hover:shadow-2xl"
          >
            {/* ✅ DIRECT HTTPS IMAGE */}
            <img
              src={img.url}
              alt={img.caption || "Gallery image"}
              loading="lazy"
              className="w-full h-52 object-cover rounded-xl"
            />

            {/* Hover */}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                View
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white text-3xl"
          >
            <AiOutlineClose />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-4 text-white text-4xl"
          >
            <AiOutlineLeft />
          </button>

          <img
            src={images[lightboxIndex].url}
            alt={images[lightboxIndex].caption || "Gallery image"}
            className="max-h-[80vh] max-w-[80vw] object-contain rounded-xl"
          />

          <button
            onClick={nextImage}
            className="absolute right-4 text-white text-4xl"
          >
            <AiOutlineRight />
          </button>

          {images[lightboxIndex].caption && (
            <p className="absolute bottom-8 text-white text-lg text-center w-full">
              {images[lightboxIndex].caption}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
