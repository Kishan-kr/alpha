import React, { useEffect, useMemo, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { Star } from "lucide-react";
import useMediaQuery from "../../hooks/useMediaQuery";
import reviews from "../../utils/reviews";
import customerDiariesCharacter from '../../assets/photos/customerDiariesCharacter.png'

// Duplicate so we can scroll infinitely without changing the original slot data
const extended = [...reviews, ...reviews];

export default function CustomerDiaries() {
  const controls = useAnimation();
  const indexRef = useRef(0);

  const isSm = useMediaQuery("(min-width: 640px)");
  const isTablet = useMediaQuery("(min-width: 768px)");

  const visibleCount = useMemo(() => {
    if (isTablet) return 3;   // md and up
    if (isSm) return 2;   // sm only
    return 1;                 // mobile
  }, [isSm, isTablet]);

  // Each slide shift as a percentage of the wrapper width:
  // 100/extended.length  → the width of one card, in % of wrapper
  const shiftPercent = 100 / extended.length;

  // Total wrapper width = (total cards / visible slots) * 100%
  const wrapperWidth = (extended.length / visibleCount) * 100;

  // Auto‐advance loop
  useEffect(() => {
    const timer = setInterval(() => {
      (async () => {
        const next = indexRef.current + 1;

        // Animate left by one card
        await controls.start({
          x: `-${next * shiftPercent}%`,
          transition: { duration: 0.8, ease: "easeInOut" },
        });

        if (next >= reviews.length) {
          // If we've reached the duplicate boundary, jump back to start
          controls.set({ x: "0%" });
          indexRef.current = 0;
        } else {
          indexRef.current = next;
        }
      })();
    }, 3000);

    return () => clearInterval(timer);
  }, [controls, shiftPercent]);

  return (
    <section className="bg-dark text-white py-20 pb-28 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <div className="relative max-w-6xl mx-auto text-center mb-16">
          <div className="relative w-fit mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold uppercase">Loved by Many</h2>
            <img src={customerDiariesCharacter} alt="" className='absolute h-36 md:h-50 right-[calc(100%-56px)] md:right-[calc(100%-76px)] -top-[90px] md:-top-[126px] z-30' />

          </div>
          <p className="mt-2 text-gray-400">Real feedback from customers like you</p>
        </div>

        <div className="relative overflow-hidden">
          <motion.div
            className="flex"
            style={{ width: `${wrapperWidth}%` }}
            initial={{ x: "0%" }}
            animate={controls}
          >
            {extended.map((r, idx) => (
              <div key={idx} className="flex-1 px-4">
                <article className="bg-surface p-6 rounded-2xl shadow-md transition-shadow duration-300 border border-white/10 flex flex-col h-full">
                  {/* Rating */}
                  <div className="flex mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < r.rating ? "text-[#5EF38C]" : "text-gray-600"
                          }`}
                      />
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="italic text-gray-300 mb-4 flex-1">
                    “{r.comment}”
                  </p>

                  {/* Reviewer Info */}
                  <h4 className="font-semibold text-lg mx-auto">{r.name}</h4>
                  <span className="text-sm text-gray-400 mx-auto">{r.product}</span>
                  <span className="text-xs border border-border w-fit p-1 px-3 rounded-full text-subtext mt-1 m-auto">
                    {r.date}
                  </span>
                </article>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}