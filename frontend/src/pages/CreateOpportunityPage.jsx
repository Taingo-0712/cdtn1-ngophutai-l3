import { useState } from 'react';
import { createOpportunity } from '../api/opportunities.api';

export default function CreateOpportunityPage({
  onCreated,
  onBack
}) {
  const [form, setForm] = useState({
    customer_id: '1',
    product_id: '1',
    owner_id: '1',
    need_desc: '',
    expected_value: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
        owner_id: Number(form.owner_id),
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
        <div>
          <label>Mã khách hàng</label>
          <input
            type="number"
            name="customer_id"
            min="1"
            required
            value={form.customer_id}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Mã sản phẩm</label>
          <input
            type="number"
            name="product_id"
            min="1"
            required
            value={form.product_id}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Mã nhân viên phụ trách</label>
          <input
            type="number"
            name="owner_id"
            min="1"
            required
            value={form.owner_id}
            onChange={handleChange}
          />
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

        <button type="submit" disabled={loading}>
          {loading ? 'Đang lưu...' : 'Lưu cơ hội'}
        </button>
      </form>
    </section>
  );
}
