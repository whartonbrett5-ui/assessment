const mongoose = require("mongoose");

const vendingMachineSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      default: "vending-machine-1",
    },
    coinsHeld: {
      type: Number,
      required: true,
      default: 0, // Number of quarters held in the machine
    },
    inventory: {
      coke: {
        type: Number,
        required: true,
        default: 5,
        min: 0,
        max: 5,
      },
      sprite: {
        type: Number,
        required: true,
        default: 5,
        min: 0,
        max: 5,
      },
      fanta: {
        type: Number,
        required: true,
        default: 5,
        min: 0,
        max: 5,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("VendingMachine", vendingMachineSchema);
