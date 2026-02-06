"use client";

import { useEffect, useState } from "react";
import { AiOutlineLeft, AiOutlineRight, AiOutlineClose } from "react-icons/ai";
import img1 from "../assets/IMG1.jpeg";

export type GalleryImage = {
  _id: string;
  url: string;
  caption?: string;
};

/**
 * API base URL – works in:
 * - Vite
 * - Next.js
 * - Local
 * - Production
 */
const API_BASE_URL =
  typeof window !== "undefined"
    ? (import.meta as any)?.env?.VITE_API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:5001"
    : "";

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  /** Fetch gallery images safely */
  const fetchGallery = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/gallery`, {
        cache: "no-store",
      });

      if (!res.ok) throw new Error("API failed");

      const data: GalleryImage[] = await res.json();

      if (Array.isArray(data) && data.length > 0) {
        setImages(data);
      } else {
        // fallback if API returns empty
        setImages([]);
      }
    } catch (error) {
      console.warn("Gallery API not reachable, using fallback images");

      // 🔹 FALLBACK – backend down naalum frontend work aagum
      setImages([
        {
          _id: "fallback-1",
          url: img1,
          caption: "Our Work",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = () =>
    lightboxIndex !== null &&
    setLightboxIndex((lightboxIndex + images.length - 1) % images.length);
  const nextImage = () =>
    lightboxIndex !== null &&
    setLightboxIndex((lightboxIndex + 1) % images.length);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-gray-500 text-lg animate-pulse">
          Loading gallery...
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <p className="text-center text-gray-500 text-lg">
        Gallery coming soon ✨
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
          <div className="w-16 h-1 bg-blue-500 rounded-full"></div>
          <div className="w-2 h-1 bg-blue-300 rounded-full"></div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {images.map((img, i) => (
          <div
            key={img._id}
            className="relative overflow-hidden rounded-xl shadow-lg group cursor-pointer hover:scale-105 transition"
            onClick={() => openLightbox(i)}
          >
            <img
              src={
                img.url.startsWith("http")
                  ? img.url
                  : img.url.startsWith("/")
                  ? `${API_BASE_URL}${img.url}`
                  : img.url
              }
              alt={img.caption || "Gallery"}
              className="w-full h-52 object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = img1;
              }}
            />

            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
              <p className="text-white font-semibold">View</p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <button onClick={closeLightbox} className="absolute top-4 right-4 text-white text-3xl">
            <AiOutlineClose />
          </button>
          <button onClick={prevImage} className="absolute left-4 text-white text-4xl">
            <AiOutlineLeft />
          </button>

          <img
            src={
              images[lightboxIndex].url.startsWith("http")
                ? images[lightboxIndex].url
                : images[lightboxIndex].url
            }
            className="max-h-[80vh] max-w-[80vw] object-contain rounded-xl"
          />

          <button onClick={nextImage} className="absolute right-4 text-white text-4xl">
            <AiOutlineRight />
          </button>
        </div>
      )}
    </section>
  );
}
