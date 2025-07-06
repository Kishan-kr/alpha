import React from 'react'

/**
 * Props:
 *  - text: string to display
 *  - className?: additional Tailwind classes (e.g. text-center, text-4xl)
 *  - rOffset, gOffset, bOffset?: pixel offsets for each color layer
 */
export default function StaticRGBText({
  text,
  className = '',
  rOffset = { x: 2, y: 0 },
  gOffset = { x: -2, y: 0 },
  bOffset = { x: 0, y: 2 },
}) {
  // build the CSS translate property:
  const translateR = `translate(${rOffset.x}px,${rOffset.y}px)`;
  const translateG = `translate(${gOffset.x}px,${gOffset.y}px)`;
  const translateB = `translate(${bOffset.x}px,${bOffset.y}px)`;

  return (
    <div className={`relative inline-block ${className}`}>
      <span className="absolute top-0 left-0 text-red-500" style={{ transform: translateR }}>
        {text}
      </span>
      <span className="absolute top-0 left-0 text-green-500" style={{ transform: translateG }}>
        {text}
      </span>
      <span className="absolute top-0 left-0 text-blue-500" style={{ transform: translateB }}>
        {text}
      </span>
      <span className="relative top-0 left-0 text-dark">{text}</span>
    </div>
  )
}