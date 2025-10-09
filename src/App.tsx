import './App.css';
import { useState } from 'react';
import { Link, Route, Routes } from 'react-router';

function App({ someProps = "" }) {
  const [count, setCount] = useState(0);

  console.log(someProps);
  return (
    <>
      <nav>
        <Link to="/">Home</Link> | <Link to="/about">About</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>

      <h1>Vite + React</h1>

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
  return <h1>I am Home</h1>;
};

const About = () => {
  return <h1>I am About</h1>;
};