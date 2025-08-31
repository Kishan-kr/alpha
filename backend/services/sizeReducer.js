// controllers/Images/upload.js
const sharp = require('sharp');
const { uploadBufferToR2 } = require('./configR2');

const TARGETS = [
  { name: 'desktop_1800', long: 1800, qWebp: 80, qJpg: 80 },
  { name: 'listing_1200', long: 1200, qWebp: 80, qJpg: 80 },
  { name: 'phone_900',    long: 900,  qWebp: 75, qJpg: 75 },
  { name: 'thumb_600x900', width: 600, height: 900, qWebp: 75, qJpg: 75 },
];

// Map ext/mime safely (keeps original format)
function normalizeExtAndType(extRaw, mimeRaw) {
  const ext = String(extRaw || '').replace(/^\./, '').toLowerCase();
  const mime = String(mimeRaw || '').toLowerCase();

  // Prefer known combos from ext, otherwise from mime
  const table = {
    jpg:  'image/jpeg',
    jpeg: 'image/jpeg',
    png:  'image/png',
    webp: 'image/webp',
    avif: 'image/avif',
    heic: 'image/heic',
    heif: 'image/heif',
    gif:  'image/gif',
    tif:  'image/tiff',
    tiff: 'image/tiff',
  };

  if (ext && table[ext]) {
    return { ext: ext === 'jpeg' ? 'jpg' : ext, ctype: table[ext] };
  }

  // derive from mime
  const byMime = {
    'image/jpeg': 'jpg',
    'image/png':  'png',
    'image/webp': 'webp',
    'image/avif': 'avif',
    'image/heic': 'heic',
    'image/heif': 'heif',
    'image/gif':  'gif',
    'image/tiff': 'tif',
  };
  if (mime && byMime[mime]) {
    return { ext: byMime[mime], ctype: mime };
  }

  // last resort: keep it usable
  return { ext: 'jpg', ctype: 'image/jpeg' };
}

async function buildVariantSet(buffer, keyPrefix, origExt, origMime) {
  const base = sharp(buffer).rotate();
  const meta = await base.metadata();
  const portrait = (meta.height || 0) >= (meta.width || 0);

  const out = { variants: {}, original: null };

  for (const t of TARGETS) {
    let p = sharp(buffer).rotate().withMetadata(false);

    if (t.width && t.height) {
      // exact 600x900 crop
      p = p.resize(t.width, t.height, { fit: 'cover', position: 'attention' });
    } else if (t.long) {
      // scale by long edge (preserve aspect)
      p = portrait ? p.resize({ height: t.long }) : p.resize({ width: t.long });
    }

    const webpBuf = await p.clone().webp({ quality: t.qWebp }).toBuffer();
    const jpgBuf  = await p.clone().jpeg({ quality: t.qJpg, progressive: true, mozjpeg: true }).toBuffer();

    const webpKey = `${keyPrefix}/${t.name}.webp`;
    const jpgKey  = `${keyPrefix}/${t.name}.jpg`;

    const webpUrl = await uploadBufferToR2(webpBuf, webpKey, 'image/webp');
    const jpgUrl  = await uploadBufferToR2(jpgBuf,  jpgKey,  'image/jpeg');

    out.variants[t.name] = { webp: webpUrl, jpg: jpgUrl };
  }

  // Original: upload AS-IS (no rotate, no recompress)
  const { ext, ctype } = normalizeExtAndType(origExt, origMime);
  const originalKey = `${keyPrefix}/original.${ext}`;
  out.original = await uploadBufferToR2(buffer, originalKey, ctype);

  return out;
}

module.exports = { buildVariantSet };