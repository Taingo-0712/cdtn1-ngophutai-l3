import { useEffect, useState } from 'react';
import { request } from '../api/client';
import { createOpportunity } from '../api/opportunities.api';

export default function CreateOpportunityPage({
  onCreated,
  onBack
}) {
  const [form, setForm] = useState({
    customer_id: '',
    product_id: '',
    need_desc: '',
    expected_value: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [references, setReferences] = useState({ customers: [], products: [] });
  const [referenceLoading, setReferenceLoading] = useState(true);
  const [referenceError, setReferenceError] = useState('');
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;
    setReferenceLoading(true); setReferenceError('');
    request('/api/opportunities/references')
      .then(data => { if (active) setReferences(data); })
      .catch(err => { if (active) setReferenceError(err.message); })
      .finally(() => { if (active) setReferenceLoading(false); });
    return () => { active = false; };
  }, [retry]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (loading) return;

    setError('');

    if (!form.need_desc.trim()) {
      setError('Vui lòng nhập nhu cầu khách hàng.');
      return;
    }

    if (
      form.expected_value === '' ||
      Number(form.expected_value) < 0
    ) {
      setError('Giá trị dự kiến phải từ 0 trở lên.');
      return;
    }

    setLoading(true);

    try {
      const data = await createOpportunity({
        customer_id: Number(form.customer_id),
        product_id: Number(form.product_id),
        need_desc: form.need_desc.trim(),
        expected_value: Number(form.expected_value),
      });

      onCreated(data.opportunity_id);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <button type="button" onClick={onBack}>
        ← Quay lại danh sách
      </button>

      <h2>Tạo cơ hội bán hàng</h2>

      <form onSubmit={handleSubmit}>
        {referenceLoading && <p>Đang tải khách hàng và sản phẩm...</p>}
        {referenceError && <p role="alert">{referenceError} <button type="button" onClick={() => setRetry(n => n + 1)}>Thử lại</button></p>}
        {!referenceLoading && !referenceError && (!references.customers.length || !references.products.length) && <p>Chưa có đủ khách hàng hoặc sản phẩm. Cần nạp dữ liệu mẫu.</p>}
        <div>
          <label htmlFor="customer_id">Khách hàng</label>
          <select id="customer_id" name="customer_id" required value={form.customer_id} onChange={handleChange} disabled={referenceLoading}>
            <option value="">-- Chọn khách hàng --</option>
            {references.customers.map(c => <option key={c.customer_id} value={c.customer_id}>{c.full_name} (KH{c.customer_id})</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="product_id">Sản phẩm</label>
          <select id="product_id" name="product_id" required value={form.product_id} onChange={handleChange} disabled={referenceLoading}>
            <option value="">-- Chọn sản phẩm --</option>
            {references.products.map(product => <option key={product.product_id} value={product.product_id}>{product.product_name} — {product.product_code}</option>)}
          </select>
        </div>

        <div>
          <label>Nhu cầu khách hàng</label>
          <textarea
            name="need_desc"
            maxLength="500"
            required
            value={form.need_desc}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Giá trị dự kiến (VND)</label>
          <input
            type="number"
            name="expected_value"
            min="0"
            step="1"
            required
            value={form.expected_value}
            onChange={handleChange}
          />
        </div>

        {error && (
          <p role="alert" style={{ color: 'red' }}>
            {error}
          </p>
        )}

        <button type="submit" disabled={loading || referenceLoading || !!referenceError || !form.customer_id || !form.product_id}>
          {loading ? 'Đang lưu...' : 'Lưu cơ hội'}
        </button>
      </form>
    </section>
  );
}
