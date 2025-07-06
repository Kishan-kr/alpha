import { Link } from 'react-router-dom';
import React from 'react';
import notFoundImage from '../assets/photos/404.png';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-background text-dark">
      <img src={notFoundImage} alt="404 illustration" className='w-80' />

      <h1 className="text-4xl font-bold mb-2">Whoops!</h1>
      <p className="text-subtext mb-6 max-w-md">
        This page is missing — but your next fire fit isn’t.
      </p>

      <Link
        to="/"
        className="relative inline-block mx-auto overflow-hidden py-3 px-6 text-sm font-semibold uppercase tracking-widest text-dark border border-light bg-light group enabled:cursor-pointer"
      >
        {/* Text */}
        <span className="relative z-10 transition-colors duration-300 group-hover:text-light">
          Let's take you home
        </span>

        {/* Sliding white panel */}
        <span className="absolute inset-0 bg-dark transform -translate-x-full transition-transform duration-300 group-hover:translate-x-0 z-0" />
      </Link>
    </div>
  );
}