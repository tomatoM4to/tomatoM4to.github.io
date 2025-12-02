import { Route, Routes } from 'react-router';
import '@src/styles/App.css';
import '@src/styles/Home.css';
import '@src/styles/Nav.css';
import '@src/styles/Post.css';
import '@src/styles/Search.css';
import '@src/styles/Tag.css';
import Nav from '@src/components/Nav';
import Home from '@src/pages/Home';
import Post from '@src/pages/Post';
import Search from '@src/pages/Search';
import Tag from '@src/pages/Tag';
import { MountProvider } from '@src/context/Mount';


export default function App({ markdown }: { markdown: string }) {
  return (
    <MountProvider>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/posts/:post" element={<Post markdown={markdown} />} />
        <Route path='/search' element={<Search />} />
        <Route path='/tags' element={<Tag />} />
      </Routes>
    </MountProvider>
  )
};
