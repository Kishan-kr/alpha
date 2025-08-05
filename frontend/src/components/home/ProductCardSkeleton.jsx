import React from "react";

const ProductCardSkeleton = () => {
  return (
    <article className="h-full basis-52 mx-auto max-w-60 grow shrink flex flex-col animate-pulse">
      {/* Image Placeholder */}
      <div className="relative bg-surface aspect-[2/3] w-full" />

      {/* Info Placeholder */}
      <div className="h-fit flex justify-between mt-2 w-full">
        <div className="flex flex-col space-y-2 w-4/5">
          {/* Title */}
          <div className="h-3 w-4/5 bg-surface" />

          {/* Price */}
          <div className="flex space-x-2 mt-1">
            <div className="h-3 w-24 bg-surface" />
          </div>
        </div>

        {/* Button Placeholder */}
        <div className="h-7 w-7 bg-surface" />
      </div>
    </article>
  );
};

export default ProductCardSkeleton;