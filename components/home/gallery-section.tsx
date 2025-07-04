"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import { fetchGallery, selectGallery } from "@/lib/redux/features/gallerySlice";

const GallerySection = () => {
  const dispatch = useDispatch<AppDispatch>();
  const gallery = useSelector(selectGallery);

  useEffect(() => {
    dispatch(fetchGallery());
  }, [dispatch]);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-5xl font-extrabold text-center mb-10 text-[#e63946]" style={{ fontFamily: 'var(--font-main)' }}>
        Gallery
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-10">
        {gallery.map((item, idx) => (
          <div
            key={idx}
            className="group relative overflow-hidden rounded-2xl border-2 border-[#ffe066] bg-white shadow-md hover:shadow-xl transition hover:scale-105"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-72 object-cover rounded-t-2xl group-hover:brightness-95 transition"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-red/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-[#e63946] text-2xl font-bold text-center px-4" style={{ fontFamily: 'var(--font-main)' }}>{item.title}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        <a
          href="#"
          className="inline-block bg-[#ffe066] text-[#e63946] font-bold px-8 py-3 rounded-full shadow-md hover:bg-[#e63946] hover:text-white transition-colors text-lg"
          style={{ fontFamily: 'var(--font-main)' }}
        >
          View Full Gallery
        </a>
      </div>
    </div>
    </section>
  );
};

export default GallerySection;