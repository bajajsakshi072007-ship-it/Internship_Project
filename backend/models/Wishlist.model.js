const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Note: buyer index is already created implicitly via `unique: true` in the schema field.

const Wishlist = mongoose.model("Wishlist", wishlistSchema);

module.exports = Wishlist;
