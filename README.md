# News Aggregator API

**Made by Amit Mishra**

A professional RESTful API for news aggregation with user authentication, personalized preferences, and external news API integration.

## 🚀 Features

- User Authentication with JWT tokens
- Password Security with bcrypt hashing
- Personalized news based on user preferences
- External news API integration with caching
- Article management (mark as read/favorite)
- Search functionality
- Input validation and error handling
- Security features (CORS, rate limiting, helmet)

## 🛠️ Quick Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   Copy `.env.example` to `.env` and configure:
   ```env
   PORT=3000
   JWT_SECRET=your-super-secret-jwt-key
   NEWS_API_KEY=your-api-key-here
   ```

3. **Start the server**
   ```bash
   npm start          # Production
   npm run dev        # Development
   npm test           # Run tests
   ```

## 📡 External News APIs

Choose from these supported news APIs (all require free registration):

| API | Free Tier Limit | URL |
|-----|-----------------|-----|
| **NewsAPI** | 100 requests/day | https://newsapi.org/ |
| **GNews API** | 100 requests/day | https://gnews.io/ |
| **NewsAPI.ai** | 2000 requests/month | https://newsapi.ai/ |
| **NewsCatcher News API** | Various tiers | https://newscatcherapi.com/ |

> **Note**: NewsAPI has a native Node.js library but it's unmaintained since 2018. This API consumes the REST endpoints directly using axios.

## 📚 API Endpoints

### Authentication
- `POST /users/signup` - Register user
- `POST /users/login` - Login user

### User Preferences
- `GET /users/preferences` - Get preferences (protected)
- `PUT /users/preferences` - Update preferences (protected)

### News
- `GET /news` - Get personalized news (protected)
- `GET /news/search/:keyword` - Search news (protected)
- `POST /news/:id/read` - Mark as read (protected)
- `POST /news/:id/favorite` - Mark as favorite (protected)
- `GET /news/read` - Get read articles (protected)
- `GET /news/favorites` - Get favorite articles (protected)

## 🔐 Authentication

Include JWT token in protected requests:
```bash
Authorization: Bearer <your-jwt-token>
```

## 🧪 Quick Test

```bash
# Register user
curl -X POST http://localhost:3000/users/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get news (use token from login response)
curl -X GET http://localhost:3000/news \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📁 Project Structure

```
├── controllers/     # Request handlers
├── middleware/      # Authentication & error handling
├── models/          # User data model
├── routes/          # API routes
├── services/        # News service & caching
├── utils/           # Validation utilities
├── test/            # Test files
└── app.js          # Main application
```

## 🔒 Security & Performance

- JWT authentication with 24h expiration
- Bcrypt password hashing
- Rate limiting (100 req/15min)
- Input validation with Joi
- In-memory caching (15min TTL)
- CORS and Helmet security headers

## 🎯 Health Check

```bash
curl http://localhost:3000/health
```

Visit `http://localhost:3000/` for full API documentation.

---

**Made by Amit Mishra** - Professional Backend Developer
