import React from "react";

export default function ProductCard({ product }) {
  return (
    <article className="relative hover:shadow-md transition cursor-pointer">
      <figure className="w-full h-auto aspect-[4/5] overflow-hidden bg-surface rounded-lg group hover:scale-105 transition-transform duration-300 hover:outline-2 hover:outline-border">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-auto object-cover"
        />

        {product?.tags[0] && <span className="absolute top-4 left-2 px-1 text-[10px] bg-surface/20 border-s-1 border-surface uppercase text-dark">{product?.tags[0]}</span>}
      </figure>

      <figcaption className="px-3">
        <h3 className="mt-3 text-sm font-medium text-dark">{product.title}</h3>
        <p className="text-sm text-subtext mt-1">{product?.categoryId?.name}</p>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-dark font-semibold">₹{product?.discountedPrice || product.originalPrice}</p>
          {product.discountedPrice && product.originalPrice !== product.discountedPrice && (
            <p className="text-sm text-subtext line-through">₹{product.originalPrice}</p>
          )}
        </div>
      </figcaption>
    </article>
  );
}