const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017";

let client = null;
async function connectClientSingleton() {
  if (client) {
    return client;
  }

  client = new MongoClient(uri);
  await client.connect();
  return client;
}

async function connectToDatabase(client) {
  try {
    console.log("Connected to MongoDB");
    return client.db("bankDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

module.exports = {
  connectClientSingleton,
  connectToDatabase,
};
