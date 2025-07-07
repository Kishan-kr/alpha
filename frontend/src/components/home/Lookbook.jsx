import React from 'react'
import { motion } from 'framer-motion'

/**
 * Props:
 *  - videos: string[] array of video URLs
 */
export default function Lookbook({ status, videos }) {
  const cardVariants = {
    hidden:  { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover:   { scale: 1.03 }
  }

  return (
    <section className="bg-light py-16">
      <div className="max-w-7xl mx-auto px-5 md:px-15">
        
        {/* Sticky header on mobile, static on md+ */}
        <div className="sticky top-[56px] z-10 bg-light py-4 md:static">
          <h2 className="text-dark text-xl md:text-2xl font-gfs-didot uppercase tracking-wide">
            Lookbook
          </h2>
          {/* <div className="mt-2 mb-8 ms-16 border-t border-border"></div> */}
        </div>

        {/* Video grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-6 mb-4">
          {videos.map((item, i) => (
            <motion.div
              key={i}
              className="overflow-hidden shadow-lg bg-surface h-fit"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              transition={{
                delay: i * 0.1,
                duration: 0.8,
                type: 'spring',
                stiffness: 200,
                damping: 20
              }}
            >
              <video
                src={item.videoUrl}
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