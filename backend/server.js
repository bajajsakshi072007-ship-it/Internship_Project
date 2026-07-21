require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

const connectDB = require("./config/db");
const { generalLimiter, authLimiter } = require("./middlewares/rateLimiter.middleware");
const errorMiddleware = require("./middlewares/error.middleware");

// Route imports
const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const orderRoutes = require("./routes/order.routes");
const reviewRoutes = require("./routes/review.routes");
const cartRoutes = require("./routes/cart.routes");
const wishlistRoutes = require("./routes/wishlist.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const uploadRoutes = require("./routes/upload.routes");

// Connect to MongoDB
connectDB();

const app = express();

// ─────────────────────────────────────────
// Security Middlewares
// ─────────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Data sanitization against NoSQL injection
app.use(mongoSanitize());

// Data sanitization against XSS attacks
app.use(xss());

// ─────────────────────────────────────────
// Body Parser Middlewares
// ─────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ─────────────────────────────────────────
// Rate Limiting
// ─────────────────────────────────────────
app.use("/api/auth", authLimiter);
app.use("/api", generalLimiter);

// ─────────────────────────────────────────
// Health Check
// ─────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Rural Artisan Marketplace API is running",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "API is healthy", uptime: process.uptime() });
});

// ─────────────────────────────────────────
// API Routes
// ─────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/upload", uploadRoutes);

// ─────────────────────────────────────────
// 404 Handler
// ─────────────────────────────────────────
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ─────────────────────────────────────────
// Centralized Error Handler
// ─────────────────────────────────────────
app.use(errorMiddleware);

// ─────────────────────────────────────────
// Start Server
// ─────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`
  );
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});

module.exports = app;
