import { Route, Routes } from 'react-router';
import '@src/styles/App.css';
import '@src/styles/Home.css';
import '@src/styles/Nav.css';
import '@src/styles/Post.css';
import '@src/styles/Markdown.css';
import '@src/styles/Search.css';
import '@src/styles/Tag.css';
import '@src/styles/Pagination.css';
import '@src/styles/Footer.css';
import '@src/styles/License.css';
import Nav from '@src/components/Nav';
import Footer from '@src/components/Footer';
import Home from '@src/pages/Home';
import Post from '@src/pages/Post';
import Search from '@src/pages/Search';
import Tag from '@src/pages/Tag';
import License from '@src/pages/License';
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
        <Route path='/license' element={<License />} />
      </Routes>
      <Footer />
    </MountProvider>
  )
};
