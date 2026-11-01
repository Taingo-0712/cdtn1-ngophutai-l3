import './App.css';
import OpportunityReport from './components/OpportunityReport';
import { request } from './api/client';
import { useState } from 'react';
import OpportunityListPage from './pages/OpportunityListPage';
import OpportunityDetailPage from './pages/OpportunityDetailPage';
import CreateOpportunityPage from './pages/CreateOpportunityPage';

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
    <main style={{ maxWidth: 420, margin: '60px auto', padding: 24 }}>
      <h1>Mekong Mobile</h1><h2>Đăng nhập</h2>
      <form onSubmit={login}>
        <label>Tên đăng nhập<input required autoComplete="username" value={username} onChange={e => setUsername(e.target.value)} /></label>
        <label>Mật khẩu<input required type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} /></label>
        {loginError && <p role="alert">{loginError}</p>}
        <button disabled={busy}>{busy ? 'Đang đăng nhập...' : 'Đăng nhập'}</button>
      </form>
    </main>
  );

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial' }}>
      <h1>Mekong Mobile - Quản lý cơ hội bán hàng</h1>
      <p>{account.full_name} — {account.role}</p>
      <button onClick={() => { sessionStorage.removeItem('access_token'); setAccount(null); }}>Đăng xuất</button>

      {page === 'list' && account.role === 'MANAGER' && <OpportunityReport />}
      {page === 'list' && (
        <>
          {account.role === 'SALES' && <button onClick={() => setPage('create')}>
            + Tạo cơ hội mới
          </button>}

          <OpportunityListPage
            onViewDetail={viewDetail}
          />
        </>
      )}

      {page === 'detail' && (
        <OpportunityDetailPage
          role={account.role}
          id={selectedId}
          onBack={showList}
        />
      )}

      {page === 'create' && (
        <CreateOpportunityPage
          onCreated={viewDetail}
          onBack={showList}
        />
      )}
    </div>
  );
}

export default App;
