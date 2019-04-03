const MongoClient = require('mongoose');
const productsDb = require('./product.model');
let connection = null;
let database = productsDb;

async function connectToDatabase() {
  connection = await MongoClient.connect(
    'mongodb://localhost:27017/backoffice',
    {
      useNewUrlParser: true,
      useCreateIndex: true
    }
  );
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
