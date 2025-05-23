import React from "react";

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
  <section className="py-16 bg-white">
    <div className="max-w-5xl mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-10">What Our Customers Say</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((t, idx) => (
          <div key={idx} className="bg-gray-50 rounded-xl shadow p-6 flex flex-col items-center text-center hover:shadow-lg transition">
            <img src={t.image} alt={t.name} className="w-20 h-20 rounded-full object-cover mb-4 border-4 border-yellow-300" />
            <p className="text-gray-700 mb-4">"{t.text}"</p>
            <div className="font-semibold text-gray-900">- {t.name}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialSection;