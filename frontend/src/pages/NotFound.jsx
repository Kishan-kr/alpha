import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="bg-light px-6 py-28 mt-12 md:px-24">
      <div className="max-w-3xl mx-auto text-center">
        <div className="font-gfs-didot text-dark text-6xl md:text-8xl leading-none">
          404
        </div>

        <h1 className="mt-6 text-dark text-2xl md:text-3xl">
          page not found
        </h1>

        <p className="mt-3 text-subtext text-sm md:text-base">
          sorry, we can’t find the page you’re looking for.
        </p>

        <div className="mt-10">
          <Link
            to="/"
            className="uppercase text-xs px-6 py-2 border border-dark text-dark hover:bg-dark hover:text-light"
          >
            back to home
          </Link>
        </div>
      </div>
    </div>
  );
}