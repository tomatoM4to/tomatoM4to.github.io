import './assets/App.css';
import './assets/Home.css';
import './assets/Item.css';
import './assets/Nav.css';
import './assets/Post.css';
import './assets/Search.css';
import './assets/Tag.css';
import { useState } from 'react';
import { Route, Routes } from 'react-router';
import Nav from './components/Nav';
import Home from './components/Home';
import Post from './components/Post';
import Search from './components/Search';
import Tag from './components/Tag';

export default function App({ markdown = "" }) {
  const [initialMount, setInitialMount] = useState(true);

  return (
    <>
      <Nav />
      <Routes>
        <Route
          path="/"
          element={<Home setInitialMount={setInitialMount} />}
        />
        <Route
          path="/posts/:post"
          element={<Post markdown={markdown} initialMount={initialMount} setInitialMount={setInitialMount} />}
        />
        <Route path='/search' element={<Search />} />
        <Route path='/tags' element={<Tag />} />
      </Routes>
    </>
  )
};
