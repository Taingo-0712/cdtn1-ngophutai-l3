import { useEffect, useState } from 'react';
import {
  getOpportunityById,
  updateOpportunityStage
} from '../api/opportunities.api';
import DataState from '../components/DataState';
import OpportunityResult from '../components/OpportunityResult';

export default function OpportunityDetailPage({ id, onBack }) {
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadDetail() {
      setLoading(true);
      setError('');
      setOpportunity(null);

      try {
        const data = await getOpportunityById(id);

        if (!data || Array.isArray(data) || typeof data !== 'object') {
          throw new Error('Dữ liệu chi tiết không hợp lệ');
        }

        if (active) setOpportunity(data);
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDetail();

    return () => {
      active = false;
    };
  }, [id, retry]);

  const [updatingStage, setUpdatingStage] = useState(false);
  const [stageError, setStageError] = useState('');

  const stages = ['TIEP_CAN', 'TU_VAN', 'BAO_GIA', 'CHOT'];

  const stageNames = {
    TIEP_CAN: 'Tiếp cận',
    TU_VAN: 'Tư vấn',
    BAO_GIA: 'Báo giá',
    CHOT: 'Chốt'
  };

  const currentIndex = opportunity
    ? stages.indexOf(opportunity.stage)
    : -1;

  const nextStage = currentIndex >= 0 && currentIndex < stages.length - 1
    ? stages[currentIndex + 1]
    : null;

  async function handleStageChange() {
    if (!opportunity || !nextStage || updatingStage) return;

    setUpdatingStage(true);
    setStageError('');

    try {
      await updateOpportunityStage(
        opportunity.opportunity_id,
        nextStage
      );

      // Tải lại dữ liệu từ PostgreSQL qua Backend
      setRetry(n => n + 1);
    } catch (err) {
      setStageError(err.message);
    } finally {
      setUpdatingStage(false);
    }
  }

  return (
    <section>
      <button onClick={onBack}>← Quay lại danh sách</button>
      <h2>Chi tiết cơ hội bán hàng</h2>

      <DataState
        loading={loading}
        error={error}
        empty={!opportunity}
        onRetry={() => setRetry(n => n + 1)}
      >
        {opportunity && (
          <div>
            <p><strong>Mã cơ hội:</strong> {opportunity.opportunity_id}</p>
            <p><strong>Mã khách hàng:</strong> {opportunity.customer_id}</p>
            <p><strong>Mã sản phẩm:</strong> {opportunity.product_id}</p>
            <p><strong>Nhu cầu:</strong> {opportunity.need_desc}</p>
            <p>
              <strong>Giá trị dự kiến:</strong>{' '}
              {Number(opportunity.expected_value).toLocaleString('vi-VN')} đ
            </p>
            <p><strong>Giai đoạn:</strong> {opportunity.stage}</p>
            <p><strong>Kết quả:</strong> {opportunity.result ?? 'Chưa chốt'}</p>
            <p>
              <strong>Lý do thất bại:</strong>{' '}
              {opportunity.failure_reason ?? 'Không có'}
            </p>
            <div className="stage-transition">
              <h3>Chuyển giai đoạn</h3>

              <p>
                <strong>Hiện tại:</strong>{' '}
                {stageNames[opportunity.stage] || opportunity.stage}
              </p>

              {nextStage ? (
                <button
                  type="button"
                  onClick={handleStageChange}
                  disabled={updatingStage}
                >
                  {updatingStage
                    ? 'Đang cập nhật...'
                    : `Chuyển sang ${stageNames[nextStage]}`}
                </button>
              ) : (
                <p>Đã đến giai đoạn Chốt.</p>
              )}

              {stageError && (
                <p role="alert" style={{ color: '#dc2626' }}>
                  {stageError}
                </p>
              )}
            </div>
            <OpportunityResult
              opportunity={opportunity}
              onUpdated={() => setRetry(n => n + 1)}
            />
          </div>
        )}
      </DataState>
    </section>
  );
}
