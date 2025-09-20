import React from "react";
import SizeSelectMenu from "./SizeSelector";
import { Link } from "react-router-dom";
import ResponsiveImage from "./ResponsiveImage";

export default function ProductCard({ product, handleSizeSelect }) {
  const {
    thumbnail,
    title,
    metaTitle,
    originalPrice,
    effectivePrice,
    sizes
  } = product

  const availableSizes = sizes?.filter(item => item.size && item.quantity > 0).map(item => item.size);

  return (
    <article
      className="h-full basis-36 max-w-50 grow shrink flex flex-col"
    >
      {/* Product Image */}
      {/* <Link
        to={`/products/${metaTitle}`}
        className="relative group bg-surface overflow-hidden aspect-[2/3] cursor-pointer">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover transition duration-1000 group-hover:scale-105"
        />
      </Link> */}

      <Link
        to={`/products/${metaTitle}`}
        className="relative group bg-surface overflow-hidden aspect-[2/3] cursor-pointer"
        aria-label={title}
      >
        <ResponsiveImage
          source={thumbnail}      // DB-stored single URL
          alt={title}
          className="w-full h-full object-cover transition duration-1000 group-hover:scale-105"
          variants={["thumb"]}    // strictly thumbnail only
          sizes="33vw"            // small card; override as you like
          defaultVariant="thumb"  // use the tiny file as <img src>
        />
      </Link>

      {/* Product Info */}
      <div className="h-fit flex justify-between mt-2">
        <div className='flex flex-col'>
          <Link
            to={`/products/${metaTitle}`}
            className="text-dark text-[10px] xxs:text-xs font-light uppercase cursor-pointer hover:underline"
          >
            {title}
          </Link>


          {/* Price */}
          <div className="mt-1 flex items-baseline space-x-2">
            {originalPrice !== effectivePrice ? (
              <>
                <span className="text-dark text-[10px] xxs:text-xs font-light uppercase line-through">
                  ₹ {originalPrice?.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
                <span className="text-dark bg-accent px-1 text-[10px] xxs:text-xs font-light uppercase">
                  ₹ {effectivePrice?.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </>
            ) : (
              <span className="text-dark text-[10px] xxs:text-xs font-light uppercase">
                ₹ {effectivePrice?.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            )}
          </div>
        </div>

        {/* add to bag button */}
        <SizeSelectMenu
          availableSizes={availableSizes}
          onChange={(size) => { handleSizeSelect(product, size) }}
        >
          <button className='bg-surface h-7 w-7 p-1 text-xl font-thin flex items-center justify-center hover:border-subtext cursor-pointer'>+</button>
        </SizeSelectMenu>
      </div>
    </article>
  );
}