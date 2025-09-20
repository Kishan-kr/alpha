const mongoose = require('mongoose');

const NewsletterSubscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // Prevent duplicate signups
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    trim: true
  },
  preferences: {
    gender: {
      type: String,
      enum: ['male', 'female', 'unisex'],
      default: 'unisex'
    },
    sizes: {
      type: [String], // Example: ['S', 'M', 'L']
      default: []
    },
    interests: {
      type: [String], // Example: ['summer collection', 'discounts']
      default: []
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      default: 'weekly'
    }
  },
  source: {
    type: String, // e.g., "homepage-signup", "checkout", "popup"
    default: 'homepage-signup'
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'unsubscribed', 'bounced'],
    default: 'active'
  },
  lastOpened: {
    type: Date
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields automatically
});

// Optional: Add indexes for performance
// NewsletterSubscriberSchema.index({ email: 1 });
// NewsletterSubscriberSchema.index({ status: 1 });
// NewsletterSubscriberSchema.index({ 'preferences.interests': 1 });

module.exports = mongoose.model('NewsletterSubscriber', NewsletterSubscriberSchema);