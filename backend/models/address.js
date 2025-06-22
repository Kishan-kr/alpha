// Reusable sub-schema 
const mongoose = require('mongoose');
const { countries } = require('../utilis/enums');

const addressSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true
    },
    line1: {
      type: String,
      required: true
    },
    line2: {
      type: String
    },
    landmark: {
      type: String
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    country: {
      type: String,
      enum: countries,
      default: "India"
    },
    pincode: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required:true
    },
    isDefault: {
      type: Boolean,
      default: false
    }
  }
);

module.exports = addressSchema;