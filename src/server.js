const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { insertProduct, getProducts } = require('./database/products');
const { deleteProduct, updateProduct } = require('./database/products');

// defining the Express app
const app = express();

// configuring middleware on the Express app
app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('combined'));

// endpoint to return all ads
app.get('/', async (req, res) => {
  res.send(await getProducts());
});

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

module.exports = app;
