//importing the dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const {startDatabase} = require('./database/mongo');
const {insertProduct, getProducts} = require('./database/products');
const {deleteProduct, updateProduct} = require('./database/products');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

// defining the Express app
const app = express();

// adding Helmet to enhance your API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests (not very secure)
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

// endpoint to return all ads
app.get('/', async (req, res) => {
    res.send(await getProducts());
});

const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://budul.auth0.com/.well-known/jwks.json`
    }),

    // Validate the audience and the issuer.
    audience: 'https://products-api',
    issuer: `https://budul.auth0.com/`,
    algorithms: ['RS256']
});

app.use(checkJwt);

app.post('/', async (req, res) => {
    const newProduct = req.body;
    await insertProduct(newProduct);
    res.send({ message: 'New product inserted.' });
});

// endpoint to delete a product
app.delete('/:id', async (req, res) => {
    await deleteProduct(req.params.id);
    res.send({ message: 'Product removed.' });
});

// endpoint to update a product
app.put('/:id', async (req, res) => {
    const updatedProduct = req.body;
    await updateProduct(req.params.id, updatedProduct);
    res.send({ message: 'Product updated.' });
});

// start the in-memory MongoDB instance
startDatabase().then(async () => {
    await insertProduct({title: 'Hello, now from the in-memory database!'});

    // start the server
    app.listen(3001, async () => {
        console.log('listening on port 3001');
    });
});