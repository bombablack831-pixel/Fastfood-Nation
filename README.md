# MERN Food Delivery Application

A premium, full-stack food delivery platform with multi-role authentication, real-time tracking, and secure payments.

## Features

- 👤 **Multi-Role Auth**: Customer, Restaurant Owner, and Delivery Partner roles.
- 🍕 **Restaurant Management**: Owners can manage their menu and track active orders.
- 🛒 **Smart Cart**: Real-time cart calculation and item management.
- 💳 **Secure Payments**: Razorpay integration for seamless transactions.
- 📍 **Live Tracking**: Real-time delivery status and location tracking via Socket.io.
- 🎨 **Modern UI**: Built with Tailwind CSS, Framer Motion, and Lucide Icons.

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Socket.io-client, Axios, Framer Motion.
- **Backend**: Node.js, Express, MongoDB (Mongoose), Socket.io, JWT.
- **External**: Razorpay API, Google Maps API.

## Getting Started

### 1. Prerequisite
- MongoDB Atlas account.
- Razorpay account (Test mode).

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder:
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
CLIENT_URL=http://localhost:5173
```
Run with: `npm run dev` (Setup `nodemon` in package.json scripts).

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Structure
- `/backend`: Server logic, models, controllers, and routes.
- `/frontend`: React application, components, and pages.
