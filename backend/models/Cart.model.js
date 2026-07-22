const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1"],
      default: 1,
    },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
  },
  {
    timestamps: true,
  }
);

// ─────────────────────────────────────────
// Virtual: total items count
// ─────────────────────────────────────────
cartSchema.virtual("totalItems").get(function () {
  return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

cartSchema.index({ buyer: 1 });

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
