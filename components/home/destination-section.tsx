"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import { fetchLocations, selectLocations } from "@/lib/redux/features/locationSlice";

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
        {locations.slice(0, 6).map((location, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border-2 border-[#ffe066] shadow-md hover:shadow-xl transition hover:scale-105 overflow-hidden flex flex-col items-center group"
          >
            <img
              src={location.image}
              alt={location.name}
              className="w-full h-60 object-cover rounded-t-2xl group-hover:brightness-95 transition"
            />
            <div className="p-5 w-full flex flex-col items-center">
              <h3 className="text-xl font-bold text-[#e63946] mb-1" style={{ fontFamily: 'var(--font-main)' }}>{location.name}</h3>
            </div>
          </div>
        ))}
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