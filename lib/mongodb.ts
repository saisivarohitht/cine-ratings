import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.warn("MONGODB_URI is not set. Set it in .env.local to connect to your database.");
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!uri) {
  clientPromise = Promise.reject(new Error("Please define MONGODB_URI in .env.local"));
} else {
  if (process.env.NODE_ENV === 'development') {
    if (!(global as any)._mongoClientPromise) {
      client = new MongoClient(uri);
      (global as any)._mongoClientPromise = client.connect();
    }
    clientPromise = (global as any)._mongoClientPromise;
  } else {
    client = new MongoClient(uri);
    clientPromise = client.connect();
  }
}

export default clientPromise;
