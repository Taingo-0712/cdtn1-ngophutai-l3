import { useState } from 'react';
import { updateOpportunityResult } from '../api/opportunities.api';

export default function OpportunityResult({ opportunity, onUpdated }) {
  const [result, setResult] = useState('THANH_CONG');
  const [failureReason, setFailureReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (opportunity.stage !== 'CHOT') {
    return null;
  }

  if (opportunity.result !== null) {
    return (
      <div className="opportunity-result">
        <h3>Kết quả chốt</h3>
        <p>
          <strong>Kết quả:</strong>{' '}
          {opportunity.result === 'THANH_CONG'
            ? 'Thành công'
            : 'Thất bại'}
        </p>

        {opportunity.failure_reason && (
          <p>
            <strong>Lý do thất bại:</strong>{' '}
            {opportunity.failure_reason}
          </p>
        )}
      </div>
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (loading) return;

    setError('');

    if (result === 'THAT_BAI' && !failureReason.trim()) {
      setError('Vui lòng nhập lý do thất bại.');
      return;
    }

    setLoading(true);

    try {
      await updateOpportunityResult(
        opportunity.opportunity_id,
        result,
        result === 'THAT_BAI' ? failureReason.trim() : null
      );

      onUpdated();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="opportunity-result">
      <h3>Ghi nhận kết quả chốt</h3>

      <form onSubmit={handleSubmit}>
        <label>Kết quả bán hàng</label>

        <select
          value={result}
          onChange={(e) => setResult(e.target.value)}
        >
          <option value="THANH_CONG">Thành công</option>
          <option value="THAT_BAI">Thất bại</option>
        </select>

        {result === 'THAT_BAI' && (
          <div>
            <label>Lý do thất bại</label>
            <textarea
              value={failureReason}
              onChange={(e) => setFailureReason(e.target.value)}
              placeholder="Nhập lý do khách không mua"
              required
            />
          </div>
        )}

        {error && (
          <p role="alert" style={{ color: 'red' }}>
            {error}
          </p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Đang lưu...' : 'Lưu kết quả chốt'}
        </button>
      </form>
    </div>
  );
}
