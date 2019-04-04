const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true
    }
  },
  { collection: 'products' }
);

productSchema.index({ title: 1 }, { unique: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
