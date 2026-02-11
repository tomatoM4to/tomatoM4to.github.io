import { Route, Routes } from 'react-router';
import { lazy, Suspense } from 'react';
import '@src/styles/App.css';
import Nav from '@src/components/Nav';
import Footer from '@src/components/Footer';
import { MountProvider } from '@src/context/Mount';
import { ThemeProvider } from '@src/context/Theme';
import Home from '@src/pages/Home';
import Post from '@src/pages/Post';
import Search from '@src/pages/Search';
import Tag from '@src/pages/Tag';
import { type InitialData } from '@src/shared/common';

const License = lazy(() => import('@src/pages/License'));

export default function App({ initialData }: { initialData: InitialData }) {
  return (
    <MountProvider>
      <ThemeProvider>
        <Nav />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/posts/:post" element={<Post initialData={initialData.post ?? null} />} />
            <Route path='/search' element={<Search />} />
            <Route path='/tags' element={<Tag initialTags={initialData.tags} />} />
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
