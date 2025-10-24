import './App.css';
import { useEffect, useState } from 'react';
import { Link, Route, Routes, useParams } from 'react-router';
import Markdown from 'react-markdown';

function App({ markdown = "" }) {
  const [count, setCount] = useState(0);
  const [initialMount, setInitialMount] = useState(true);

  return (
    <>
      <nav>
        <Link to="/">Home</Link> | <Link to="/posts/database">Database</Link> | <Link to="/posts/docker">Docker</Link> | <Link to="/posts/network">Network</Link>
      </nav>

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

export default App;

const Home = ({
  setInitialMount,
}: {
  setInitialMount: Function
}) => {
  useEffect(() => {
    setInitialMount(false);
  }, [])
  return (
    <h1>
      Home
    </h1>
  )
};

const Post = ({
  markdown,
  initialMount,
  setInitialMount
}: {
  markdown: string,
  initialMount: boolean,
  setInitialMount: Function
}) => {
  const { post } = useParams();
  const [content, setContent] = useState(markdown);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(`/api/${post}/index.md`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.text();
        setContent(result);
      }
      catch (err) {
        console.error(err);
      }
    }
    if (initialMount) {
      setInitialMount(false);
      console.log(`!!! no network event !!!`);
    }
    else {
      getData();
      console.log(`!!! network event success !!!`)
    }
  }, [post])
  return (
    <>
      <h1>
        {post}
      </h1>
      <Markdown>
        {content}
      </Markdown>
    </>
  )
}
