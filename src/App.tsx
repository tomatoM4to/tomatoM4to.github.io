import '@src/assets/App.css';
import '@src/assets/Home.css';
import '@src/assets/Item.css';
import '@src/assets/Nav.css';
import '@src/assets/Post.css';
import '@src/assets/Search.css';
import '@src/assets/Tag.css';
import { useState } from 'react';
import { Route, Routes } from 'react-router';
import Nav from '@src/components/Nav';
import Home from '@src/components/Home';
import Post from '@src/components/Post';
import Search from '@src/components/Search';
import Tag from '@src/components/Tag';

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
