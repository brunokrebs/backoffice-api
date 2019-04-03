const { MongoClient } = require('mongodb');

let connection = null;
let database = null;

async function connectToDatabase() {
  connection = await MongoClient.connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true
  });
  database = connection.db();
}

async function getDatabase() {
  if (!database) await connectToDatabase();
  return database;
}

async function disconnectFromDatabase() {
  if (connection) return await connection.close();
}

module.exports = {
  connectToDatabase,
  disconnectFromDatabase,
  getDatabase
};
