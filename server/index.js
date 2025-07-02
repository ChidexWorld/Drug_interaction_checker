const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

// Swagger setup

const database = require("./database/connection");
const drugRoutes = require("./routes/drugs");
const interactionRoutes = require("./routes/interactions");
const conditionRoutes = require("./routes/conditions");
const symptomRoutes = require("./routes/symptoms");
const swaggerJSDoc = require("swagger-jsdoc");
// Swagger definition
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Precious Drug Interaction Checker API",
    version: "1.0.0",
    description: "API documentation for the Precious Drug Interaction Checker",
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT || 5000}`,
      description: "Local server",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./routes/*.js"], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);

const app = express();
const PORT = process.env.PORT || 5000;
// Serve Swagger docs (after app is declared)
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Security middleware
app.use(helmet());

// CORS configuration
const allowedOrigin =
  process.env.NODE_ENV === "production" ? process.env.CLIENT_URL : true;
app.use(
  cors({
    origin: true, // Allow all origins in production
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Precious Drug Interaction Checker API is running",
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use("/api/drugs", drugRoutes);
app.use("/api/interactions", interactionRoutes);
app.use("/api/conditions", conditionRoutes);
app.use("/api/symptoms", symptomRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);

  if (err.type === "validation") {
    return res.status(400).json({
      error: "Validation Error",
      message: err.message,
      details: err.details,
    });
  }

  if (err.type === "database") {
    return res.status(500).json({
      error: "Database Error",
      message: "An error occurred while accessing the database",
    });
  }

  res.status(500).json({
    error: "Internal Server Error",
    message: "Something went wrong on our end",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: "The requested endpoint does not exist",
  });
});

// Initialize database and start server
async function startServer() {
  try {
    await database.connect();
    console.log("Database connected successfully");

    app.listen(PORT, () => {
      console.log(
        `🚀 Precious Drug Interaction Checker API running on port ${PORT}`
      );
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`📚 API Base URL: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down server...");
  try {
    await database.close();
    console.log("Database connection closed");
    process.exit(0);
  } catch (error) {
    console.error("Error during shutdown:", error);
    process.exit(1);
  }
});

process.on("SIGTERM", async () => {
  console.log("\n🛑 Received SIGTERM, shutting down gracefully...");
  try {
    await database.close();
    console.log("Database connection closed");
    process.exit(0);
  } catch (error) {
    console.error("Error during shutdown:", error);
    process.exit(1);
  }
});

startServer();
