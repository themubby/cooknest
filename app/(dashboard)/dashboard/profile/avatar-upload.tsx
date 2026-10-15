"use client";

import React, { useState } from "react";

const AVATAR_SIZE = 256;

// Crops to a square and shrinks the photo in the browser so it always fits in a Firestore document.
function resizeToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read that image."));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error("That file is not a valid image."));
      image.onload = () => {
        const side = Math.min(image.width, image.height);
        const sx = (image.width - side) / 2;
        const sy = (image.height - side) / 2;
        const canvas = document.createElement("canvas");
        canvas.width = AVATAR_SIZE;
        canvas.height = AVATAR_SIZE;
        const context = canvas.getContext("2d");
        if (!context) {
          reject(new Error("Your browser could not process the image."));
          return;
        }
        context.drawImage(image, sx, sy, side, side, 0, 0, AVATAR_SIZE, AVATAR_SIZE);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      image.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export default function AvatarUpload({
  currentAvatar,
  name,
}: {
  currentAvatar: string;
  name: string;
}) {
  const [preview, setPreview] = useState(currentAvatar);
  const [avatarData, setAvatarData] = useState("");
  const [error, setError] = useState("");

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setError("");
    try {
      const dataUrl = await resizeToDataUrl(file);
      setPreview(dataUrl);
      setAvatarData(dataUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not use that image.");
    }
  };

  return (
    <div className="shrink-0 flex flex-col items-center gap-2">
      <label className="relative group h-24 w-24 rounded-full overflow-hidden border-2 border-orange-500 ring-4 ring-orange-500/10 bg-gray-50 dark:bg-gray-950 cursor-pointer block">
        <input type="file" accept="image/*" className="hidden" onChange={handleChange} />
        <input type="hidden" name="avatar-data" value={avatarData} />
        <img
          src={preview}
          alt={name}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover group-hover:opacity-40 transition-opacity"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity">
          <span className="text-[10px] font-black uppercase tracking-wider">Change</span>
          <span className="text-[10px] font-black uppercase tracking-wider">Photo</span>
        </div>
      </label>
      {avatarData && (
        <span className="text-[10px] font-bold text-orange-500">New photo ready. Press Update to save.</span>
      )}
      {error && <span className="text-[10px] font-bold text-red-500">{error}</span>}
    </div>
  );
}
