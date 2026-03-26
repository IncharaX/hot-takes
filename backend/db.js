const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.DB_NAME || 'hottakeboard';

  if (!uri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  await mongoose.connect(uri, { dbName });
  console.log(`Connected to MongoDB (${dbName})`);
}

module.exports = { connectDB };