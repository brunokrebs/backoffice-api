const { getDatabase } = require('./mongo');
const { ObjectID } = require('mongodb');

async function insertProduct(product) {
  const database = await getDatabase();
  return await database
    // Currently returns a promise or so [object Object] - haven't checked it thoroughly.
    .create({ title: `${product}` });
}

async function getProducts() {
  const database = await getDatabase();
  return await database.find({});
}

async function deleteProduct(id) {
  const database = await getDatabase();
  await database.findOneAndRemove({
    _id: new ObjectID(id)
  });
}

async function updateProduct(id, product) {
  const database = await getDatabase();
  delete product._id;
  await database.findOneAndUpdate(
    { _id: new ObjectID(id) },
    {
      $set: {
        ...product
      }
    }
  );
}

module.exports = {
  insertProduct,
  getProducts,
  deleteProduct,
  updateProduct
};
