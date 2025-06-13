"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import { fetchLocations, selectLocations } from "@/lib/redux/features/locationSlice";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";

const ImageSlider = ({ images }: { images: string[] }) => {
  const [current, setCurrent] = useState(0);
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: { perView: 1 },
    drag: true,
    created: (s) => s.moveToIdx(0),
    slideChanged: (s) => setCurrent(s.track.details.rel),
  });
  // Autoplay effect
  useEffect(() => {
    if (!instanceRef.current) return;
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      instanceRef.current?.next();
    }, 2500);
    return () => clearInterval(interval);
  }, [instanceRef, images.length]);

  if (!images.length) return null;
  if (images.length === 1) {
    return (
      <img
        src={images[0]}
        alt="Slide 1"
        className="w-full h-60 object-cover rounded-t-2xl"
      />
    );
  }
  return (
    <div className="relative w-full h-60">
      <div ref={sliderRef} className="keen-slider w-full h-60 rounded-t-2xl">
        {images.map((src, i) => (
          <div className="keen-slider__slide" key={i}>
            <img
              src={src}
              alt={`Slide ${i + 1}`}
              className="w-full h-60 object-cover rounded-t-2xl"
            />
          </div>
        ))}
      </div>
      {/* Dots */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, i) => (
          <span
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${current === i ? "bg-[#e63946] opacity-90" : "bg-[#e63946] opacity-40"}`}
          />
        ))}
      </div>
    </div>
  );
};

const DestinationSection = () => {
  const dispatch = useDispatch<AppDispatch>();
  const locations = useSelector(selectLocations);

  useEffect(() => {
    dispatch(fetchLocations());
  }, [dispatch]);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-5xl font-extrabold text-center mb-10 text-[#e63946]" style={{ fontFamily: 'var(--font-main)' }}>
        Popular Destinations
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-10">
        {locations.slice(0, 6).map((location, idx) => {
          const images = Array.isArray(location.image)
            ? location.image.filter(Boolean)
            : location.image ? [location.image] : [];
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border-2 border-[#ffe066] shadow-md hover:shadow-xl transition hover:scale-105 overflow-hidden flex flex-col items-center group"
            >
              <ImageSlider images={images} />
              <div className="p-5 w-full flex flex-col items-center">
                <h3 className="text-xl font-bold text-[#e63946] mb-1" style={{ fontFamily: 'var(--font-main)' }}>{location.name}</h3>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-center">
        <a
          href="/locations"
          className="inline-block bg-[#ffe066] text-[#e63946] font-bold px-8 py-3 rounded-full shadow-md hover:bg-[#e63946] hover:text-white transition-colors text-lg"
          style={{ fontFamily: 'var(--font-main)' }}
        >
          View All Destinations
        </a>
      </div>
    </div>
    </section>
  );
};

export default DestinationSection;