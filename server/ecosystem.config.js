// PM2 configuration for production deployment
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
        NODE_ENV: 'development',
        PORT: 5000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: process.env.PORT || 5000
      },
      error_file: './logs/api-error.log',
      out_file: './logs/api-out.log',
      log_file: './logs/api-combined.log',
      time: true
    },
    {
      name: 'keep-alive-service',
      script: 'keep-alive.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'development',
        SERVER_URL: 'http://localhost:5000'
      },
      env_production: {
        NODE_ENV: 'production',
        SERVER_URL: process.env.SERVER_URL || 'http://localhost:5000'
      },
      error_file: './logs/keepalive-error.log',
      out_file: './logs/keepalive-out.log',
      log_file: './logs/keepalive-combined.log',
      time: true
    }
  ],

  // Deployment configuration
  deploy: {
    production: {
      user: 'node',
      host: 'your-server.com',
      ref: 'origin/main',
      repo: 'git@github.com:your-username/drug-interaction-checker.git',
      path: '/var/www/production',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};