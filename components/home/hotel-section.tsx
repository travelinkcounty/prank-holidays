"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import { fetchHotels, selectHotels } from "@/lib/redux/features/hotelSlice";
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
        className="w-full h-64 object-cover rounded-t-3xl"
      />
    );
  }
  return (
    <div className="relative w-full h-64">
      <div ref={sliderRef} className="keen-slider w-full h-64 rounded-t-3xl group-hover:brightness-95 transition">
        {images.map((src, i) => (
          <div className="keen-slider__slide" key={i}>
            <img
              src={src}
              alt={`Slide ${i + 1}`}
              className="w-full h-64 object-cover rounded-t-3xl"
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

const HotelSection = () => {
  const dispatch = useDispatch<AppDispatch>();
  const hotels = useSelector(selectHotels);

  useEffect(() => {
    dispatch(fetchHotels());
  }, [dispatch]);


  return (
    <section className="py-20 bg-gradient-to-b from-[#f8fafc] to-[#fffbe6]">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-5xl font-extrabold text-center mb-12 text-[#e63946]" style={{ fontFamily: 'var(--font-main)' }}>
          Popular Hotels
        </h2>
        {hotels.length === 0 ? (
          <div className="text-center text-gray-600">No hotels found</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 mb-12">
              {hotels.slice(0, 6).map((hotel, idx) => {
                const images = Array.isArray(hotel.image)
                  ? hotel.image.filter(Boolean)
                  : hotel.image ? [hotel.image] : [];
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-3xl border-2 border-[#ffe066] shadow-xl hover:shadow-2xl transition hover:scale-105 overflow-hidden flex flex-col group relative"
                  >
                    <div className="relative">
                      <ImageSlider images={images} />
                    </div>
                    <div className="p-6 w-full flex flex-col items-center gap-2">
                      <h3 className="text-2xl font-bold text-[#e63946] mb-1 text-center" style={{ fontFamily: 'var(--font-main)' }}>
                        {hotel.name}
                      </h3>
                      {hotel.location && (
                        <div className="text-sm text-[#1a4d8f] font-semibold mb-1">{hotel.location}</div>
                      )}
                      {hotel.description && (
                        <p className="text-gray-600 text-center text-base mb-2 line-clamp-2">{hotel.description}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-center">
              <a
                href="/hotels"
                className="inline-block bg-[#ffe066] text-[#e63946] font-bold px-8 py-3 rounded-full shadow-md hover:bg-[#e63946] hover:text-white transition-colors text-lg"
                style={{ fontFamily: 'var(--font-main)' }}
              >
                View All Hotels
              </a>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default HotelSection;  