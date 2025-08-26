import React from 'react';


function TypingIndicator({ typingUsers, position }) {
  if (!typingUsers.length) return null;
  let style = {
    position: 'absolute',
    background: '#fffbe6',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    zIndex: 10
  };
  if (position === 'bottom-right') {
    style.bottom = 20;
    style.right = 20;
  } else {
    style.top = 10;
    style.left = 10;
  }
  return (
    <div style={style}>
      {typingUsers.map((user, idx) => (
        <div key={idx} style={{ fontSize: '1rem', color: '#333' }}>
          <strong>{user}</strong> is typing...
        </div>
      ))}
    </div>
  );
}

export default TypingIndicator;
