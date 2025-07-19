const User = require('../models/User');
const newsService = require('../services/newsService');

const getNews = async (req, res) => {
    try {
        const user = User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({
                error: 'User not found'
            });
        }

        const news = await newsService.fetchNewsByPreferences(user.preferences);
        
        res.status(200).json({
            news,
            totalArticles: news.length,
            userPreferences: user.preferences
        });
    } catch (error) {
        console.error('Get news error:', error);
        res.status(500).json({
            error: 'Failed to fetch news'
        });
    }
};

const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        User.markArticleAsRead(userId, id);

        res.status(200).json({
            message: 'Article marked as read',
            articleId: id
        });
    } catch (error) {
        console.error('Mark as read error:', error);
        res.status(500).json({
            error: 'Failed to mark article as read'
        });
    }
};

const markAsFavorite = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        User.markArticleAsFavorite(userId, id);

        res.status(200).json({
            message: 'Article marked as favorite',
            articleId: id
        });
    } catch (error) {
        console.error('Mark as favorite error:', error);
        res.status(500).json({
            error: 'Failed to mark article as favorite'
        });
    }
};

const getReadArticles = async (req, res) => {
    try {
        const userId = req.user.userId;
        const readArticleIds = User.getReadArticles(userId);

        res.status(200).json({
            readArticles: readArticleIds,
            count: readArticleIds.length
        });
    } catch (error) {
        console.error('Get read articles error:', error);
        res.status(500).json({
            error: 'Failed to fetch read articles'
        });
    }
};

const getFavoriteArticles = async (req, res) => {
    try {
        const userId = req.user.userId;
        const favoriteArticleIds = User.getFavoriteArticles(userId);

        res.status(200).json({
            favoriteArticles: favoriteArticleIds,
            count: favoriteArticleIds.length
        });
    } catch (error) {
        console.error('Get favorite articles error:', error);
        res.status(500).json({
            error: 'Failed to fetch favorite articles'
        });
    }
};

const searchNews = async (req, res) => {
    try {
        const { keyword } = req.params;
        
        if (!keyword || keyword.trim().length === 0) {
            return res.status(400).json({
                error: 'Search keyword is required'
            });
        }

        const news = await newsService.searchNews(keyword.trim());

        res.status(200).json({
            news,
            totalArticles: news.length,
            searchKeyword: keyword
        });
    } catch (error) {
        console.error('Search news error:', error);
        res.status(500).json({
            error: 'Failed to search news'
        });
    }
};

module.exports = {
    getNews,
    markAsRead,
    markAsFavorite,
    getReadArticles,
    getFavoriteArticles,
    searchNews
}; 