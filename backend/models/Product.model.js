const mongoose = require("mongoose");
const { PRODUCT_CATEGORIES } = require("../utils/constants");

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Seller reference is required"],
    },
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [1, "Price must be greater than 0"],
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      enum: PRODUCT_CATEGORIES,
    },
    stock: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    images: {
      type: [imageSchema],
      validate: {
        validator: function (v) {
          return v.length <= 5;
        },
        message: "Maximum 5 images allowed per product",
      },
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    tags: [{ type: String, trim: true, lowercase: true }],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─────────────────────────────────────────
// Virtual: reviews from Review model
// ─────────────────────────────────────────
productSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
  justOne: false,
});

// ─────────────────────────────────────────
// Indexes for search and filter performance
// ─────────────────────────────────────────
productSchema.index({ title: "text", description: "text", tags: "text" });
productSchema.index({ category: 1 });
productSchema.index({ seller: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ isActive: 1 });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
