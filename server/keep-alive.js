const http = require('http');
const https = require('https');

// Configuration
const CONFIG = {
  // Your server URL - update this to your actual server URL
  SERVER_URL: process.env.SERVER_URL || 'http://localhost:5000',

  // Health check endpoint
  HEALTH_ENDPOINT: '/health',

  // Interval in milliseconds (14 minutes = 840000ms)
  // Most free hosting services sleep after 15 minutes of inactivity
  PING_INTERVAL: 14 * 60 * 1000,

  // Timeout for requests
  REQUEST_TIMEOUT: 30000,

  // Enable logging
  ENABLE_LOGGING: true
};

class KeepAlive {
  constructor(config = CONFIG) {
    this.config = config;
    this.isRunning = false;
    this.intervalId = null;
    this.requestCount = 0;
    this.successCount = 0;
    this.errorCount = 0;
  }

  log(message, type = 'info') {
    if (!this.config.ENABLE_LOGGING) return;

    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [KEEP-ALIVE]`;

    switch (type) {
      case 'error':
        console.error(`${prefix} ❌ ${message}`);
        break;
      case 'success':
        console.log(`${prefix} ✅ ${message}`);
        break;
      case 'warn':
        console.warn(`${prefix} ⚠️ ${message}`);
        break;
      default:
        console.log(`${prefix} ℹ️ ${message}`);
    }
  }

  async pingServer() {
    return new Promise((resolve, reject) => {
      const url = `${this.config.SERVER_URL}${this.config.HEALTH_ENDPOINT}`;
      const isHttps = url.startsWith('https://');
      const httpModule = isHttps ? https : http;

      this.requestCount++;
      this.log(`Pinging server (${this.requestCount}): ${url}`);

      const req = httpModule.get(url, { timeout: this.config.REQUEST_TIMEOUT }, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            this.successCount++;
            this.log(`Server responded: ${res.statusCode} - Success rate: ${((this.successCount/this.requestCount)*100).toFixed(1)}%`, 'success');
            resolve({ statusCode: res.statusCode, data });
          } else {
            this.errorCount++;
            this.log(`Server responded with error: ${res.statusCode}`, 'error');
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          }
        });
      });

      req.on('timeout', () => {
        this.errorCount++;
        this.log('Request timeout', 'error');
        req.destroy();
        reject(new Error('Request timeout'));
      });

      req.on('error', (err) => {
        this.errorCount++;
        this.log(`Request error: ${err.message}`, 'error');
        reject(err);
      });
    });
  }

  async performHealthCheck() {
    try {
      await this.pingServer();
    } catch (error) {
      this.log(`Health check failed: ${error.message}`, 'error');

      // If health endpoint fails, try the root endpoint
      try {
        const rootUrl = this.config.SERVER_URL;
        this.log(`Trying root endpoint: ${rootUrl}`, 'warn');

        const isHttps = rootUrl.startsWith('https://');
        const httpModule = isHttps ? https : http;

        await new Promise((resolve, reject) => {
          const req = httpModule.get(rootUrl, { timeout: this.config.REQUEST_TIMEOUT }, (res) => {
            this.log(`Root endpoint responded: ${res.statusCode}`, 'success');
            resolve();
          });

          req.on('error', reject);
          req.on('timeout', () => {
            req.destroy();
            reject(new Error('Root endpoint timeout'));
          });
        });

      } catch (rootError) {
        this.log(`Both health check and root endpoint failed: ${rootError.message}`, 'error');
      }
    }
  }

  start() {
    if (this.isRunning) {
      this.log('Keep-alive is already running', 'warn');
      return;
    }

    this.isRunning = true;
    this.log(`Starting keep-alive service for ${this.config.SERVER_URL}`);
    this.log(`Ping interval: ${this.config.PING_INTERVAL / 1000} seconds`);

    // Perform immediate health check
    this.performHealthCheck();

    // Set up recurring pings
    this.intervalId = setInterval(() => {
      this.performHealthCheck();
    }, this.config.PING_INTERVAL);

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      this.log('Received SIGINT, shutting down gracefully...');
      this.stop();
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      this.log('Received SIGTERM, shutting down gracefully...');
      this.stop();
      process.exit(0);
    });

    this.log('Keep-alive service started successfully');
  }

  stop() {
    if (!this.isRunning) {
      this.log('Keep-alive is not running', 'warn');
      return;
    }

    this.isRunning = false;

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.log(`Keep-alive service stopped. Stats: ${this.successCount}/${this.requestCount} successful pings`);
  }

  getStats() {
    return {
      isRunning: this.isRunning,
      requestCount: this.requestCount,
      successCount: this.successCount,
      errorCount: this.errorCount,
      successRate: this.requestCount > 0 ? (this.successCount / this.requestCount) * 100 : 0,
      uptime: process.uptime()
    };
  }
}

// Export for use as a module
module.exports = KeepAlive;

// If running directly, start the keep-alive service
if (require.main === module) {
  const keepAlive = new KeepAlive();
  keepAlive.start();

  // Log stats every hour
  setInterval(() => {
    const stats = keepAlive.getStats();
    console.log('\n=== KEEP-ALIVE STATS ===');
    console.log(`Status: ${stats.isRunning ? 'Running' : 'Stopped'}`);
    console.log(`Total Requests: ${stats.requestCount}`);
    console.log(`Successful: ${stats.successCount}`);
    console.log(`Failed: ${stats.errorCount}`);
    console.log(`Success Rate: ${stats.successRate.toFixed(1)}%`);
    console.log(`Uptime: ${(stats.uptime / 3600).toFixed(1)} hours`);
    console.log('========================\n');
  }, 60 * 60 * 1000); // Every hour
}