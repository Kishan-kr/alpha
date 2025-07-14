const Product = require('../models/product');

const slugify = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')  // Replace spaces/special chars with -
    .replace(/^-+|-+$/g, '');     // Remove starting/ending hyphens
};


const generateUniqueSlug = async (title) => {
  const baseSlug = slugify(title);
  let slug = baseSlug;

  // Regex to match existing slugs starting with the baseSlug
  const regex = new RegExp(`^${baseSlug}(-\\d{8})?$`, 'i');

  const existingSlugs = await Product
    .find({ slug: regex })
    .select('slug')
    .lean();

  if (existingSlugs.length === 0) {
    return slug; // no duplicates, use baseSlug
  }

  // Extract numeric suffixes
  const suffixes = existingSlugs
    .map(doc => {
      const match = doc.slug.match(/-(\d{8})$/);
      return match ? parseInt(match[1], 10) : 0;
    });

  // Find max suffix and increment
  const maxSuffix = Math.max(...suffixes);
  const newSuffix = (maxSuffix + 1).toString().padStart(8, '0');

  return `${baseSlug}-${newSuffix}`;
};

module.exports = { generateUniqueSlug, slugify };