import React from 'react';

function DownloadButton({ quill }) {
  function handleDownload() {
    // Try to get the Quill instance from the editor div
    let editor = quill;
    if (!editor) {
      const el = document.querySelector('.ql-editor');
      if (el) {
        const html = el.innerHTML;
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 100);
        return;
      }
    }
    // If editor is available, use its root
    const html = editor.root.innerHTML;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 100);
  }
  return (
    <button onClick={handleDownload} style={{ position: 'absolute', top: 10, right: 10, padding: '0.5rem 1rem', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc', background: '#fff', cursor: 'pointer' }}>
      Download
    </button>
  );
}

export default DownloadButton;
