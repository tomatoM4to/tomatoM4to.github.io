import { Route, Routes } from 'react-router';
import { lazy, Suspense } from 'react';
import '@src/styles/App.css';
import '@src/styles/Components.css';
import '@src/styles/Spinners.css';
import Nav from '@src/components/Nav';
import Footer from '@src/components/Footer';
import { MountProvider } from '@src/context/Mount';

const Home = lazy(() => import('@src/pages/Home'));
const Post = lazy(() => import('@src/pages/Post'));
const Search = lazy(() => import('@src/pages/Search'));
const Tag = lazy(() => import('@src/pages/Tag'));
const License = lazy(() => import('@src/pages/License'));

export default function App({ markdown }: { markdown: string }) {
  return (
    <MountProvider>
      <Nav />
      <Suspense fallback={<></>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts/:post" element={<Post markdown={markdown} />} />
          <Route path='/search' element={<Search />} />
          <Route path='/tags' element={<Tag />} />
          <Route path='/license' element={<License />} />
        </Routes>
      </Suspense>
      <Footer />
    </MountProvider>
  )
};
