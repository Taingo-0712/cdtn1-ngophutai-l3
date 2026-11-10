import { request } from './client';

export async function getProducts() {
  const products = await request('/api/products');
  if (!Array.isArray(products)) {
    throw new Error('Danh sách sản phẩm trả về không hợp lệ.');
  }
  return products;
}

export function createProduct(product) {
  return request('/api/products', {
    method: 'POST',
    body: JSON.stringify(product)
  });
}

export function updateProduct(id, product) {
  return request(`/api/products/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(product)
  });
}

export function deactivateProduct(id) {
  return request(`/api/products/${id}`, { method: 'DELETE' });
}
