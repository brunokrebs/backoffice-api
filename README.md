## Running the Server

To run this server, you will need to set the `MONGO_DB_URL` environment variable. For example, if you have a MongoDB instance running locally and listening on port `27017`, you can run the server like this:

```bash
export MONGO_DB_URL=mongodb://localhost:27017/backoffice
npm start
```

## Running Tests

This project uses Mocha, Chai, Chai HTTP, and an in-memory MongoDB instance to run tests. To run these tests, you can simply run this command:

```bash
npm start
```
