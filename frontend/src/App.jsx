import './App.css';
import { useState } from 'react';
import OpportunityListPage from './pages/OpportunityListPage';
import OpportunityDetailPage from './pages/OpportunityDetailPage';
import CreateOpportunityPage from './pages/CreateOpportunityPage';

function App() {
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

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial' }}>
      <h1>Mekong Mobile - Quản lý cơ hội bán hàng</h1>

      {page === 'list' && (
        <>
          <button onClick={() => setPage('create')}>
            + Tạo cơ hội mới
          </button>

          <OpportunityListPage
            onViewDetail={viewDetail}
          />
        </>
      )}

      {page === 'detail' && (
        <OpportunityDetailPage
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
