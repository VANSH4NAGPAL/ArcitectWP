import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import About from './pages/About';
import Loader from './components/Loader';
import HttpsEnforcement from './components/HttpsEnforcement';
import { usePageLoader } from './hooks/usePageLoader';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Contact from './pages/Contact';
import PageLayout from './components/PageLayout';
import AdminLayout from "./pages/AdminLayout";
import AddProject from "./pages/AddProject";
import ProjectList from "./pages/ProjectList";
import EditProject from "./pages/EditProject";

function AppContent() {
  const { isLoading } = usePageLoader();
  const location = useLocation();

  return (
    <>
      {isLoading && <Loader key="loader" isLoading={isLoading} />}
      {/* Only render routes after main loader animation is complete */}
      {!isLoading && (
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />

          {/* Admin Panel Route (no sidebar layout) */}
          <Route path="/headinfo" element={<AdminLayout />}>
            <Route path="add" element={<AddProject />} />
            <Route path="list" element={<ProjectList />} />
            <Route path="edit/:docId" element={<EditProject />} />
          </Route>

          {/* All other pages wrapped in the PageLayout */}
          <Route element={<PageLayout />}>
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/project/:id" element={<ProjectDetail />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          {/* Fallback for unmatched routes */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
                  <p>Current path: {location.pathname}</p>
                </div>
              </div>
            }
          />
        </Routes>
      )}
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
