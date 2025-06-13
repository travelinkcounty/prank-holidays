import React from "react";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Mohan Singh",
    text: "They offer high-quality services at a fair price. Prank Holiday ensures a pleasant and stress-free travel experience. Customer Service is quite helpful, and the workforce is equally cooperative.",
    image: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    name: "Ridhima Tandon",
    text: "Travelink County provide excellent service when it comes to providing luxury travel accommodations. It is a highly recommended spot to stay. They provide high-quality services at a reasonable cost. They make sure to cater to your needs efficiently and without burning a hole in your pocket.",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
  },
  {
    name: "Alok Verma",
    text: "Travelink County provides you luxury and  budget packages and deals. Service  is good, it has facilities of  game and  activities. Staff is very courteous and generous. It is a great place and I would recommend it. It is worthy. I would love to come back to this place.",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
  },
  {
    name: "Sapna Kumari",
    text: "Travelink County is best option to go for if your planning your vacations anytime soon. I had an amazing experience. They provide quality services at reasonable price. Travelink County provides a very smooth and hassle-free travel experience. The Customer Care is so supportive and the team is also co-operative.",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    name: "Amit Sharma",
    text: "I had a great experience with Travelink County. The staff was friendly and helpful, and the facilities were clean and modern. I would definitely recommend this place to others.",
    image: "https://randomuser.me/api/portraits/men/3.jpg",
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