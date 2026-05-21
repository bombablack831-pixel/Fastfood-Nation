require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const passport = require('passport');
const session = require('express-session');
const helmet = require('helmet');
// Note: express-mongo-sanitize is incompatible with Express 5 (req.query is read-only).
// Using a lightweight custom sanitizer for req.body instead.
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const AppError = require('./utils/appError');

// Passport Config
require('./config/passport')(passport);

const { initializeFirebase } = require('./config/firebase');

// Connect to Database
connectDB();

// Initialize Firebase
initializeFirebase();

const app = express();
const server = http.createServer(app);

// 1. Enable CORS (Must be at the TOP)
app.use(cors({
  origin: true, // Reflect origin (permissive for debugging)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'x-razorpay-signature']
}));

// 2. Set security HTTP headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// 4. Prevent parameter pollution
const hpp = require('hpp');
app.use(hpp({
  whitelist: [
    'price',
    'rating',
    'status',
    'category',
    'role'
  ]
}));

// GLOBAL MIDDLEWARES

// 2. Limit requests from same API
const limiter = rateLimit({
  max: 2000, // Increased for development
  windowMs: 15 * 60 * 1000, // 15 mins
  standardHeaders: true, 
  legacyHeaders: false,
  message: {
    status: 'fail',
    message: 'Too many requests from this IP, please try again in 15 minutes!'
  }
});
app.use('/api', limiter); // Apply globally to all /api routes

// 3. Body parsers
app.use(express.json({ limit: '50mb' })); // Increased for potential image uploads
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use((req, res, next) => {
  const sanitize = (obj) => {
    if (obj && typeof obj === 'object') {
      Object.keys(obj).forEach(key => {
        if (key.startsWith('$')) delete obj[key];
        else if (typeof obj[key] === 'object') sanitize(obj[key]);
      });
    }
  };
  
  if (req.body) sanitize(req.body);
  next();
});

// 7. Session for Passport

// Session for Passport
app.use(session({
  secret: process.env.JWT_SECRET || 'fallback_secret',
  resave: false,
  saveUninitialized: false
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => callback(null, true), // Allow all origins
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Make io accessible in controllers via req.app.get('io')
app.set('io', io);

// Socket Handlers
const orderTrackingHandler = require('./sockets/orderTracking');

io.on('connection', (socket) => {
  console.log('⚡ New client connected:', socket.id);

  // Initialize Handlers
  orderTrackingHandler(io, socket);

  // Generic/Legacy handlers can still live here or be moved
  socket.on('join_user', (userId) => {
    socket.join(userId.toString());
    console.log(`User ${userId} joined their personal notification room`);
  });

  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on('join_restaurant', (restaurantId) => {
    socket.join(`restaurant_${restaurantId}`);
    console.log(`Restaurant ${restaurantId} joined their order room`);
  });

  socket.on('send_message', async (data) => {
    const { room, sender, text } = data;
    try {
        const Message = require('./models/Message');
        const newMessage = await Message.create({ room, sender, text });
        io.to(room).emit('receive_message', newMessage);
    } catch (err) {
        console.error('Chat error:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

// Serve static files
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/restaurants', require('./routes/restaurantRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/coupons', require('./routes/couponRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/favorites', require('./routes/favoritesRoutes'));
app.use('/api/addresses', require('./routes/addressRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/wallet', require('./routes/walletRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));

app.get('/', (req, res) => {
  res.send('Food Delivery API is secured and running...');
});

// Global 404 Route Handler
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  const os = require('os');
  const networkInterfaces = os.networkInterfaces();
  let localIp = 'localhost';
  
  for (const interfaceName in networkInterfaces) {
    const interfaces = networkInterfaces[interfaceName];
    for (const iface of interfaces) {
      if (iface.family === 'IPv4' && !iface.internal) {
        localIp = iface.address;
        break;
      }
    }
  }

  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`Local Access: http://localhost:${PORT}`);
  console.log(`Network Access: http://${localIp}:${PORT}`);
});

