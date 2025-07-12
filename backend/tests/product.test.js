// backend/tests/product.test.js (exemple très simple)
const request = require('supertest');
const app = require('../server'); // Assurez-vous que server.js exporte l'app Express
const mongoose = require('mongoose');
const Product = require('../models/Product');

beforeAll(async () => {
  // Connectez-vous à une base de données de test
  await mongoose.connect(process.env.MONGO_URI_TEST, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.connection.close();
});

afterEach(async () => {
  await Product.deleteMany({}); // Nettoyer après chaque test
});

describe('Product API', () => {
  it('should create a new product', async () => {
    const res = await request(app)
      .post('/api/products')
      .send({
        name: 'Test Product',
        price: 10.99,
        description: 'A test description',
        quantity: 50,
        category: 'Electronics'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.name).toBe('Test Product');
  });

  it('should fetch all products', async () => {
    await Product.create({ name: 'Product 1', price: 10, quantity: 10, category: 'A' });
    await Product.create({ name: 'Product 2', price: 20, quantity: 20, category: 'B' });

    const res = await request(app).get('/api/products');
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBe(2);
    expect(res.body[0].name).toBe('Product 1');
  });
});