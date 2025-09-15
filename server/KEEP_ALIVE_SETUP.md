# Keep-Alive Service Setup Guide

This guide explains how to set up a keep-alive service to prevent your server from going to sleep on free hosting platforms like Heroku, Render, Railway, etc.

## 🎯 What This Does

The keep-alive service automatically pings your server every 14 minutes to prevent it from sleeping due to inactivity. This is especially useful for free hosting tiers that put applications to sleep after 15-30 minutes of inactivity.

## 📁 Files Created

1. **`keep-alive.js`** - Main keep-alive service
2. **`health-check.js`** - Health check endpoint utilities
3. **`.env.example`** - Environment configuration template

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
cd /path/to/your/server
npm install concurrently
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Update these values in your `.env` file:
```env
# For local development
SERVER_URL=http://localhost:5000

# For production (replace with your actual URL)
SERVER_URL=https://your-app-name.herokuapp.com
# or
SERVER_URL=https://your-app-name.render.com
# or
SERVER_URL=https://your-app-name.railway.app
```

### 3. Available Scripts

Your `package.json` now includes these new scripts:

```bash
# Run just the keep-alive service
npm run keep-alive

# Run just the health check server
npm run health-check

# Run your main server WITH keep-alive service
npm run start-with-keepalive
```

## 🖥️ Usage Options

### Option 1: Run Server + Keep-Alive Together (Recommended)

```bash
npm run start-with-keepalive
```

This runs both your main server and the keep-alive service simultaneously.

### Option 2: Run Keep-Alive Separately

Terminal 1 (Main Server):
```bash
npm start
```

Terminal 2 (Keep-Alive):
```bash
npm run keep-alive
```

### Option 3: Standalone Keep-Alive

If you want to run keep-alive from a different machine/service:

```bash
SERVER_URL=https://your-app.herokuapp.com npm run keep-alive
```

## 🌐 Deployment Strategies

### For Heroku

1. Add the keep-alive service to your `Procfile`:
```
web: npm start
keepalive: npm run keep-alive
```

2. Or modify your start script in `package.json`:
```json
{
  "scripts": {
    "start": "concurrently \"node index.js\" \"node keep-alive.js\""
  }
}
```

### For Render/Railway/Other Platforms

Update your start command to:
```bash
npm run start-with-keepalive
```

### For VPS/Dedicated Servers

Use PM2 for production:

```bash
# Install PM2 globally
npm install -g pm2

# Start with PM2
pm2 start ecosystem.config.js
```

Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [
    {
      name: 'drug-interaction-api',
      script: 'index.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'keep-alive-service',
      script: 'keep-alive.js',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
```

## 🔧 Configuration Options

Edit `keep-alive.js` to customize:

```javascript
const CONFIG = {
  SERVER_URL: process.env.SERVER_URL || 'http://localhost:5000',
  HEALTH_ENDPOINT: '/health',
  PING_INTERVAL: 14 * 60 * 1000, // 14 minutes
  REQUEST_TIMEOUT: 30000,         // 30 seconds
  ENABLE_LOGGING: true
};
```

## 📊 Monitoring

The keep-alive service provides detailed logging:

```
[2024-01-15T10:30:00.000Z] [KEEP-ALIVE] ℹ️ Starting keep-alive service for https://your-app.herokuapp.com
[2024-01-15T10:30:00.100Z] [KEEP-ALIVE] ℹ️ Pinging server (1): https://your-app.herokuapp.com/health
[2024-01-15T10:30:00.500Z] [KEEP-ALIVE] ✅ Server responded: 200 - Success rate: 100.0%
```

Stats are logged every hour:
```
=== KEEP-ALIVE STATS ===
Status: Running
Total Requests: 120
Successful: 118
Failed: 2
Success Rate: 98.3%
Uptime: 24.5 hours
========================
```

## 🛠️ Troubleshooting

### Common Issues

1. **Connection Refused**: Check if your server URL is correct
2. **Timeout Errors**: Increase `REQUEST_TIMEOUT` in configuration
3. **High Failure Rate**: Check your server logs for issues

### Testing

Test the health endpoint manually:
```bash
curl https://your-app.herokuapp.com/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Precious Drug Interaction Checker API is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600.5
}
```

## 🎯 Benefits

- ✅ Prevents server sleep on free hosting tiers
- ✅ Automatic health monitoring
- ✅ Detailed logging and statistics
- ✅ Graceful error handling
- ✅ Zero impact on main application
- ✅ Easy to deploy and configure

## 🚨 Important Notes

1. **Free Tier Limitations**: Some platforms have monthly usage limits
2. **Cost Consideration**: Running 24/7 may exhaust free tier hours
3. **Alternative**: Consider upgrading to paid tier for always-on servers
4. **Backup Strategy**: For critical applications, use multiple keep-alive sources

## 📞 Support

If you encounter issues:
1. Check the logs for error messages
2. Verify your environment variables
3. Test the health endpoint manually
4. Ensure your server is responding correctly