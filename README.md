# Express MongoDB Boilerplate

A simple Express.js boilerplate project with MongoDB and Mongoose setup.

## Project Structure

```
src/
├── models/
│   └── User.js          # Mongoose User schema
├── routes/
│   └── users.js         # User CRUD routes
├── server.js            # Express app setup and MongoDB connection
.env.example             # Environment variables template
package.json             # Project dependencies
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Update `.env` with your MongoDB URI:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/express-mongo-db
NODE_ENV=development
```

### 3. Start MongoDB

Make sure MongoDB is running on your system. For local development:

```bash
mongod
```

### 4. Run the Server

**Development mode** (with auto-restart):

```bash
npm run dev
```

**Production mode**:

```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Users

- `POST /api/users` - Create a new user
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Example API Requests

### Create a User

```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

### Get All Users

```bash
curl http://localhost:5000/api/users
```

### Get User by ID

```bash
curl http://localhost:5000/api/users/{USER_ID}
```

### Update User

```bash
curl -X PUT http://localhost:5000/api/users/{USER_ID} \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe"}'
```

### Delete User

```bash
curl -X DELETE http://localhost:5000/api/users/{USER_ID}
```

## Technologies Used

- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Nodemon** - Auto-restart development server
- **Dotenv** - Environment variable management

## Notes

- Passwords are stored in plain text (for development only). In production, use bcrypt or similar for hashing.
- The User model includes timestamps for `createdAt` and `updatedAt`.
- Email is unique and case-insensitive.
