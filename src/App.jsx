// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Home from './pages/Home';
import About from './pages/About';
import Loader from './components/Loader';
import { usePageLoader } from './hooks/usePageLoader';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';

function AppContent() {
  const { isLoading } = usePageLoader();
  const location = useLocation();

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <Loader key="loader" isLoading={isLoading} />}
      </AnimatePresence>
      
      {/* Page content with entrance animation */}
      <AnimatePresence mode="wait">
        {!isLoading && (
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ 
              duration: 0.6, 
              ease: "easeOut",
              delay: 0.1 // Small delay to ensure loader has fully exited
            }}
          >
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/project/:id" element={<ProjectDetail />} />
              {/* Add a catch-all route for debugging */}
              <Route path="*" element={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
                    <p>Current path: {location.pathname}</p>
                  </div>
                </div>
              } />
            </Routes>
          </motion.div>
        )}
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
