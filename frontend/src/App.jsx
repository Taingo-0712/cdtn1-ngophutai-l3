import './App.css';
import OpportunityReport from './components/OpportunityReport';
import { request } from './api/client';
import { useState } from 'react';
import OpportunityListPage from './pages/OpportunityListPage';
import OpportunityDetailPage from './pages/OpportunityDetailPage';
import CreateOpportunityPage from './pages/CreateOpportunityPage';
import ProductManagementPage from './pages/ProductManagementPage';

function App() {
  const [account, setAccount] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [busy, setBusy] = useState(false);
  const [page, setPage] = useState('list');
  const [selectedId, setSelectedId] = useState(null);

  function viewDetail(id) {
    setSelectedId(id);
    setPage('detail');
  }

  function showList() {
    setSelectedId(null);
    setPage('list');
  }

  async function login(event) {
    event.preventDefault();
    setBusy(true); setLoginError('');
    try {
      const data = await request('/api/auth/login', {
        method: 'POST', body: JSON.stringify({ username, password })
      });
      sessionStorage.setItem('access_token', data.access_token);
      setAccount(data.user); setPassword(''); setPage('list');
    } catch (error) { setLoginError(error.message); }
    finally { setBusy(false); }
  }

  if (!account) return (
    <main className="login-screen">
      <div className="login-card">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">MM</span>
          <div><strong>Mekong Mobile</strong><span>Smart CRM</span></div>
        </div>
        <h1>Đăng nhập</h1>
        <p>Đăng nhập để vào không gian quản lý bán hàng.</p>
        <form onSubmit={login}>
          <label>Tên đăng nhập<input required autoComplete="username" value={username} onChange={e => setUsername(e.target.value)} /></label>
          <label>Mật khẩu<input required type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} /></label>
          {loginError && <p role="alert">{loginError}</p>}
          <button disabled={busy}>{busy ? 'Đang đăng nhập...' : 'Đăng nhập'}</button>
        </form>
      </div>
    </main>
  );

  return (
    <div className="crm-shell">
      <header className="crm-header">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">MM</span>
          <div><strong>Mekong Mobile</strong><span>Smart CRM</span></div>
        </div>
        <div className="account-bar">
          <div className="account-name">
            <strong>{account.full_name}</strong>
            <span>{account.role === 'MANAGER' ? 'Quản lý cửa hàng' : 'Nhân viên bán hàng'}</span>
          </div>
          <button type="button" className="sign-out" onClick={() => { sessionStorage.removeItem('access_token'); setAccount(null); }}>
            Đăng xuất
          </button>
        </div>
      </header>

      <main className="crm-main">
        <div className="workspace-heading">
          <div>
            <p className="workspace-kicker">Không gian bán hàng</p>
            <h1>Cơ hội bán hàng</h1>
            {page === 'list' && <p>Theo dõi nhu cầu khách hàng, tiến độ tư vấn và kết quả chốt.</p>}
          </div>
          {page === 'list' && account.role === 'SALES' && (
            <button type="button" onClick={() => setPage('create')}>+ Tạo cơ hội mới</button>
          )}
          {page === 'list' && account.role === 'MANAGER' && (
            <button type="button" onClick={() => setPage('products')}>Quản lý sản phẩm</button>
          )}
        </div>

        {page === 'list' && account.role === 'MANAGER' && (
          <div className="crm-panel"><OpportunityReport /></div>
        )}
        {page === 'list' && (
          <div className="crm-panel opportunity-list">
            <OpportunityListPage onViewDetail={viewDetail} />
          </div>
        )}
        {page === 'products' && account.role === 'MANAGER' && (
          <div className="crm-panel"><ProductManagementPage onBack={showList} /></div>
        )}
        {page === 'detail' && (
          <div className="crm-panel detail-page">
            <OpportunityDetailPage role={account.role} id={selectedId} onBack={showList} />
          </div>
        )}
        {page === 'create' && (
          <div className="crm-panel">
            <CreateOpportunityPage onCreated={viewDetail} onBack={showList} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
