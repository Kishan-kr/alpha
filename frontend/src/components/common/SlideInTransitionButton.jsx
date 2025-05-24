import React from 'react';

export default function SlideInTransitionButton({
  children,
  icon = null,
  className = '',
  ...props
}) {
  return (
    <button
      className={`relative inline-block w-fit mx-auto overflow-hidden py-3 px-6 text-sm font-semibold uppercase tracking-widest text-white border border-white bg-dark group ${className}`}
      {...props}
    >
      {/* Text + Icon */}
      <span className="relative z-10 flex items-center transition-colors duration-300 group-hover:text-dark">
        {children}
        {icon && <span className="ml-2 transition group-hover:translate-x-2">{icon}</span>}
      </span>

      {/* Sliding white panel */}
      <span className="absolute inset-0 bg-white transform -translate-x-full transition-transform duration-300 group-hover:translate-x-0 z-0" />
    </button>
  );
}