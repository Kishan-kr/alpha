import React from "react";
import { deriveImageVariants, buildSrcSet } from "../../utils/imageVariants";

/**
 * A reusable responsive image component.
 *
 * Props:
 * - source: string (the single URL stored in DB for this image or thumbnail)
 * - alt: string
 * - className: string
 * - variants: array of logical keys to include in srcset (default: ["phone","listing","desktop"])
 *             Use ["thumb"] for thumbnail-only, or ["thumb","listing"] for 1x/2x.
 * - sizes: string sizes attribute (default fits typical product cards)
 * - defaultVariant: which JPG to use as <img src> fallback ("listing" by default)
 */
export default function ResponsiveImage({
  source,
  alt = "",
  className = "",
  variants = ["phone", "listing", "desktop"],
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw",
  defaultVariant = "listing",
}) {
  const v = deriveImageVariants(source);

  // Graceful fallback
  if (!v) {
    return (
      <img
        src={source}
        alt={alt}
        className={className}
        loading="lazy"
        decoding="async"
        fetchPriority="low"
      />
    );
  }

  // Build srcsets from the format maps using the requested logical keys
  const webpSrcSet = buildSrcSet(v, "webp", variants);
  const jpgSrcSet  = buildSrcSet(v, "jpg",  variants);

  // Pick a sensible default <img src>
  const defaultMap = {
    thumb:   v.jpg["thumb_600x900"],
    phone:   v.jpg["phone_900"],
    listing: v.jpg["listing_1200"],
    desktop: v.jpg["desktop_1800"],
  };
  const imgSrc = defaultMap[defaultVariant] || defaultMap.listing;

  return (
    <picture>
      <source type="image/webp" srcSet={webpSrcSet} sizes={sizes} />
      <img
        src={imgSrc}
        srcSet={jpgSrcSet}
        sizes={sizes}
        alt={alt}
        className={className}
        loading="lazy"
        decoding="async"
        fetchPriority="low"
      />
    </picture>
  );
}