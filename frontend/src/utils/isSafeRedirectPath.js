function isSafeRedirectPath(path) {
  try {
    // Ensure it is not an absolute URL
    if (!path || typeof path !== 'string') return false;
    if (path.startsWith('http://') || path.startsWith('https://')) return false;
    if (!path.startsWith('/')) return false; // must start with "/"
    return true;
  } catch {
    return false;
  }
}

export default isSafeRedirectPath;