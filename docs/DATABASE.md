# Database Setup Guide

## Indexes

Indexes improve query performance for frequently searched fields. They are automatically created on first app startup.

### Automatic Index Creation

Indexes are created automatically when the app initializes. No manual setup required.

### Manual Index Creation

If you need to manually create indexes, run this in MongoDB shell or use MongoDB Atlas UI:

```javascript
// Movies collection
db.movies.createIndex({ title: "text" })
db.movies.createIndex({ genre: 1 })
db.movies.createIndex({ rating: 1 })
db.movies.createIndex({ year: 1 })
db.movies.createIndex({ _id: -1 })

// Reviews collection
db.reviews.createIndex({ movieId: 1 })
db.reviews.createIndex({ createdAt: -1 })
db.reviews.createIndex({ rating: 1 })
```

### Verifying Indexes

List all indexes:
```javascript
db.movies.getIndexes()
db.reviews.getIndexes()
```

## Pagination

The API now supports pagination:

```bash
GET /api/movies?page=1&limit=12
```

Response:
```json
{
  "movies": [...],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 24,
    "totalPages": 2
  }
}
```

Parameters:
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 12, max: 100)
