const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const products = new Schema(
  {
    title: {
      type: String,
      trim: true
    }
  },
  { collection: 'products' }
);

products.index({ title: 1 }, { unique: true });

let productsModel = mongoose.model('Products', products);

module.exports = productsModel;
