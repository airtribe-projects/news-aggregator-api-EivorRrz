const express = require('express');
const router = express.Router();
const { 
    getNews, 
    markAsRead, 
    markAsFavorite, 
    getReadArticles, 
    getFavoriteArticles, 
    searchNews 
} = require('../controllers/newsController');
const { authenticateToken } = require('../middleware/auth');

// Get news based on user preferences (protected route)
router.get('/', authenticateToken, getNews);

// Mark article as read (protected route)
router.post('/:id/read', authenticateToken, markAsRead);

// Mark article as favorite (protected route)
router.post('/:id/favorite', authenticateToken, markAsFavorite);

// Get read articles (protected route)
router.get('/read', authenticateToken, getReadArticles);

// Get favorite articles (protected route)
router.get('/favorites', authenticateToken, getFavoriteArticles);

// Search news (protected route)
router.get('/search/:keyword', authenticateToken, searchNews);

module.exports = router; 