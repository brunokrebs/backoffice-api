//importing the dependencies
const { connectToDatabase } = require('./database/mongo');

const server = require('./server');

// start the in-memory MongoDB instance
connectToDatabase().then(async () => {
  // start the server
  server.listen(3001, async () => {
    console.log('listening on port 3001');
  });
});
