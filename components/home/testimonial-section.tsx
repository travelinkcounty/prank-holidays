import React from "react";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Amit Sharma",
    text: "Absolutely hilarious! My friends couldn't stop laughing. Highly recommend Prank Holiday!",
    image: "/images/user1.jpg",
  },
  {
    name: "Priya Singh",
    text: "The best prank experience ever. Super easy and so much fun!",
    image: "/images/user2.jpg",
  },
  {
    name: "Rahul Verma",
    text: "Loved the creativity and execution. Will use again for sure!",
    image: "/images/user3.jpg",
  },
];

const TestimonialSection = () => (
  <section className="relative py-20 bg-white overflow-hidden">
    {/* Subtle background accent */}
    <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#ffe066]/30 rounded-full blur-3xl z-0" />
    <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-[#e63946]/10 rounded-full blur-3xl z-0" />
    <div className="relative z-10 max-w-5xl mx-auto px-4">
      <h2 className="text-4xl font-extrabold text-center mb-12 text-[#e63946]" style={{ fontFamily: 'var(--font-main)' }}>
        What Our Customers Say
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((t, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border-2 border-[#ffe066] shadow-md hover:shadow-xl transition hover:scale-105 flex flex-col items-center text-center p-8 relative group"
          >
            <Quote className="w-8 h-8 text-[#e63946] mb-3 absolute -top-5 left-1/2 -translate-x-1/2 bg-white rounded-full p-1 shadow" />
            <img
              src={t.image}
              alt={t.name}
              className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-[#ffe066] shadow-lg group-hover:scale-105 transition"
            />
            <p className="text-gray-700 mb-4 text-lg font-medium" style={{ fontFamily: 'var(--font-main)' }}>
              "{t.text}"
            </p>
            <div className="font-bold text-[#e63946] text-base" style={{ fontFamily: 'var(--font-main)' }}>- {t.name}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialSection;