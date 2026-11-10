import { useState } from 'react';
import { request } from '../api/client';
import { updateOpportunity } from '../api/opportunities.api';

const saveErrors = {
  INVALID_PRODUCT_ID: 'Sản phẩm không tồn tại hoặc đã ngừng sử dụng. Hãy chọn lại sản phẩm.',
  INVALID_NEED_DESC: 'Nhu cầu phải có từ 1 đến 500 ký tự.',
  INVALID_EXPECTED_VALUE: 'Giá trị dự kiến phải là số nguyên không âm, tối đa 15 chữ số.',
  OPPORTUNITY_FINALIZED: 'Cơ hội đã có kết quả và đã khóa chỉnh sửa.',
  OPPORTUNITY_NOT_FOUND: 'Không tìm thấy cơ hội trong phạm vi được phép.',
  FORBIDDEN: 'Tài khoản không có quyền sửa cơ hội này.',
};

export default function OpportunityEdit({ opportunity, onUpdated }) {
  const currentProductId = String(opportunity.product_id);
  const [form, setForm] = useState(null);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productError, setProductError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  async function loadProducts() {
    setLoadingProducts(true);
    setProductError('');
    try {
      const references = await request('/api/opportunities/references');
      setProducts(references.products);
    } catch (error) {
      setProductError(error.message);
    } finally {
      setLoadingProducts(false);
    }
  }

  function openForm() {
    setForm({
      product_id: currentProductId,
      need_desc: opportunity.need_desc,
      expected_value: String(opportunity.expected_value),
    });
    setSaveError('');
    loadProducts();
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm(previous => ({ ...previous, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (saving || loadingProducts || productError) return;

    setSaving(true);
    setSaveError('');
    try {
      const changes = {
        need_desc: form.need_desc.trim(),
        expected_value: Number(form.expected_value),
      };
      // Cơ hội cũ có thể tham chiếu sản phẩm đã ngừng sử dụng.
      if (form.product_id !== currentProductId) changes.product_id = form.product_id;
      await updateOpportunity(opportunity.opportunity_id, changes);
      setForm(null);
      onUpdated();
    } catch (error) {
      setSaveError(error.message);
      if (error.message === 'INVALID_PRODUCT_ID') loadProducts();
    } finally {
      setSaving(false);
    }
  }

  if (!form) {
    return <button type="button" onClick={openForm}>Sửa cơ hội</button>;
  }

  if (saveError === 'OPPORTUNITY_FINALIZED') {
    return (
      <div>
        <p role="alert">{saveErrors[saveError]}</p>
        <button type="button" onClick={onUpdated}>Tải lại chi tiết</button>
      </div>
    );
  }

  const hasCurrentProduct = products.some(product => String(product.product_id) === currentProductId);
  const hasSelectedProduct = form.product_id === currentProductId ||
    products.some(product => String(product.product_id) === form.product_id);

  return (
    <form onSubmit={handleSubmit}>
      <h3>Sửa cơ hội</h3>
      {loadingProducts && <p role="status">Đang tải danh mục sản phẩm...</p>}
      {productError && (
        <div>
          <p role="alert">{productError}</p>
          <button type="button" onClick={loadProducts}>Tải lại danh mục</button>
        </div>
      )}
      <label htmlFor="edit-product">Sản phẩm</label>
      <select
        id="edit-product"
        name="product_id"
        value={form.product_id}
        onChange={handleChange}
        disabled={saving || loadingProducts || !!productError}
        required
      >
        {!hasSelectedProduct && <option value={form.product_id} disabled>Sản phẩm vừa chọn không còn khả dụng</option>}
        {!hasCurrentProduct && (
          <option value={currentProductId}>
            {opportunity.product_name || `Sản phẩm #${currentProductId}`} (giữ sản phẩm hiện tại)
          </option>
        )}
        {products.map(product => (
          <option key={product.product_id} value={product.product_id}>
            {product.product_name} — {product.product_code}
          </option>
        ))}
      </select>
      <label htmlFor="edit-need">Nhu cầu khách hàng</label>
      <textarea id="edit-need" name="need_desc" value={form.need_desc} onChange={handleChange}
        maxLength={500} disabled={saving} required />
      <label htmlFor="edit-value">Giá trị dự kiến (VND)</label>
      <input id="edit-value" name="expected_value" type="number" value={form.expected_value}
        onChange={handleChange} min="0" max="999999999999999" step="1" disabled={saving} required />
      {saveError && <p role="alert">{saveErrors[saveError] || saveError}</p>}
      <div className="button-group">
        <button type="submit" disabled={saving || loadingProducts || !!productError || !hasSelectedProduct}>
          {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
        <button type="button" className="button-secondary" onClick={() => setForm(null)} disabled={saving || loadingProducts}>Hủy</button>
      </div>
    </form>
  );
}
