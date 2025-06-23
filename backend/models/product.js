const mongoose = require("mongoose")

const sizeSchema = new mongoose.Schema({
    size: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    restockTime: {
        type: String, // or Date, if you use exact time
        required: false,
    },
});

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: [2, 'Product name must be at least 2 characters'],
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"CATEGORY"
    },
    images: {
        type: [String],
        validate: [
            {
                validator: (val) => val.length >= 1 && val.length <= 5,
                message: 'Images must contain between 1 and 5 items',
            },
        ],
        required: true,
    },
    thumbnail: {
        type: String,
        required: true,
    },
    originalPrice: {
        type: Number,
        required: true,
        validate: {
            validator: function (value) {
                return value > 0;
            },
            message: 'Original price must be greater than 0',
        },
    },
    discountedPrice: {
        type: Number,
        required: true,
        validate: {
            validator: function (value) {
                return value > 0 && value < this.originalPrice;
            },
            message: 'Discount price must be greater than 0 and less than the original price',
        },
    },
    effectivePrice: { 
        type: Number 
    },
    sizes: {
        type: [sizeSchema],
        required: true,
        validate: {
            validator: function (val) {
                return val.length > 0;
            },
            message: 'At least one size is required',
        },
    },
    colors: {
        type: [String],
        required: true,
        validate: {
            validator: function (val) {
                return val.length > 0;
            },
            message: 'At least one color is required',
        },
    },
    tags: {
        type: [String],
        default: [],
    },
    description: {
        type: [String],
        required: true,
    },
    story: {
        type: String,
        required: true,
        minlength: [20, 'Story must have at least 20 characters'],
    },
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ADMIN"
    }
},
    {
        timestamps: true
    }
);

// ✅ Pre-save hook to compute effectivePrice
productSchema.pre('save', function (next) {
  this.effectivePrice = this.discountedPrice != null
    ? this.discountedPrice
    : this.originalPrice;
  next();
});


// ✅ Pre-update hook for findOneAndUpdate
productSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();

  const discount = update.discountedPrice ?? undefined;
  const original = update.originalPrice ?? undefined;

  if (discount != null || original != null) {
    update.effectivePrice = discount != null ? discount : original;
  }

  next();
});

// Helper function for image array limit
function arrayLimit(val) {
    return val.length <= 4;
}
const product = mongoose.model("PRODUCT", productSchema)
module.exports = product