# Vend-O-Matic Beverage Vending Machine API

A production-ready Express.js REST API for a beverage vending machine with MongoDB persistence using Mongoose.

## Project Overview

Vend-O-Matic is a beverage vending machine service that accepts US quarters, manages inventory for three beverages (Coke, Sprite, Fanta), and handles purchase transactions. The machine accepts coins, tracks inventory, and dispenses beverages based on customer input.

## Features

✅ **Coin Management** - Accept US quarters one at a time  
✅ **Inventory Tracking** - Manage 3 beverages with max 5 units each  
✅ **Purchase System** - 2 quarters per beverage  
✅ **Coin Dispensing** - Return unused coins via HTTP headers  
✅ **Error Handling** - Proper status codes for all scenarios  
✅ **MongoDB Persistence** - All data stored in MongoDB

## Project Structure

src/
├── models/
│ ├── User.js # User schema
│ ├── Inventory.js # Inventory schema
│ └── VendingMachine.js # Vending Machine schema
├── routes/
│ ├── users.js # User CRUD routes
│ └── inventory.js # Vending Machine API routes
├── server.js # Express app setup
.env # Environment variables
.env.example # Environment template
package.json # Dependencies
README.md # This file

## Setup Instructions

### 1. Install Dependencies

```bash
npm install

2. Configure Environment Variables
Create .env file from .env.example:

Update .env with your MongoDB connection

PORT=5000
MONGODB_URI=mongodb://localhost:27017/vend-o-matic
NODE_ENV=development

3. Start MongoDB
Ensure MongoDB is running:

mongod

Or use MongoDB Atlas (cloud):

MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vend-o-matic

4. Run the Server
Development mode (with auto-restart):
npm run dev

Production mode:
npm start

Server will run on http://localhost:5000

API Endpoints
Vending Machine API (/inventory)
1. PUT /inventory - Accept Coins
Insert US quarters into the machine (1 quarter at a time).

Request:

curl -X PUT http://localhost:5000/inventory \
  -H "Content-Type: application/json" \
  -d '{"coins": 1}'

  Response (204 No Content):

Header: X-Coins: 1

Constraint: Only accepts positive integers (quarters)

Response (204 No Content):

Header: X-Coins: 1

Constraint: Only accepts positive integers (quarters)

2. DELETE /inventory - Return All Coins
Dispense all coins held in the machine.

Request: curl -X DELETE http://localhost:5000/inventory

Response (204 No Content):

Header: X-Coins: [amount_returned]

3. GET /inventory - Get All Inventory
Retrieve quantities for all three beverages.

Request: curl http://localhost:5000/inventory

Response (200 OK):

[5, 5, 5]

Format: [coke_qty, sprite_qty, fanta_qty]

4. GET /inventory/:id - Get Item Quantity
Get remaining quantity for a specific beverage.

Item IDs:

0 = Coke
1 = Sprite
2 = Fanta

Request: curl http://localhost:5000/inventory/0

Response (200 OK): 5

Note: Returns plain integer, not JSON

5. PUT /inventory/:id - Purchase Beverage
Purchase a beverage (costs 2 quarters).

Request: curl -X PUT http://localhost:5000/inventory/0 \
  -H "Content-Type: application/json"

Success Response (200 OK):

  {
  "quantity": 4
}

Header: X-Coins: 0 (remaining coins after purchase)

Insufficient Funds (404 Not Found):

{
  "error": "Insufficient funds",
  "coinsNeeded": 2,
  "coinsProvided": 1
}

Header: X-Coins: 1 (coins returned)

Out of Stock (403 Forbidden):

{
  "error": "Item out of stock"
}

Header: X-Coins: [amount] (coins returned)

Vending Machine Constraints
✅ Machine only accepts US quarters (1 quarter at a time)
✅ Purchase price is 2 US quarters per beverage
✅ Machine holds max 5 of each beverage
✅ Machine accepts more coins than purchase price (change not given)
✅ Upon transaction completion, unused quarters are dispensed
✅ All interactions use application/json content type


Testing the API
Quick Test Sequence

# 1. Insert 2 quarters
curl -X PUT http://localhost:5000/inventory \
  -H "Content-Type: application/json" \
  -d '{"coins": 2}'

# 2. Check inventory (should be [5, 5, 5])
curl http://localhost:5000/inventory

# 3. Purchase Coke (id=0)
curl -X PUT http://localhost:5000/inventory/0 \
  -H "Content-Type: application/json"

# 4. Check inventory again (should be [4, 5, 5])
curl http://localhost:5000/inventory

# 5. Get Coke quantity (should be 4)
curl http://localhost:5000/inventory/0

# 6. Return coins
curl -X DELETE http://localhost:5000/inventory

Database
MongoDB Collections
VendingMachine Collection:

{
  "_id": ObjectId,
  "id": "vending-machine-1",
  "coinsHeld": 0,
  "inventory": {
    "coke": 5,
    "sprite": 5,
    "fanta": 5
  },
  "createdAt": ISODate,
  "updatedAt": ISODate
}

Initial Setup: Machine auto-initializes on first request with:

5 Cokes, 5 Sprites, 5 Fantas
0 coins held

Error Handling
Status Code	Scenario	Example
200	Successful purchase	Purchase completed
204	Successful transaction	Coins accepted/returned
400	Invalid input	Non-integer coins
403	Out of stock	No beverages available
404	Insufficient funds	Not enough coins
500	Server error	Database connection failure

Technologies Used
Express.js - Web framework
MongoDB - NoSQL database
Mongoose - MongoDB ODM
Nodemon - Auto-restart development server
Dotenv - Environment variable management

Dependencies
{
  "express": "^4.18.2",
  "mongoose": "^7.5.0",
  "dotenv": "^16.3.1",
  "nodemon": "^3.0.1"
}

Scripts
{
  "start": "node src/server.js",
  "dev": "nodemon src/server.js"
}

Environment Variables
{
PORT=5000                                              # Server port
MONGODB_URI=mongodb://localhost:27017/vend-o-matic    # MongoDB connection
NODE_ENV=development                                   # Environment mode
}

Notes
The Vending Machine auto-initializes on first startup
All coin values are in quarters
Inventory persists in MongoDB
Timestamps are tracked for all operations
Status: ✅ Production Ready
Created: January 2026
Assessment Project - Vend-O-Matic

```
