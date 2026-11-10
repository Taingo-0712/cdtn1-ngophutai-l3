import { useEffect, useRef, useState } from 'react';
import { createProduct, deactivateProduct, getProducts, updateProduct } from '../api/products.api';
import DataState from '../components/DataState';

const loadingList = { products: [], loading: true, error: '' };

const productErrors = {
  INVALID_PRODUCT_CODE: 'Mã sản phẩm phải có từ 1 đến 30 ký tự.',
  INVALID_PRODUCT_NAME: 'Tên sản phẩm phải có từ 1 đến 150 ký tự.',
  PRODUCT_CODE_EXISTS: 'Mã sản phẩm đã được sử dụng.',
  PRODUCT_NOT_FOUND: 'Sản phẩm không còn hoạt động hoặc không tồn tại. Hãy tải lại danh sách.',
  UNAUTHENTICATED: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.',
  FORBIDDEN: 'Tài khoản không có quyền thực hiện thao tác này.'
};

export default function ProductManagementPage({ onBack }) {
  const [list, setList] = useState(loadingList);
  const [reload, setReload] = useState(0);
  const [editor, setEditor] = useState(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [actionError, setActionError] = useState('');
  const [productToDeactivate, setProductToDeactivate] = useState(null);
  const confirmationDialog = useRef(null);

  useEffect(() => {
    let active = true;

    getProducts()
      .then(products => {
        if (active) setList({ products, loading: false, error: '' });
      })
      .catch(error => {
        if (active) {
          setList({
            products: [],
            loading: false,
            error: productErrors[error.message] ?? error.message
          });
        }
      });

    return () => { active = false; };
  }, [reload]);

  useEffect(() => {
    const dialog = confirmationDialog.current;
    if (productToDeactivate && !dialog.open) dialog.showModal();
  }, [productToDeactivate]);

  function reloadList() {
    setList(loadingList);
    setReload(current => current + 1);
  }

  function openEditor(product) {
    setNotice('');
    setActionError('');
    setEditor({
      id: product?.product_id ?? null,
      code: product?.product_code ?? '',
      name: product?.product_name ?? ''
    });
  }

  function closeEditor() {
    setEditor(null);
    setActionError('');
  }

  async function applyChange(change, successMessage) {
    setSaving(true);
    setNotice('');
    setActionError('');

    try {
      await change();
      setEditor(null);
      setNotice(successMessage);
      reloadList();
    } catch (error) {
      setActionError(productErrors[error.message] ?? error.message);
    } finally {
      setSaving(false);
    }
  }

  function saveProduct(event) {
    event.preventDefault();
    const data = { product_code: editor.code, product_name: editor.name };

    if (editor.id === null) {
      void applyChange(() => createProduct(data), 'Đã thêm sản phẩm.');
    } else {
      void applyChange(() => updateProduct(editor.id, data), 'Đã cập nhật sản phẩm.');
    }
  }

  function confirmDeactivation() {
    const dialog = confirmationDialog.current;
    if (!productToDeactivate || !dialog.open || saving) return;

    dialog.close();
    void applyChange(
      () => deactivateProduct(productToDeactivate.product_id),
      `Đã ngừng sử dụng “${productToDeactivate.product_name}”.`
    );
  }

  return (
    <section>
      <button type="button" onClick={onBack} disabled={saving}>← Quay lại cơ hội</button>
      <div className="page-heading">
        <h2>Quản lý sản phẩm</h2>
        <div className="button-group">
          <button type="button" onClick={() => openEditor()} disabled={saving || Boolean(editor)}>
            + Thêm sản phẩm
          </button>
          <button type="button" className="button-secondary" onClick={reloadList} disabled={saving || list.loading || Boolean(editor)}>
            Tải lại danh sách
          </button>
        </div>
      </div>

      {actionError && <p role="alert">{actionError}</p>}

      {editor && (
        <form onSubmit={saveProduct}>
          <h3>{editor.id === null ? 'Thêm sản phẩm' : 'Sửa sản phẩm'}</h3>
          <div>
            <label htmlFor="product-code">Mã sản phẩm</label>
            <input
              id="product-code"
              value={editor.code}
              onChange={event => setEditor({ ...editor, code: event.target.value })}
              required
              disabled={saving}
            />
          </div>
          <div>
            <label htmlFor="product-name">Tên sản phẩm</label>
            <input
              id="product-name"
              value={editor.name}
              onChange={event => setEditor({ ...editor, name: event.target.value })}
              required
              disabled={saving}
            />
          </div>
          <div className="button-group">
            <button type="submit" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu sản phẩm'}</button>
            <button type="button" className="button-secondary" onClick={closeEditor} disabled={saving}>Hủy</button>
          </div>
        </form>
      )}

      <h3>Sản phẩm đang hoạt động</h3>
      <p className="product-notice" role="status">
        {notice && <><span aria-hidden="true">✓</span>{notice}</>}
      </p>
      <DataState
        loading={list.loading}
        error={list.error}
        empty={list.products.length === 0}
        onRetry={reloadList}
      >
        <table>
          <thead>
            <tr>
              <th scope="col">Mã sản phẩm</th>
              <th scope="col">Tên sản phẩm</th>
              <th scope="col">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {list.products.map(product => (
              <tr key={product.product_id}>
                <td>{product.product_code}</td>
                <td>{product.product_name}</td>
                <td>
                  <div className="button-group">
                    <button type="button" onClick={() => openEditor(product)} disabled={saving || Boolean(editor)}>
                      Sửa
                    </button>
                    <button type="button" className="button-danger" onClick={() => setProductToDeactivate(product)} disabled={saving || Boolean(editor)}>
                      Ngừng sử dụng
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DataState>

      <dialog
        ref={confirmationDialog}
        className="product-dialog"
        aria-labelledby="product-dialog-title"
        aria-describedby="product-dialog-description"
        onClose={() => setProductToDeactivate(null)}
      >
        <span className="product-dialog-icon" aria-hidden="true">!</span>
        <h3 id="product-dialog-title">Ngừng sử dụng sản phẩm?</h3>
        <p id="product-dialog-description">
          <strong>{productToDeactivate?.product_name}</strong> sẽ được ẩn khỏi danh sách sản phẩm đang hoạt động.
        </p>
        <div className="button-group product-dialog-actions">
          <button type="button" className="button-secondary" onClick={() => confirmationDialog.current.close()}>Hủy</button>
          <button type="button" className="product-dialog-confirm" onClick={confirmDeactivation}>Ngừng sử dụng</button>
        </div>
      </dialog>
    </section>
  );
}
