const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const database = require('./database/connection');
const drugRoutes = require('./routes/drugs');
const interactionRoutes = require('./routes/interactions');
const conditionRoutes = require('./routes/conditions');
const symptomRoutes = require('./routes/symptoms');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// CORS configuration
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Precious Drug Interaction Checker API is running',
        timestamp: new Date().toISOString()
    });
});

// API routes
app.use('/api/drugs', drugRoutes);
app.use('/api/interactions', interactionRoutes);
app.use('/api/conditions', conditionRoutes);
app.use('/api/symptoms', symptomRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    
    if (err.type === 'validation') {
        return res.status(400).json({
            error: 'Validation Error',
            message: err.message,
            details: err.details
        });
    }
    
    if (err.type === 'database') {
        return res.status(500).json({
            error: 'Database Error',
            message: 'An error occurred while accessing the database'
        });
    }
    
    res.status(500).json({
        error: 'Internal Server Error',
        message: 'Something went wrong on our end'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: 'The requested endpoint does not exist'
    });
});

// Initialize database and start server
async function startServer() {
    try {
        await database.connect();
        console.log('Database connected successfully');
        
        app.listen(PORT, () => {
            console.log(`🚀 Precious Drug Interaction Checker API running on port ${PORT}`);
            console.log(`📊 Health check: http://localhost:${PORT}/health`);
            console.log(`📚 API Base URL: http://localhost:${PORT}/api`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down server...');
    try {
        await database.close();
        console.log('Database connection closed');
        process.exit(0);
    } catch (error) {
        console.error('Error during shutdown:', error);
        process.exit(1);
    }
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
    try {
        await database.close();
        console.log('Database connection closed');
        process.exit(0);
    } catch (error) {
        console.error('Error during shutdown:', error);
        process.exit(1);
    }
});

startServer();
