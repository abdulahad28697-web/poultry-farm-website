import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDatabase() {
  if (!env.mongoUri) {
    throw new Error('MONGO_URI is not set. Add it to your .env file.');
  }

  await mongoose.connect(env.mongoUri);
  console.log('MongoDB connected successfully');
}
