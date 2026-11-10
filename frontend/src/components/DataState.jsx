export default function DataState({
  loading,
  error,
  empty,
  emptyMessage = 'Không có dữ liệu để hiển thị.',
  onRetry,
  children
}) {
  if (loading) {
    return <p>Đang tải dữ liệu...</p>;
  }

  if (error) {
    return (
      <div>
        <p style={{ color: 'red' }}>
          Lỗi: {error}
        </p>
        <button onClick={onRetry}>
          Thử lại
        </button>
      </div>
    );
  }

  if (empty) {
    return <p>{emptyMessage}</p>;
  }

  return children;
}
