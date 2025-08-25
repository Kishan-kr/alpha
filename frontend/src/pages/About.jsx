// src/pages/About.jsx
import React from "react";

export default function About() {
  return (
    <div className="bg-light px-6 py-20 md:px-24 md:py-24">
      <div className="max-w-3xl mx-auto">
        {/* Overline */}
        <p className="uppercase text-xxs tracking-wide text-subtext">Our Story</p>

        {/* Display title */}
        <h1 className="mt-3 text-3xl md:text-5xl leading-tight font-gfs-didot text-dark">
          Tashn
        </h1>

        {/* Lead */}
        <p className="mt-6 text-base md:text-lg font-gfs-didot text-dark">
          An attitude. A feeling. A story only the wearer understands.
        </p>

        {/* Body */}
        <div className="mt-6 space-y-5 text-sm md:text-base text-dark">
          <p>
            Tashn is more than a clothing brand — it’s a reflection of you.
          </p>
          <p>
            It’s where elegance meets emotion, and where simplicity holds deep meaning.
          </p>
          <p>
            We believe that what you wear should go beyond style. It should carry energy.
            Character. Intention. Tashn is designed for those who live with purpose — artists,
            creators, dreamers, and believers.
          </p>
          <p>
            Every piece is carefully crafted with premium quality to not just look good, but feel
            powerful. When you wear Tashn, you're not just dressing up — you're stepping into your
            passion, your story, your identity.
          </p>
        </div>

        {/* Divider */}
        <div className="mt-10 border-t border-hover-tint" />

        {/* Pillars header */}
        <h2 className="mt-6 uppercase text-xs tracking-wide text-subtext">
          What We Stand For
        </h2>

        {/* Pillars grid */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-sm uppercase text-dark">Premium Quality</h3>
            <p className="mt-2 text-sm text-subtext">
              We believe true quality is in the feel — the weight of the fabric, the touch of the thread, the finesse of every detail. Craft that speaks without saying a word.
            </p>
          </div>

          <div>
            <h3 className="text-sm uppercase text-dark">Designed to Feel</h3>
            <p className="mt-2 text-sm text-subtext">
              Every Tashn piece is made to stir something in you — to remind you of your drive,
              your fire, your purpose. This isn’t just clothing. It’s a feeling.
            </p>
          </div>

          <div>
            <h3 className="text-sm uppercase text-dark">You, Reflected</h3>
            <p className="mt-2 text-sm text-subtext">
              Our designs are honest, intentional, and timeless — made to let you shine through.
              We don’t believe in distractions. We believe in focus.
            </p>
          </div>

          <div>
            <h3 className="text-sm uppercase text-dark">Built for the Passionate</h3>
            <p className="mt-2 text-sm text-subtext">
              Whether you're a storyteller, a painter, a reader, a director, or simply someone who
              believes deeply in what they do — Tashn is created with you in mind. You live for
              meaning. So do we.
            </p>
          </div>
        </div>

        {/* Closing mark */}
        <div className="mt-10 border-t border-hover-tint pt-6">
          <p className="font-gfs-didot text-dark">Tashn</p>
          <p className="text-subtext text-sm">Wear what you feel. Live what you believe.</p>
        </div>
      </div>
    </div>
  );
}