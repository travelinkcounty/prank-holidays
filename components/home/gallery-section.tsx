import React from "react";

const galleryImages = [
  { title: "Epic Beach Prank", image: "/images/gallery1.jpg" },
  { title: "Mountain Madness", image: "/images/gallery2.jpg" },
  { title: "City Surprise", image: "/images/gallery3.jpg" },
  { title: "Jungle Jokes", image: "/images/gallery4.jpg" },
  { title: "Desert Drama", image: "/images/gallery5.jpg" },
  { title: "Snowy Shenanigans", image: "/images/gallery6.jpg" },
];

const GallerySection = () => (
  <section className="py-16 bg-gray-100">
    <div className="max-w-6xl mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-10">Gallery</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {galleryImages.map((item, idx) => (
          <div key={idx} className="group relative overflow-hidden rounded-xl shadow hover:shadow-lg transition">
            <img src={item.image} alt={item.title} className="w-full h-56 object-cover transform group-hover:scale-105 transition duration-300" />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
              <span className="text-white text-lg font-semibold">{item.title}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default GallerySection;