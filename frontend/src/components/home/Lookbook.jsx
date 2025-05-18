import React from 'react'
import { motion } from 'framer-motion'

/**
 * Props:
 *  - videos: string[] array of video URLs
 */
export default function Lookbook({ videos }) {
  const cardVariants = {
    hidden:  { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover:   { scale: 1.03, backgroundColor: 'var(--color-hover-tint)' }
  }

  return (
    <section className="bg-dark py-16">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Sticky header on mobile, static on md+ */}
        <div className="sticky top-[56px] z-10 bg-dark py-4 md:static">
          <h2 className="text-white text-3xl font-bold uppercase tracking-wide">
            Lookbook
          </h2>
          <div className="mt-2 mb-8 ms-16 border-t border-border"></div>
        </div>

        {/* Video grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {videos.map((src, i) => (
            <motion.div
              key={i}
              className="rounded-lg overflow-hidden shadow-lg bg-surface odd:mt-8 h-fit"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              transition={{
                delay: i * 0.1,
                duration: 0.5,
                type: 'spring',
                stiffness: 200,
                damping: 20
              }}
            >
              <video
                src={src}
                className="w-full h-fit object-cover"
                autoPlay
                muted
                loop
                playsInline
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}