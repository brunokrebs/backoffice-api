const chai = require('chai');
const chaiHttp = require('chai-http');
const {
  connectToDatabase,
  disconnectFromDatabase
} = require('../src/database/mongo');
const should = chai.should();
const server = require('../src/server');
const Product = require('../src/database/product.model');
const { MongoMemoryServer } = require('mongodb-memory-server');
chai.use(chaiHttp);

let mongoServer;

describe('Products', () => {
  before(async () => {
    mongoServer = new MongoMemoryServer({ binary: { systemBinary: '/usr/bin/mongod' } });
    const mongoUri = await mongoServer.getConnectionString();
    process.env.MONGO_DB_URL = mongoUri;

    await connectToDatabase();
  });

  describe('/GET Products', () => {
    it('it should GET all the products', () => {
      chai
        .request(server)
        .get('/')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
        });
    });
  });

  // Test the POST route
  describe('/POST Product', () => {
    it('it should POST a new product', () => {
      let product = { title: 'A new product' };
      chai
        .request(server)
        .post('/')
        .send(product)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.should.have.property('product').eql(product.title);
        });
    });
  });

  describe('/DELETE product', () => {
    it('it should delete a product', async () => {
      const product = new Product({
        title: 'A product to be deleted actually.'
      });
      chai
        .request(server)
        .delete('/' + product._id)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Product removed.');
        });
    });
  });

  describe('/PUT product', () => {
    it('it should update a product', async () => {
      const product = new Product({
        title: 'Wrong product.'
      });
      await product.save();
      chai
        .request(server)
        .put('/' + product._id)
        .send({ title: 'Updated product' })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Product updated.');
          res.body.should.have.property('updatedProduct').eql({ title: 'Updated product' });
        });
    });
  });

  after(async () => {
    await disconnectFromDatabase();
    await mongoServer.stop();
  });
});
