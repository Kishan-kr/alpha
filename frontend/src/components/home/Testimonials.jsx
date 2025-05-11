import React from "react";

const testimonials = [
  {
    name: "Aryan Patel",
    title: "Stylist & Influencer",
    quote:
      "Tashn totally changed my wardrobe game. The fit, fabric, and attitude — unmatched!",
  },
  {
    name: "Rahul Mehra",
    title: "Creative Director",
    quote:
      "Every piece from Tashn speaks volumes. It’s bold, clean, and full of vibe.",
  },
  {
    name: "Dev Malik",
    title: "Fashion Blogger",
    quote:
      "I’ve been styling with Tashn lately and the compliments haven’t stopped.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-[#0f0f0f] text-white py-20 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold tracking-wider uppercase mb-12">
          What They Say About <span className="text-[#556B2F]">Tashn</span>
        </h2>
        <div className="grid gap-10 md:grid-cols-3">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-[#1a1a1a] p-6 rounded-2xl shadow-md hover:shadow-lg transition duration-300 border border-white/10"
            >
              <p className="italic text-sm text-gray-300 mb-4">“{t.quote}”</p>
              <h4 className="font-semibold text-lg">{t.name}</h4>
              <span className="text-sm text-gray-400">{t.title}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}