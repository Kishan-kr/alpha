import React, { useEffect, useMemo, useRef } from "react";
import { easeInOut, motion, useAnimation } from "framer-motion";
import star from '../../assets/icons/star.png';
import starFilled from '../../assets/icons/star_filled.png';
import useMediaQuery from "../../hooks/useMediaQuery";
import { formatToRelativeDate } from "../../utils/dateFormatter";

// Duplicate so we can scroll infinitely without changing the original slot data

export default function CustomerDiaries({status, reviews}) {
  const extended = [...reviews, ...reviews];
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
          transition: { duration: 0.8, ease: easeInOut },
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
    <section className="bg-light text-dark py-20 pb-28 px-6 md:px-15">
      <div className="max-w-6xl mx-auto">
        <div className="relative max-w-6xl mx-auto text-center mb-16">
          <div className="relative w-fit mx-auto">
            <h2 className="text-xl md:text-2xl font-gfs-didot font-bold uppercase">Loved by Many</h2>
          </div>
          <p className="mt-2 text-subtext">Hear directly from those who made us a part of their lifestyle</p>
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
                <article className="p-6 duration-300 border border-dark flex flex-col h-full">
                  {/* Rating */}
                  <div className="flex mb-4 gap-x-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <img
                        key={i}
                        src={i < r.rating ? starFilled : star}
                        alt="star"
                        className="w-5 h-5 inline-block"
                      />
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="italic font-light text-xl text-dark mb-4 flex-1">
                    “{r.comment}”
                  </p>

                  {/* Reviewer Info */}
                  <h4 className="text-base mx-auto">{r.name}</h4>
                  <span className="text-[11px] text-border mx-auto uppercase mt-1">{r.product}</span>
                  <span className="text-[11px] border border-border w-fit p-1 px-3 text-border mt-2 m-auto">
                    {formatToRelativeDate(r.date)}
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