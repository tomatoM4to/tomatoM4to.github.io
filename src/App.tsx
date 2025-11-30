import { Route, Routes } from 'react-router';
import '@src/styles/App.css';
import '@src/styles/Home.css';
import '@src/styles/Item.css';
import '@src/styles/Nav.css';
import '@src/styles/Post.css';
import '@src/styles/Search.css';
import '@src/styles/Tag.css';
import Nav from '@src/components/Nav';
import Home from '@src/components/Home';
import Post from '@src/components/Post';
import Search from '@src/components/Search';
import Tag from '@src/components/Tag';
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
