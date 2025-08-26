import React from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid';

function Home() {
  const navigate = useNavigate();
  function createNewDoc() {
    navigate(`/${uuidV4()}`);
  }
  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
      <button onClick={createNewDoc} style={{ fontSize: '2rem', padding: '1rem 2rem' }}>
        Create New Document
      </button>
    </div>
  );
}

export default Home;
