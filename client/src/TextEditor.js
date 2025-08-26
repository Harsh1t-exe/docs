

import React, { useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import QuillCursors from 'quill-cursors';
import 'quill/dist/quill.snow.css';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import UsernamePrompt from './UsernamePrompt';
import DownloadButton from './DownloadButton';
Quill.register('modules/cursors', QuillCursors);
// ...existing code...


const SAVE_INTERVAL_MS = 2000;
const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, false] }],
  ['bold', 'italic', 'underline'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['image', 'blockquote', 'code-block'],
  ['clean']
];

function TextEditor() {
  const { id: documentId } = useParams();
  const quillRef = useRef();
  const socketRef = useRef();
  const [username, setUsername] = useState(null);
  // ...existing code...

  useEffect(() => {
    if (!username) return;
    socketRef.current = io('http://localhost:5000');
    const quill = new Quill(quillRef.current, {
      theme: 'snow',
      modules: {
        toolbar: TOOLBAR_OPTIONS,
        cursors: true
      }
    });
  const cursors = quill.getModule('cursors');
    quill.disable();
    quill.setText('Loading...');

    socketRef.current.once('load-document', document => {
      quill.setContents(document);
      quill.enable();
    });
    socketRef.current.emit('get-document', documentId);

    const handler = delta => {
      quill.updateContents(delta);
    };
    socketRef.current.on('receive-changes', handler);

    // Collaborative cursor logic
    socketRef.current.on('receive-cursor', ({ userId, username, range, color }) => {
      if (userId === socketRef.current.id) return;
      // Remove cursor if range is null (user left or lost focus)
      if (!range) {
        cursors.removeCursor(userId);
        return;
      }
      // Create or update cursor
      cursors.createCursor(userId, username, color || '#007bff');
      cursors.moveCursor(userId, range);
      cursors.toggleFlag(userId, true);
    });


    const changeHandler = (delta, oldDelta, source) => {
      if (source !== 'user') return;
      socketRef.current.emit('send-changes', delta);
      // Send cursor position on text change as well
      const range = quill.getSelection();
      if (range) {
        socketRef.current.emit('send-cursor', {
          userId: socketRef.current.id,
          username,
          range,
          color: '#007bff'
        });
      }
    };
    quill.on('text-change', changeHandler);
    quill.on('selection-change', (range) => {
      socketRef.current.emit('send-cursor', {
        userId: socketRef.current.id,
        username,
        range: range || null,
        color: '#007bff'
      });
    });

    const saveInterval = setInterval(() => {
      socketRef.current.emit('save-document', quill.getContents());
    }, SAVE_INTERVAL_MS);

    socketRef.current.emit('set-username', username);

    return () => {
      socketRef.current.disconnect();
      clearInterval(saveInterval);
    };
  }, [documentId, username]);

  if (!username) {
    return <UsernamePrompt onSubmit={setUsername} />;
  }
  return (
    <div style={{ position: 'relative', height: '100vh' }}>
  <DownloadButton quill={quillRef.current && quillRef.current.__quill ? quillRef.current.__quill : quillRef.current && quillRef.current._quill ? quillRef.current._quill : null} />
      <div ref={quillRef} style={{ height: '100vh' }} />
    </div>
  );
}

export default TextEditor;
