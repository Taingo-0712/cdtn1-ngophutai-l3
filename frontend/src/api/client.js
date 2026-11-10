
export async function request(path, options = {}) {
  let response;

  try {
    response = await fetch(path, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(sessionStorage.getItem('access_token') ? { Authorization: `Bearer ${sessionStorage.getItem('access_token')}` } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error(
      'Không thể kết nối đến máy chủ. Vui lòng thử lại.'
    );
  }

  // Đọc nội dung trước để tránh parse JSON rỗng.
  const text = await response.text();
  let data = null;

  if (text.trim()) {
    try {
      data = JSON.parse(text);
    } catch {
      if (response.ok) {
        throw new Error('Dữ liệu API không hợp lệ.');
      }
    }
  }

  if (!response.ok) {
    if (data?.message === 'OPPORTUNITY_NOT_FOUND') {
      throw new Error('Không tìm thấy cơ hội bán hàng.');
    }

    if (data?.message === 'UNAUTHENTICATED') {
      throw new Error('Phiên đăng nhập không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.');
    }

    if (response.status >= 500) {
      throw new Error(
        'Máy chủ đang gặp lỗi hoặc không hoạt động.'
      );
    }

    throw new Error(
      data?.error?.message ||
      data?.message ||
      `Yêu cầu thất bại (HTTP ${response.status}).`
    );
  }

  return data;
}
