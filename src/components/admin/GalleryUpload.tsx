"use client";

import { useEffect, useState } from "react";
import { apiFetch, API_BASE_URL } from "@/apiConfig";

export default function GalleryUpload() {
  const [images, setImages] = useState<any[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  const load = async () => {
    const data = await apiFetch("/api/gallery");
    setImages(data);
  };

  useEffect(() => {
    load();
  }, []);

  const upload = async () => {
    const fd = new FormData();
    files.forEach((f) => fd.append("images", f));

    await fetch(`${API_BASE_URL}/api/gallery/upload`, {
      method: "POST",
      body: fd,
    });

    setFiles([]);
    load();
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        multiple
        onChange={(e) => setFiles(Array.from(e.target.files || []))}
      />

      <button onClick={upload}>Upload</button>

      <div className="grid grid-cols-4 gap-3">
        {images.map((img) => (
          <img key={img._id} src={`${API_BASE_URL}${img.url}`} />
        ))}
      </div>
    </div>
  );
}
