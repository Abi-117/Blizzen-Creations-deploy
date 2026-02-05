"use client";

import { useEffect, useState } from "react";
import { AiOutlineLeft, AiOutlineRight, AiOutlineClose } from "react-icons/ai";

export type GalleryImage = {
  _id: string;
  url: string;
  caption?: string;
};

const API_BASE_URL = import.meta.env.VITE_API_URL!;

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/gallery`)
      .then((res) => res.json())
      .then(setImages)
      .catch((err) => console.error("FETCH ERROR:", err));
  }, []);

  if (!images.length) return <p className="text-center">No images</p>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
      {images.map((img, i) => (
        <img
          key={img._id}
          src={img.url.startsWith("http") ? img.url : `${API_BASE_URL}${img.url}`}
          className="cursor-pointer rounded"
          onClick={() => setLightboxIndex(i)}
        />
      ))}

      {lightboxIndex !== null && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
          <AiOutlineClose
            className="absolute top-4 right-4 text-white text-3xl cursor-pointer"
            onClick={() => setLightboxIndex(null)}
          />
          <AiOutlineLeft
            className="absolute left-4 text-white text-4xl cursor-pointer"
            onClick={() => setLightboxIndex((lightboxIndex + images.length - 1) % images.length)}
          />
          <img
            src={images[lightboxIndex].url.startsWith("http")
              ? images[lightboxIndex].url
              : `${API_BASE_URL}${images[lightboxIndex].url}`}
            className="max-h-[80vh]"
          />
          <AiOutlineRight
            className="absolute right-4 text-white text-4xl cursor-pointer"
            onClick={() => setLightboxIndex((lightboxIndex + 1) % images.length)}
          />
        </div>
      )}
    </div>
  );
}
