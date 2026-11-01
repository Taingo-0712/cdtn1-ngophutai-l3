import { useEffect, useState } from 'react';
import { request } from '../api/client';
import DataState from './DataState';
const names = {TIEP_CAN:'Tiếp cận', TU_VAN:'Tư vấn', BAO_GIA:'Báo giá', CHOT:'Chốt'};
export default function OpportunityReport({ id, refresh = 0 }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const history = id != null;
  useEffect(() => {
    let active = true;
    setLoading(true); setError('');
    request(history ? `/api/opportunities/${id}/history` : '/api/opportunities/funnel')
      .then(data => { if (active) setRows(data); })
      .catch(err => { if (active) setError(err.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id, history, refresh, retry]);
  return <section>
    <h2>{history ? 'Lịch sử chuyển giai đoạn' : 'Phễu bán hàng của cửa hàng'}</h2>
    <button type="button" onClick={() => setRetry(n => n + 1)}>Tải lại</button>
    <DataState loading={loading} error={error} empty={rows.length === 0} onRetry={() => setRetry(n => n + 1)}>
      {history ? <table><thead><tr><th>Từ</th><th>Đến</th><th>Người thực hiện</th><th>Thời điểm</th></tr></thead>
        <tbody>{rows.map(row => <tr key={row.history_id}><td>{names[row.from_stage]}</td><td>{names[row.to_stage]}</td><td>{row.changed_by_name}</td><td>{new Date(row.changed_at).toLocaleString('vi-VN')}</td></tr>)}</tbody></table>
      : <><p>Tổng: {rows.reduce((sum,row) => sum + row.count,0)} cơ hội. Mỗi cơ hội được đếm ở giai đoạn hiện tại.</p>
        <table><thead><tr><th>Giai đoạn</th><th>Số cơ hội</th></tr></thead><tbody>{rows.map(row => <tr key={row.stage}><td>{names[row.stage]}</td><td>{row.count}</td></tr>)}</tbody></table></>}
    </DataState>
  </section>;
}
