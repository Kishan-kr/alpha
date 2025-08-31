// Image variant names.
export const VARIANT_NAMES = {
  thumb:   "thumb_600x900",
  phone:   "phone_900",
  listing: "listing_1200",
  desktop: "desktop_1800",
};

// Logical widths, used to build srcset entries:
export const VARIANT_WIDTHS = {
  thumb: 600,
  phone: 900,
  listing: 1200,
  desktop: 1800,
};

/**
 * Split an uploaded variant URL into { dir, filename, ext }.
 * Works with URLs like:
 *   https://cdn/products/<assetId>-<slug>/<variant>.<ext>?cache=...
 */
function splitUrl(anyUrl) {
  if (!anyUrl) return null;
  const clean = String(anyUrl).split(/[?#]/)[0]; // strip query/hash
  const lastSlash = clean.lastIndexOf("/");
  if (lastSlash < 0) return null;
  const dir = clean.slice(0, lastSlash);        // .../<assetId>-<slug>
  const filename = clean.slice(lastSlash + 1);  // e.g., listing_1200.jpg
  const dot = filename.lastIndexOf(".");
  const ext = dot >= 0 ? filename.slice(dot + 1).toLowerCase() : "";
  return { dir, filename, ext };
}

/**
 * Given any single stored URL (any variant/format), derive sibling URLs
 * for all variant names in both .webp and .jpg.*.
 */
export function deriveImageVariants(anyVariantUrl) {
  const parts = splitUrl(anyVariantUrl);
  if (!parts) return null;

  const { dir } = parts;
  const build = (name, ext) => `${dir}/${name}.${ext}`;

  const v = {
    webp: {
      [VARIANT_NAMES.thumb]:   build(VARIANT_NAMES.thumb,   "webp"),
      [VARIANT_NAMES.phone]:   build(VARIANT_NAMES.phone,   "webp"),
      [VARIANT_NAMES.listing]: build(VARIANT_NAMES.listing, "webp"),
      [VARIANT_NAMES.desktop]: build(VARIANT_NAMES.desktop, "webp"),
    },
    jpg: {
      [VARIANT_NAMES.thumb]:   build(VARIANT_NAMES.thumb,   "jpg"),
      [VARIANT_NAMES.phone]:   build(VARIANT_NAMES.phone,   "jpg"),
      [VARIANT_NAMES.listing]: build(VARIANT_NAMES.listing, "jpg"),
      [VARIANT_NAMES.desktop]: build(VARIANT_NAMES.desktop, "jpg"),
    },
    baseDir: dir,
  };

  return v;
}

/**
 * Build a srcset string for a given format ("webp" | "jpg")
 * and a list of variant keys in visual order, e.g. ["thumb","phone","listing","desktop"].
 */
export function buildSrcSet(variantsObj, format = "webp", order = ["thumb", "phone", "listing", "desktop"]) {
  if (!variantsObj) return "";

  const mapName = format === "webp" ? variantsObj.webp : variantsObj.jpg;

  const nameFor = (key) => {
    switch (key) {
      case "thumb":   return VARIANT_NAMES.thumb;
      case "phone":   return VARIANT_NAMES.phone;
      case "listing": return VARIANT_NAMES.listing;
      case "desktop": return VARIANT_NAMES.desktop;
      default:        return VARIANT_NAMES.listing;
    }
  };

  return order
    .map((k) => {
      const varName = nameFor(k);
      const url = mapName[varName];
      const w = VARIANT_WIDTHS[k] || 1200;
      return `${url} ${w}w`;
    })
    .join(", ");
}