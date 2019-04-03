const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const app= require('../src/index');
const { insertProduct } = require('../src/database/products');
chai.use(chaiHttp);

describe('Products', () => {
  // Test the GET route
  describe('/GET Products', () => {
    it('it should GET all the products', (done) => {
      chai.request(app)
        .get('/')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
         done();
        });
    });
  });

  // Test the POST route
  describe('/POST Product', () => {
    it('it should POST a new product', (done) => {
      let title = { title: 'A new product' };
      chai.request(app)
        .post('/')
        .send(title)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
         done();
        });
    });
  });

  describe('/DELETE product', () => {
    it('it should delete a product', async () => {
      let product = await insertProduct({ title: 'A product to be deleted actually.'});
      console.log(product);
      chai.request(app)
        .delete('/' + product)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Product removed.');
        });
    });
  });

  //  Test the PUT route
  describe('/PUT product', () => {
    it('it should update a product', async () => {
      let product = await insertProduct({ title: 'A product to be deleted actually.'})
      chai.request(app)
        .put('/' + product)
        .send({title: 'Updated product'})
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Product updated.');
        });
    });
  });
});
