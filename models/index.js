const mongoose = require("mongoose");
// import { MongoMemoryServer } from 'mongodb-memory-server';
const Url = require("./url.model");

const connectDb = (databaseUrl = "") => {
  const url = databaseUrl || process.env.DATABASE_URL;
  console.log("🚀 ~ file: index.js ~ line 7 ~ connectDb ~ url", url);
  // console.log('DATABASE URL: ', url);
  return mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

const closetDB = async () => {
  // await mongoose.disconnect();
  await mongoose.connection.close();
};

const models = { Url };

module.exports = { models, connectDb, closetDB };
