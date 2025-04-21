import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/layout';
import HomePage from './pages/HomePage';
import CategoriesPage from './pages/CategoriesPage';
import CategoryDetailPage from './pages/CategoryDetailPage';
import TemplatesPage from './pages/TemplatesPage';
import TemplateDetailPage from './pages/TemplateDetailPage';
import GeneratePage from './pages/GeneratePage';
import ProvidersPage from './pages/ProvidersPage';
import ProviderDetailPage from './pages/ProviderDetailPage';
import NotFoundPage from './pages/NotFoundPage';
import { AnimatePresence } from 'framer-motion';
import PageTransition from './components/layout/PageTransition';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Animated routes component
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <PageTransition>
            <HomePage />
          </PageTransition>
        } />
        <Route path="/categories" element={
          <PageTransition>
            <CategoriesPage />
          </PageTransition>
        } />
        <Route path="/categories/:id" element={
          <PageTransition>
            <CategoryDetailPage />
          </PageTransition>
        } />
        <Route path="/templates" element={
          <PageTransition>
            <TemplatesPage />
          </PageTransition>
        } />
        <Route path="/templates/:id" element={
          <PageTransition>
            <TemplateDetailPage />
          </PageTransition>
        } />
        <Route path="/generate" element={
          <PageTransition>
            <GeneratePage />
          </PageTransition>
        } />
        <Route path="/providers" element={
          <PageTransition>
            <ProvidersPage />
          </PageTransition>
        } />
        <Route path="/providers/:id" element={
          <PageTransition>
            <ProviderDetailPage />
          </PageTransition>
        } />
        <Route path="*" element={
          <PageTransition>
            <NotFoundPage />
          </PageTransition>
        } />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <AnimatedRoutes />
        </Layout>
      </Router>
    </QueryClientProvider>
  );
}

export default App
