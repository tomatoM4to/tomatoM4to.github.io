import './assets/App.css';
import { useState } from 'react';
import { Route, Routes } from 'react-router';
import Nav from './components/Nav';
import Home from './components/Home';
import Post from './components/Post';

export default function App({ markdown = "" }) {
  const [count, setCount] = useState(0);
  const [initialMount, setInitialMount] = useState(true);

  return (
    <>
      <Nav />

      <Routes>
        <Route path="/" element={<Home setInitialMount={setInitialMount} />} />
        <Route path="/posts/:post" element={<Post markdown={markdown} initialMount={initialMount} setInitialMount={setInitialMount} />} />
      </Routes>

      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
};
