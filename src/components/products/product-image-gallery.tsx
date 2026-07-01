"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { getImageUrl } from "@/lib/utils";

interface Props {
  images: string[];
  name: string;
}

export function ProductImageGallery({ images, name }: Props) {
  const [current, setCurrent] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const allImages = images.length > 0 ? images : ["/images/placeholder.jpg"];

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div
        className="relative aspect-square bg-gray-50 rounded-xl overflow-hidden cursor-zoom-in"
        onClick={() => setZoomed(!zoomed)}
      >
        <Image
          src={getImageUrl(allImages[current])}
          alt={name}
          fill
          priority
          className="object-contain p-6"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <button
          onClick={(e) => { e.stopPropagation(); setZoomed(!zoomed); }}
          className="absolute top-3 right-3 p-2 bg-white/80 rounded-lg hover:bg-white transition-colors"
        >
          <ZoomIn className="w-4 h-4 text-gray-600" />
        </button>

        {allImages.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); setCurrent((c) => (c - 1 + allImages.length) % allImages.length); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 bg-white/80 rounded-full hover:bg-white transition-colors shadow"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setCurrent((c) => (c + 1) % allImages.length); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-white/80 rounded-full hover:bg-white transition-colors shadow"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {allImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                i === current ? "border-[#1a3a5c]" : "border-gray-100 hover:border-gray-300"
              }`}
            >
              <Image src={getImageUrl(img)} alt={`${name} ${i + 1}`} fill className="object-contain p-1" />
            </button>
          ))}
        </div>
      )}

      {/* Zoom modal */}
      {zoomed && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setZoomed(false)}
        >
          <div className="relative w-full max-w-3xl aspect-square">
            <Image
              src={getImageUrl(allImages[current])}
              alt={name}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </div>
      )}
    </div>
  );
}
