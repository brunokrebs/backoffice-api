const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const { disconnectFromDatabase } = require('../src/database/mongo');
const server = require('../src/server');
const { insertProduct } = require('../src/database/products');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient } = require('mongodb');
chai.use(chaiHttp);

let con;
let db;
let mongoServer;

describe('Products', () => {
  before(async () => {
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getConnectionString();
    con = await MongoClient.connect(mongoUri, { useNewUrlParser: true });
    db = con.db(await mongoServer.getDbName());
    process.env.MONGO_DB_URL = mongoUri;
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
      let title = { title: 'A new product' };
      chai
        .request(server)
        .post('/')
        .send(title)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
        });
    });
  });

  describe('/DELETE product', () => {
    it('it should delete a product', async () => {
      let product = await insertProduct({
        title: 'A product to be deleted actually.'
      });
      console.log(product);
      chai
        .request(server)
        .delete('/' + product)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Product removed.');
        });
    });
  });

  describe('/PUT product', () => {
    it('it should update a product', async () => {
      let product = await insertProduct({
        title: 'A product to be deleted actually.'
      });
      chai
        .request(server)
        .put('/' + product)
        .send({ title: 'Updated product' })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Product updated.');
        });
    });
  });

  after(async () => {
    if (con) con.close();
    if (mongoServer) await mongoServer.stop();
    await disconnectFromDatabase();
  });
});
