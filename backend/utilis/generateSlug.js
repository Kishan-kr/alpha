function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')        // remove special chars except space & hyphen
    .replace(/[\s_-]+/g, '-')        // replace multiple spaces/underscores with single hyphen
    .replace(/^-+|-+$/g, '');        // remove leading/trailing hyphens
}

module.exports = generateSlug;