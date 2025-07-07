const mongoose = require('mongoose');

const LookbookVideoSchema = new mongoose.Schema({
  title: {
    type: String
  },
  videoUrl: {
    type: String,
    required: true, // URL to CDN
  },
  thumbnailUrl: {
    type: String, // Optional: for lazy-loading or preview
  },
  ctaText: {
    type: String, // e.g., "Shop Now"
  },
  ctaLink: {
    type: String, // URL to product or category
  },
  sortOrder: {
    type: Number,
    default: 0, // Lower value = higher priority
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

const LookbookVideo = mongoose.model('LookbookVideo', LookbookVideoSchema);
module.exports = LookbookVideo;