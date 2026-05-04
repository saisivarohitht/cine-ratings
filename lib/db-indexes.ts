import clientPromise from './mongodb';

export async function setupDatabaseIndexes() {
  try {
    const client = await clientPromise;
    const db = client.db();

    // Create indexes for movies collection
    const moviesCollection = db.collection('movies');
    
    await Promise.all([
      moviesCollection.createIndex({ title: 'text' }),
      moviesCollection.createIndex({ genre: 1 }),
      moviesCollection.createIndex({ rating: 1 }),
      moviesCollection.createIndex({ year: 1 }),
      moviesCollection.createIndex({ _id: -1 }), // For sorting
    ]);

    // Create indexes for reviews collection
    const reviewsCollection = db.collection('reviews');
    
    await Promise.all([
      reviewsCollection.createIndex({ movieId: 1 }),
      reviewsCollection.createIndex({ createdAt: -1 }),
      reviewsCollection.createIndex({ rating: 1 }),
    ]);

    console.log('✓ Database indexes created successfully');
    return true;
  } catch (error) {
    console.error('Database indexing error:', error);
    // Don't throw - indexes are optional, app should still work
    return false;
  }
}
