const mongoose = require("mongoose");

const beverageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      enum: ["Coke", "Sprite", "Fanta"],
    },
    price: {
      type: Number,
      required: true,
      default: 2, // 2 US quarters = $0.50
    },
  },
  { _id: false }
);

const inventorySchema = new mongoose.Schema(
  {
    beverage: beverageSchema,
    quantity: {
      type: Number,
      required: true,
      default: 5, // Max 5 of each beverage
      min: 0,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Inventory", inventorySchema);
