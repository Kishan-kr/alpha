const mongoose = require("mongoose")

const testimonialSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  comment: {
    type: String,
    required: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  product: String,
  date: {
    type: Date,
    default: Date.now
  }
});

const Testimonials = mongoose.model("Testimonials", testimonialSchema)
module.exports = Testimonials;