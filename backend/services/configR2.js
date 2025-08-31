const { S3Client, PutObjectCommand, DeleteObjectCommand, DeleteObjectsCommand } = require('@aws-sdk/client-s3');
const dotenv = require('dotenv');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

dotenv.config();

const r2 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

/**
 * Upload a file buffer to Cloudflare R2
 * @param {Buffer} buffer - File buffer
 * @param {string} originalname - Original file name (to get extension)
 * @param {string} prefix - Folder/prefix to prepend in key
 * @returns {Promise<string>} - Public URL
 */
const uploadToR2 = async (buffer, originalname, prefix = 'products/') => {
  const ext = path.extname(originalname);
  const key = `${prefix}${uuidv4()}${ext}`;

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: getMimeType(ext),
  });

  await r2.send(command);

  return `${process.env.CDN_URL}/${key}`;
};

const uploadBufferToR2 = async (buffer, key, contentType) => {
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    CacheControl: 'public, max-age=31536000, immutable',
  });
  await r2.send(command);
  return `${process.env.CDN_URL}/${key}`;
};

/**
 * Deletes a file from Cloudflare R2
 * @param {string} fileKey - The key (path) of the file inside the bucket
 *                          (e.g., "products/abc123.webp")
 * @returns {Promise<boolean>} - true if success, false if not found or error
 */
const deleteFromR2 = async (fileKey) => {
  try {
    await r2.send(new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: fileKey,
    }));
    return true;
  } catch (error) {
    console.error(`Failed to delete ${fileKey}:`, error.message);
    return false;
  }
};


/**
 * Deletes multiple files from R2 bucket
 * @param {string[]} keys - array of object keys (e.g., ['products/1.webp', 'products/2.webp'])
 * @returns {Promise<{ deleted: string[], errors: object[] }>}
 */
const deleteMultipleFromR2 = async (keys) => {
  if (!Array.isArray(keys) || keys.length === 0) {
    throw new Error('At least one key is required for deletion');
  }

  const command = new DeleteObjectsCommand({
    Bucket: process.env.R2_BUCKET,
    Delete: {
      Objects: keys.map((key) => ({ Key: key })),
      Quiet: false,
    },
  });

  try {
    const result = await r2.send(command);

    const deleted = result.Deleted?.map(obj => obj.Key) || [];
    const errors = result.Errors || [];

    return { deleted, errors };
  } catch (error) {
    console.error('Bulk delete failed:', error);
    throw error;
  }
};

const getMimeType = (ext) => {
  const map = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
  };
  return map[ext.toLowerCase()] || 'application/octet-stream';
};

const getFileKeyFromUrl = (url) => {
  const cdnPrefix = process.env.CDN_URL + '/';
  return url.startsWith(cdnPrefix) ? url.slice(cdnPrefix.length) : null;
};

module.exports = { r2, uploadToR2, deleteFromR2, deleteMultipleFromR2, getFileKeyFromUrl, uploadBufferToR2 };