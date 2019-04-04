const mongoose = require('mongoose');

let connected = false;

async function connectToDatabase() {
  return new Promise(resolve => {
    mongoose.connect(process.env.MONGO_DB_URL, {
      useNewUrlParser: true
    });

    mongoose.connection.once('open', function() {
      connected = true;
      resolve();
    });
  });
}

async function disconnectFromDatabase() {
  if (connected) return await mongoose.disconnect();
}

module.exports = {
  connectToDatabase,
  disconnectFromDatabase
};
