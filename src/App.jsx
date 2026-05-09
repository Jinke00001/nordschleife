import { lazy, Suspense, useLayoutEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import ReadingProgress from './components/ReadingProgress.jsx';
import TopLoadingBar from './components/TopLoadingBar.jsx';

const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const CornersPage = lazy(() => import('./pages/CornersPage.jsx'));
const CornerDetailPage = lazy(() => import('./pages/CornerDetailPage.jsx'));
const BrandsPage = lazy(() => import('./pages/BrandsPage.jsx'));
const BrandDetailPage = lazy(() => import('./pages/BrandDetailPage.jsx'));
const ModelDetailPage = lazy(() => import('./pages/ModelDetailPage.jsx'));
const LapTimesPage = lazy(() => import('./pages/LapTimesPage.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));

export default function App() {
  const location = useLocation();

  return (
    <div className="app-shell">
      <TopLoadingBar />
      <ReadingProgress />
      <ScrollToTop />
      <Header />
      <main>
        <Suspense fallback={<PageFallback />}>
          <div key={location.pathname} className="page-transition-wrapper">
            <Routes location={location}>
              <Route path="/" element={<HomePage />} />
              <Route path="/corners" element={<CornersPage />} />
              <Route path="/corners/:slug" element={<CornerDetailPage />} />
              <Route path="/brands" element={<BrandsPage />} />
              <Route path="/brands/:brandSlug/:modelSlug" element={<ModelDetailPage />} />
              <Route path="/brands/:slug" element={<BrandDetailPage />} />
              <Route path="/lap-times" element={<LapTimesPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

function PageFallback() {
  return <div className="page-fallback" />;
}

function ScrollToTop() {
  const { hash, key, pathname, search } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    });
  }, [hash, key, pathname, search]);

  return null;
}
