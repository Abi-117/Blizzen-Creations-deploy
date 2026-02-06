"use client";

import { useEffect, useState } from "react";
import { AiOutlineLeft, AiOutlineRight, AiOutlineClose } from "react-icons/ai";
import { apiServices } from "@/services/api";

export type GalleryImage = {
  _id: string;
  url: string;
  caption?: string;
};

const API_BASE_URL = "https://blizzen-creations-deploy.onrender.com";

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const data = await apiServices.getGallery();
      setImages(data);
    } catch (error) {
      console.error("Gallery fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const prevImage = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + images.length - 1) % images.length);
  };

  const nextImage = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % images.length);
  };

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
        No images available.
      </p>
    );
  }

  return (
    <section className="relative bg-gradient-to-b from-blue-50 to-white py-40 px-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">
          Our Gallery
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {images.map((img, i) => (
          <div
            key={img._id}
            className="relative overflow-hidden rounded-xl shadow-lg cursor-pointer"
            onClick={() => openLightbox(i)}
          >
            <img
              src={
                img.url.startsWith("http")
                  ? img.url
                  : `${API_BASE_URL}${img.url}`
              }
              alt={img.caption || "Gallery image"}
              className="w-full h-52 object-cover"
            />
          </div>
        ))}
      </div>

      {lightboxIndex !== null && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
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
            src={
              images[lightboxIndex].url.startsWith("http")
                ? images[lightboxIndex].url
                : `${API_BASE_URL}${images[lightboxIndex].url}`
            }
            className="max-h-[80vh] max-w-[80vw] object-contain rounded-xl"
          />

          <button
            onClick={nextImage}
            className="absolute right-4 text-white text-4xl"
          >
            <AiOutlineRight />
          </button>
        </div>
      )}
    </section>
  );
}
