const bcrypt = require('bcrypt');

class User {
    constructor() {
        this.users = new Map(); // In-memory storage for users
        this.nextId = 1;
    }

    async create(userData) {
        const { name, email, password, preferences = [] } = userData;
        
        // Check if user already exists
        if (this.findByEmail(email)) {
            throw new Error('User already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = {
            id: this.nextId++,
            name,
            email,
            password: hashedPassword,
            preferences,
            readArticles: [],
            favoriteArticles: [],
            createdAt: new Date()
        };

        this.users.set(user.id, user);
        return this.sanitizeUser(user);
    }

    findByEmail(email) {
        for (const user of this.users.values()) {
            if (user.email === email) {
                return user;
            }
        }
        return null;
    }

    findById(id) {
        return this.users.get(id);
    }

    async validatePassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    updatePreferences(userId, preferences) {
        const user = this.users.get(userId);
        if (user) {
            user.preferences = preferences;
            return this.sanitizeUser(user);
        }
        return null;
    }

    markArticleAsRead(userId, articleId) {
        const user = this.users.get(userId);
        if (user && !user.readArticles.includes(articleId)) {
            user.readArticles.push(articleId);
        }
        return user;
    }

    markArticleAsFavorite(userId, articleId) {
        const user = this.users.get(userId);
        if (user && !user.favoriteArticles.includes(articleId)) {
            user.favoriteArticles.push(articleId);
        }
        return user;
    }

    getReadArticles(userId) {
        const user = this.users.get(userId);
        return user ? user.readArticles : [];
    }

    getFavoriteArticles(userId) {
        const user = this.users.get(userId);
        return user ? user.favoriteArticles : [];
    }

    // Remove password from user object
    sanitizeUser(user) {
        const { password, ...sanitizedUser } = user;
        return sanitizedUser;
    }
}

module.exports = new User(); 