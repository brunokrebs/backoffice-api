const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const Product = require('./database/product.model');

// defining the Express app
const app = express();

// configuring middleware on the Express app
app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('combined'));

// endpoint to return all ads
app.get('/', async (req, res) => {
  res.send(await Product.find({}));
});

app.post('/', async (req, res) => {
  const newProduct = new Product(req.body);
  await newProduct.save();
  res.send({ message: 'New product inserted.', product: newProduct.title });
});

// endpoint to delete a product
app.delete('/:id', async (req, res) => {
  await Product.deleteOne({ _id: req.params.id });
  res.send({ message: 'Product removed.' });
});

// endpoint to update a product
app.put('/:id', async (req, res) => {
  try {
    await Product.updateOne(
      { _id: req.params.id },
      {
        $set: {
          ...req.body
        }
      }
    );
    res.send({ message: 'Product updated.' });
  } catch (err) {
    res.status(400).send({ error: 'Unable to update product' });
  }
});

module.exports = app;
