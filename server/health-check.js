// Simple health check endpoint for keep-alive monitoring
const express = require('express');

// Health check middleware that can be added to your existing server
const healthCheckMiddleware = (req, res, next) => {
  if (req.path === '/health') {
    const healthData = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      pid: process.pid,
      platform: process.platform,
      nodejs: process.version
    };

    res.status(200).json(healthData);
    return;
  }
  next();
};

// Standalone health check server (if you want to run separately)
const createHealthServer = (port = 3001) => {
  const app = express();

  app.get('/health', (req, res) => {
    const healthData = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      pid: process.pid,
      platform: process.platform,
      nodejs: process.version
    };

    console.log(`[${new Date().toISOString()}] Health check requested from ${req.ip}`);
    res.status(200).json(healthData);
  });

  app.get('/', (req, res) => {
    res.status(200).json({
      message: 'Health Check Server is running',
      endpoints: {
        health: '/health'
      }
    });
  });

  const server = app.listen(port, () => {
    console.log(`Health check server running on port ${port}`);
    console.log(`Health endpoint: http://localhost:${port}/health`);
  });

  return server;
};

module.exports = {
  healthCheckMiddleware,
  createHealthServer
};

// If running directly, start the standalone health server
if (require.main === module) {
  const port = process.env.HEALTH_PORT || 3001;
  createHealthServer(port);
}