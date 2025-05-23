import React from "react";

const destinations = [
  { name: "Goa", image: "/images/goa.jpg" },
  { name: "Manali", image: "/images/manali.jpg" },
  { name: "Jaipur", image: "/images/jaipur.jpg" },
  { name: "Kerala", image: "/images/kerala.jpg" },
  { name: "Ladakh", image: "/images/ladakh.jpg" },
  { name: "Andaman", image: "/images/andaman.jpg" },
];

const DestinationSection = () => (
  <section className="py-16 bg-gray-50">
    <div className="max-w-6xl mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-10">Popular Destinations</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {destinations.map((dest, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">
            <img src={dest.image} alt={dest.name} className="w-full h-48 object-cover" />
            <div className="p-4 text-center">
              <h3 className="text-xl font-semibold text-gray-800">{dest.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default DestinationSection;