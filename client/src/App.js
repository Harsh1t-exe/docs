
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TextEditor from './TextEditor';
import Home from './Home';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/:id" element={<TextEditor />} />
    </Routes>
  );
}

export default App;
