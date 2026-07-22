const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Buyer reference is required"],
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product reference is required"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    comment: {
      type: String,
      required: [true, "Review comment is required"],
      trim: true,
      minlength: [5, "Comment must be at least 5 characters"],
      maxlength: [500, "Comment cannot exceed 500 characters"],
    },
  },
  {
    timestamps: true,
  }
);

// ─────────────────────────────────────────
// One review per buyer per product
// ─────────────────────────────────────────
reviewSchema.index({ buyer: 1, product: 1 }, { unique: true });

// ─────────────────────────────────────────
// Static: Recalculate product average rating
// ─────────────────────────────────────────
reviewSchema.statics.recalcRating = async function (productId) {
  const stats = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: "$product",
        avgRating: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  const Product = require("./Product.model");
  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      rating: Math.round(stats[0].avgRating * 10) / 10,
      numReviews: stats[0].count,
    });
  } else {
    await Product.findByIdAndUpdate(productId, { rating: 0, numReviews: 0 });
  }
};

// ─────────────────────────────────────────
// Post hooks to keep product rating updated
// ─────────────────────────────────────────
reviewSchema.post("save", function () {
  this.constructor.recalcRating(this.product);
});

reviewSchema.post("deleteOne", { document: true }, function () {
  this.constructor.recalcRating(this.product);
});

reviewSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await doc.constructor.recalcRating(doc.product);
  }
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
