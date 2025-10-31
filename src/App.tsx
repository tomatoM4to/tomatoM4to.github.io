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

function useMount() {
  const [initialMount, setInitialMount] = useState(true);
  function mount() {
    setInitialMount(false);
  }
  return { initialMount, mount };
}

export default function App({ markdown = "" }) {
  const { initialMount, mount } = useMount();

  return (
    <>
      <Nav />
      <Routes>
        <Route
          path="/"
          element={<Home setInitialMount={mount} />}
        />
        <Route
          path="/posts/:post"
          element={<Post markdown={markdown} initialMount={initialMount} mount={mount} />}
        />
        <Route path='/search' element={<Search mount={mount} />} />
        <Route path='/tags' element={<Tag mount={mount} />} />
      </Routes>
    </>
  )
};
