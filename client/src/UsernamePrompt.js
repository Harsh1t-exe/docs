import React, { useState } from 'react';

function UsernamePrompt({ onSubmit }) {
  const [username, setUsername] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (username.trim()) {
      onSubmit(username.trim());
    }
  }

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#fff', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '1rem', borderRadius: '4px', boxShadow: 'none', minWidth: '220px' }}>
        <div style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Username:</div>
        <input value={username} onChange={e => setUsername(e.target.value)} autoFocus style={{ fontSize: '1rem', padding: '0.3rem', width: '100%', border: '1px solid #ccc', borderRadius: '2px' }} />
        <button type="submit" style={{ marginTop: '0.5rem', fontSize: '1rem', padding: '0.3rem 1rem', borderRadius: '2px', border: '1px solid #ccc', background: '#eee', cursor: 'pointer' }}>Continue</button>
      </form>
    </div>
  );
}

export default UsernamePrompt;
