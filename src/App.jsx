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
import Navigation from './components/Navigation';

function AppContent() {
  const { isLoading } = usePageLoader();
  const location = useLocation();

  const isHome = location.pathname === '/';

  return (
    <>
      {/* Navbar always present, but style/position changes on home */}
      {isHome ? (
        <div className="fixed top-8 right-6 z-50 navbar-home transition-all duration-300">
          <Navigation horizontal textColor="white" small={false} forceBlackNoActive={true} />
        </div>
      ) : (
        <div className="w-full fixed inset-x-0 top-0 z-50 transition-all duration-300">
          <div className="relative flex items-center justify-between w-full !h-28 !pr-8 !px-8 transition-all duration-300 bg-white/10 backdrop-blur-lg">
            {/* Logo on the very left - hide on home page */}
            <div className="group relative">
              <img
                src={"/logofull.png"}
                alt="Logo"
                className="!h-20 w-auto !pl-5 relative z-20"
              />
            </div>
            {/* Navbar on the very right */}
            <Navigation horizontal textColor="black" small={false} />
          </div>
        </div>
      )}
      {/* Loader and routes */}
      {isLoading && <Loader key="loader" isLoading={isLoading} />}
      {!isLoading && (
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/headinfo" element={<AdminLayout />}>
            <Route path="add" element={<AddProject />} />
            <Route path="list" element={<ProjectList />} />
            <Route path="edit/:docId" element={<EditProject />} />
          </Route>
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="/contact" element={<Contact />} />
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
