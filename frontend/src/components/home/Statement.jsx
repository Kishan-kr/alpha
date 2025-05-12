import React from 'react'
import { Star, Leaf, Users } from 'lucide-react'

export default function Statement() {
  return (
    <section className="relative bg-gradient-to-tr from-dark via-surface to-dark py-20 px-4 sm:px-6 lg:px-20 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold">
          About TASHN
        </h2>
        <p className="mt-4 text-lg sm:text-xl text-gray-400 leading-relaxed">
          Born for the bold and built for the streets, TASHN is more than a label—it’s a mindset. We blend cutting-edge silhouettes with unapologetic attitude, so every piece you wear is a statement of who you are.
        </p>
      </div>

      <div className="mt-16 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="flex flex-col items-center text-center">
          <div className="bg-white text-black rounded-full p-3 mb-4">
            <Star className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-lg">Bold Design</h3>
          <p className="mt-2 text-gray-400">
            Stand out in every room with fresh cuts and fearless styling.
          </p>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="bg-white text-black rounded-full p-3 mb-4">
            <Leaf className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-lg">Conscious Craft</h3>
          <p className="mt-2 text-gray-400">
            Premium fabrics, ethical practices—fashion you can feel good about.
          </p>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="bg-white text-black rounded-full p-3 mb-4">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-lg">Community First</h3>
          <p className="mt-2 text-gray-400">
            Built by and for street-style lovers. You bring the vibe—we bring the fit.
          </p>
        </div>
      </div>
    </section>
  )
}