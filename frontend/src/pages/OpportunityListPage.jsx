
import { useEffect, useState } from 'react';
import { getOpportunities } from '../api/opportunities.api';
import DataState from '../components/DataState';

export default function OpportunityListPage({ onViewDetail }) {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadData() {
      setLoading(true);
      setError('');

      try {
        const data = await getOpportunities();

        if (!Array.isArray(data)) {
          throw new Error('Dữ liệu API không hợp lệ');
        }

        if (active) {
          setOpportunities(data);
        }
      } catch (err) {
        if (active) {
          setError(err.message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, [retry]);

  return (
    <div>
      <h2>Danh sách cơ hội bán hàng</h2>

      <DataState
        loading={loading}
        error={error}
        empty={opportunities.length === 0}
        onRetry={() => setRetry(n => n + 1)}
      >
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Mã cơ hội</th>
              <th>Khách hàng</th>
              <th>Nhu cầu</th>
              <th>Giá trị dự kiến</th>
              <th>Giai đoạn</th>
              <th>Kết quả</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {opportunities.map(item => (
              <tr key={item.opportunity_id}>
                <td>{item.opportunity_id}</td>
                <td>{item.customer_id}</td>
                <td>{item.need_desc}</td>
                <td>
                  {Number(item.expected_value)
                    .toLocaleString('vi-VN')} đ
                </td>
                <td>{item.stage}</td>
                <td>{item.result ?? 'Chưa chốt'}</td>
                <td>
                  <button onClick={() => onViewDetail(item.opportunity_id)}>
                    Xem chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DataState>
    </div>
  );
}
