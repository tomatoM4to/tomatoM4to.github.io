import './App.css';
import { useState } from 'react';
import { Link, Route, Routes } from 'react-router';
import Markdown from 'react-markdown';

function App({ someProps = "", markdown = "" }) {
  const [count, setCount] = useState(0);

  console.log(someProps);
  return (
    <>
      <nav>
        <Link to="/">Home</Link> | <Link to="/posts/database">Database</Link> | <Link to="/posts/docker">Docker</Link> | <Link to="/posts/network">Network</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/posts/database" element={<Post name="database" />} />
        <Route path="/posts/docker" element={<Post name="docker" />} />
        <Route path="/posts/network" element={<Post name="network" />} />
      </Routes>

      <Markdown>
        {markdown}
      </Markdown>

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

const Home = () => {
  return <h1>Home</h1>;
};

const Post = ({
  name
}: {
  name: string
}) => {
  return <h1>{name}</h1>
}