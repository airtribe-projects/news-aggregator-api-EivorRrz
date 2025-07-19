const axios = require('axios');
const NodeCache = require('node-cache');

class NewsService {
    constructor() {
        // Cache for 15 minutes (900 seconds)
        this.cache = new NodeCache({ stdTTL: 900 });
        this.newsApiKey = process.env.NEWS_API_KEY || 'demo-key';
        this.baseUrl = 'https://newsapi.org/v2';
        
        // Mock news data for demo purposes when API key is not available
        this.mockNews = [
            {
                id: '1',
                title: 'Breaking: Technology Advances in AI',
                description: 'Latest developments in artificial intelligence are reshaping industries.',
                url: 'https://example.com/news/1',
                urlToImage: 'https://via.placeholder.com/300x200',
                publishedAt: new Date().toISOString(),
                source: { name: 'Tech News' },
                category: 'technology'
            },
            {
                id: '2',
                title: 'Movie Industry Updates',
                description: 'Hollywood releases new blockbuster films this season.',
                url: 'https://example.com/news/2',
                urlToImage: 'https://via.placeholder.com/300x200',
                publishedAt: new Date().toISOString(),
                source: { name: 'Entertainment Weekly' },
                category: 'movies'
            },
            {
                id: '3',
                title: 'Sports Championship Results',
                description: 'Latest championship results and upcoming matches.',
                url: 'https://example.com/news/3',
                urlToImage: 'https://via.placeholder.com/300x200',
                publishedAt: new Date().toISOString(),
                source: { name: 'Sports Central' },
                category: 'sports'
            }
        ];
    }

    async fetchNewsByPreferences(preferences = []) {
        const cacheKey = `news_${preferences.sort().join('_')}`;
        
        // Check cache first
        const cachedNews = this.cache.get(cacheKey);
        if (cachedNews) {
            return cachedNews;
        }

        try {
            let news = [];
            
            if (this.newsApiKey === 'demo-key') {
                // Use mock data when no API key is provided
                news = this.mockNews.filter(article => 
                    preferences.length === 0 || 
                    preferences.some(pref => 
                        article.category.toLowerCase().includes(pref.toLowerCase()) ||
                        article.title.toLowerCase().includes(pref.toLowerCase())
                    )
                );
            } else {
                // Use real News API
                const categories = preferences.length > 0 ? preferences.join(',') : 'general';
                const response = await axios.get(`${this.baseUrl}/top-headlines`, {
                    params: {
                        apiKey: this.newsApiKey,
                        category: categories,
                        pageSize: 20,
                        country: 'us'
                    },
                    timeout: 5000
                });

                news = response.data.articles.map((article, index) => ({
                    id: `${Date.now()}_${index}`,
                    title: article.title,
                    description: article.description,
                    url: article.url,
                    urlToImage: article.urlToImage,
                    publishedAt: article.publishedAt,
                    source: article.source,
                    category: categories
                }));
            }

            // Cache the results
            this.cache.set(cacheKey, news);
            return news;

        } catch (error) {
            console.error('Error fetching news:', error.message);
            
            // Return mock data as fallback
            return this.mockNews.filter(article => 
                preferences.length === 0 || 
                preferences.some(pref => 
                    article.category.toLowerCase().includes(pref.toLowerCase()) ||
                    article.title.toLowerCase().includes(pref.toLowerCase())
                )
            );
        }
    }

    async searchNews(keyword) {
        const cacheKey = `search_${keyword}`;
        
        // Check cache first
        const cachedNews = this.cache.get(cacheKey);
        if (cachedNews) {
            return cachedNews;
        }

        try {
            let news = [];

            if (this.newsApiKey === 'demo-key') {
                // Use mock data for search
                news = this.mockNews.filter(article =>
                    article.title.toLowerCase().includes(keyword.toLowerCase()) ||
                    article.description.toLowerCase().includes(keyword.toLowerCase())
                );
            } else {
                // Use real News API search
                const response = await axios.get(`${this.baseUrl}/everything`, {
                    params: {
                        apiKey: this.newsApiKey,
                        q: keyword,
                        sortBy: 'publishedAt',
                        pageSize: 20
                    },
                    timeout: 5000
                });

                news = response.data.articles.map((article, index) => ({
                    id: `search_${Date.now()}_${index}`,
                    title: article.title,
                    description: article.description,
                    url: article.url,
                    urlToImage: article.urlToImage,
                    publishedAt: article.publishedAt,
                    source: article.source
                }));
            }

            // Cache the results
            this.cache.set(cacheKey, news);
            return news;

        } catch (error) {
            console.error('Error searching news:', error.message);
            
            // Return filtered mock data as fallback
            return this.mockNews.filter(article =>
                article.title.toLowerCase().includes(keyword.toLowerCase()) ||
                article.description.toLowerCase().includes(keyword.toLowerCase())
            );
        }
    }

    // Update cache periodically (simulate real-time updates)
    startPeriodicUpdate() {
        setInterval(() => {
            console.log('Updating news cache...');
            this.cache.flushAll(); // Clear cache to force fresh data
        }, 900000); // Update every 15 minutes
    }
}

module.exports = new NewsService(); 