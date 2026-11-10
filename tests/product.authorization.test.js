const test = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const auth = require('../src/services/auth.service');
const service = require('../src/services/product.service');
const router = require('../src/routes/product.routes');

test('San pham: xac thuc moi route, chi MANAGER duoc ghi', async t => {
  // Gia lap xac thuc va service: khong doc/ghi database that.
  t.mock.method(auth, 'authenticateToken', async token => {
    if (!['SALES', 'MANAGER'].includes(token)) throw new Error('UNAUTHENTICATED');
    return { user_id: 1, store_id: 1, role: token };
  });
  const product = { product_id: '10', product_code: 'DEMO10', product_name: 'San pham mo phong' };
  const routes = [
    ['GET', '', 'getAllProducts', 200, [product]],
    ['GET', '/10', 'getProductById', 200, product],
    ['POST', '', 'createProduct', 201, product],
    ['PATCH', '/10', 'updateProduct', 200, product],
    ['DELETE', '/10', 'deleteProduct', 200, product]
  ];
  const mocks = routes.map(([, , method, , result]) => t.mock.method(service, method, async () => result));
  const app = express();
  app.use(express.json());
  app.use('/api/products', router);
  const server = app.listen(0, '127.0.0.1');
  t.after(() => new Promise((resolve, reject) => server.close(err => err ? reject(err) : resolve())));
  await new Promise(resolve => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}/api/products`;

  for (const token of [undefined, 'INVALID', 'SALES', 'MANAGER']) {
    for (const [method, path, serviceMethod, success, result] of routes) {
      const before = mocks.map(mock => mock.mock.callCount());
      const response = await fetch(base + path, {
        method,
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        ...(['POST', 'PATCH'].includes(method) ? { body: JSON.stringify({ product_code: 'DEMO10', product_name: 'San pham mo phong' }) } : {})
      });
      const expected = !token || token === 'INVALID' ? 401 : method !== 'GET' && token === 'SALES' ? 403 : success;
      assert.equal(response.status, expected, `${method} ${path} ${token}`);
      assert.deepEqual(await response.json(), expected === 401 ? { message: 'UNAUTHENTICATED' } : expected === 403 ? { message: 'FORBIDDEN' } : result);
      for (let i = 0; i < mocks.length; i++) {
        const increment = expected < 400 && routes[i][2] === serviceMethod ? 1 : 0;
        assert.equal(mocks[i].mock.callCount(), before[i] + increment, 'Yeu cau bi chan khong duoc goi service');
      }
    }
  }
});
