const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const newsRoutes = require('./routes/news');

// Import middleware
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Import services
const newsService = require('./services/newsService');

const app = express();
const port = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        error: 'Too many requests from this IP, please try again later.'
    }
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API documentation endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'News Aggregator API',
        version: '1.0.0',
        author: 'Amit Mishra',
        endpoints: {
            authentication: {
                'POST /users/signup': 'Register a new user',
                'POST /users/login': 'Login user and get JWT token'
            },
            userPreferences: {
                'GET /users/preferences': 'Get user preferences (requires auth)',
                'PUT /users/preferences': 'Update user preferences (requires auth)'
            },
            news: {
                'GET /news': 'Get news based on user preferences (requires auth)',
                'GET /news/search/:keyword': 'Search news by keyword (requires auth)',
                'POST /news/:id/read': 'Mark article as read (requires auth)',
                'POST /news/:id/favorite': 'Mark article as favorite (requires auth)',
                'GET /news/read': 'Get read articles (requires auth)',
                'GET /news/favorites': 'Get favorite articles (requires auth)'
            }
        },
        usage: {
            authHeader: 'Authorization: Bearer <your-jwt-token>',
            contentType: 'Content-Type: application/json'
        }
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// API routes
app.use('/users', authRoutes);
app.use('/users', userRoutes);
app.use('/news', newsRoutes);

// 404 handler
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

// Start periodic news cache updates
newsService.startPeriodicUpdate();

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    process.exit(0);
});

app.listen(port, (err) => {
    if (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
    console.log(`🚀 News Aggregator API is running on port ${port}`);
    console.log(`📱 Health check: http://localhost:${port}/health`);
    console.log(`📖 API docs: http://localhost:${port}/`);
    console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;