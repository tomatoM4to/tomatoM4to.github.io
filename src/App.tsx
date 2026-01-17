import { Route, Routes } from 'react-router';
import { lazy, Suspense } from 'react';
import '@src/styles/App.css';
import '@src/styles/Components.css';
import '@src/styles/Home.css';
import '@src/styles/Markdown.css';
import '@src/styles/Post.css';
import '@src/styles/Search.css';
import '@src/styles/Spinners.css';
import '@src/styles/Tag.css';
import Nav from '@src/components/Nav';
import Footer from '@src/components/Footer';
import { MountProvider } from '@src/context/Mount';
import { ThemeProvider } from '@src/context/Theme';
import Home from '@src/pages/Home';
import Post from '@src/pages/Post';
import Search from '@src/pages/Search';
import Tag from '@src/pages/Tag';

const License = lazy(() => import('@src/pages/License'));

export default function App({ markdown }: { markdown: string }) {
  return (
    <MountProvider>
      <ThemeProvider>
        <Nav />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/posts/:post" element={<Post markdown={markdown} />} />
            <Route path='/search' element={<Search />} />
            <Route path='/tags' element={<Tag />} />
            <Route path='/license' element={
              <Suspense fallback={<></>}>
                <License />
              </Suspense>
            } />
          </Routes>
        <Footer />
      </ThemeProvider>
    </MountProvider>
  )
};
