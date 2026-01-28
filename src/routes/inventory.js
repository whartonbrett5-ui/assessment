const express = require("express");
const router = express.Router();
const VendingMachine = require("../models/VendingMachine");

// Initialize vending machine on startup
async function initializeVendingMachine() {
  try {
    let machine = await VendingMachine.findOne({ id: "vending-machine-1" });
    if (!machine) {
      machine = new VendingMachine({
        id: "vending-machine-1",
        coinsHeld: 0,
        inventory: {
          coke: 5,
          sprite: 5,
          fanta: 5,
        },
      });
      await machine.save();
    }
  } catch (error) {
    console.error("Error initializing vending machine:", error);
  }
}

// Initialize on import
initializeVendingMachine();

// PUT / - Accept coins and store them
router.put("/", async (req, res) => {
  try {
    const { coins } = req.body;

    // Validate coins input
    if (typeof coins !== "number" || coins < 0) {
      return res.status(400).json({ error: "Invalid coins amount" });
    }

    // Only accept quarters (coins must be in multiples of 1 quarter)
    if (!Number.isInteger(coins)) {
      return res
        .status(400)
        .json({ error: "Only US quarters accepted (1 quarter at a time)" });
    }

    let machine = await VendingMachine.findOne({ id: "vending-machine-1" });

    // Add coins to the machine
    machine.coinsHeld += coins;
    await machine.save();

    // Return accepted coins in header
    res.set("X-Coins", String(coins));
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE / - Return all coins to customer
router.delete("/", async (req, res) => {
  try {
    let machine = await VendingMachine.findOne({ id: "vending-machine-1" });

    const coinsReturned = machine.coinsHeld;
    machine.coinsHeld = 0;
    await machine.save();

    res.set("X-Coins", String(coinsReturned));
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET / - Get all inventory items
router.get("/", async (req, res) => {
  try {
    let machine = await VendingMachine.findOne({ id: "vending-machine-1" });

    const inventory = [
      machine.inventory.coke,
      machine.inventory.sprite,
      machine.inventory.fanta,
    ];

    res.status(200).json(inventory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /:id - Get remaining quantity for specific item
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const validIds = ["0", "1", "2"]; // Coke, Sprite, Fanta

    if (!validIds.includes(id)) {
      return res.status(400).json({
        error: "Invalid item ID. Use 0 (Coke), 1 (Sprite), or 2 (Fanta)",
      });
    }

    let machine = await VendingMachine.findOne({ id: "vending-machine-1" });

    const quantities = [
      machine.inventory.coke,
      machine.inventory.sprite,
      machine.inventory.fanta,
    ];
    const quantity = quantities[parseInt(id)];

    res.status(200).send(String(quantity));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /:id - Purchase an item
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const validIds = ["0", "1", "2"]; // Coke, Sprite, Fanta
    const beveragePrice = 2; // 2 quarters per beverage

    if (!validIds.includes(id)) {
      return res.status(400).json({
        error: "Invalid item ID. Use 0 (Coke), 1 (Sprite), or 2 (Fanta)",
      });
    }

    let machine = await VendingMachine.findOne({ id: "vending-machine-1" });

    // Check if machine has enough coins
    if (machine.coinsHeld < beveragePrice) {
      res.set("X-Coins", String(machine.coinsHeld));
      return res.status(404).json({
        error: "Insufficient funds",
        coinsNeeded: beveragePrice,
        coinsProvided: machine.coinsHeld,
      });
    }

    // Check if item is in stock
    const quantities = [
      machine.inventory.coke,
      machine.inventory.sprite,
      machine.inventory.fanta,
    ];
    const quantity = quantities[parseInt(id)];

    if (quantity <= 0) {
      res.set("X-Coins", String(machine.coinsHeld));
      return res.status(403).json({
        error: "Item out of stock",
      });
    }

    // Dispense beverage
    machine.coinsHeld -= beveragePrice;
    if (id === "0") {
      machine.inventory.coke -= 1;
    } else if (id === "1") {
      machine.inventory.sprite -= 1;
    } else if (id === "2") {
      machine.inventory.fanta -= 1;
    }
    await machine.save();

    const remainingQuantities = [
      machine.inventory.coke,
      machine.inventory.sprite,
      machine.inventory.fanta,
    ];

    res.set("X-Coins", String(machine.coinsHeld));
    res.status(200).json({
      quantity: remainingQuantities[parseInt(id)],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
