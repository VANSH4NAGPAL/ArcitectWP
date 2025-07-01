// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import About from './pages/About';
import Loader from './components/Loader';
import { usePageLoader } from './hooks/usePageLoader';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Contact from './pages/Contact'
import PageLayout from './components/PageLayout';

function AppContent() {
  const { isLoading } = usePageLoader();
  const location = useLocation();

  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        {isLoading && <Loader key="loader" isLoading={isLoading} />}
        {/* AnimatePresence wraps the Routes for exit/enter animations */}
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route element={<PageLayout />}>
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/project/:id" element={<ProjectDetail />} />
            <Route path="/contact" element={<Contact />} />
          </Route>
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
                <p>Current path: {location.pathname}</p>
              </div>
            </div>
          } />
        </Routes>
      </AnimatePresence>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
