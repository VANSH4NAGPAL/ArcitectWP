import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars } from 'react-icons/fa';


const PageLayout = () => {
  const [showMobileNav, setShowMobileNav] = useState(false);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row  relative">
      {/* Desktop Navbar and Logo at top */}
      <div className="absolute top-6 left-8 right-8 z-50 hidden lg:flex items-center justify-between w-[94vw]">
        {/* Logo on the very left */}
        <img
          src="/logofull.png" // Change to your logo path
          alt="Logo"
          className="h-40 w-auto !pl-5"
        />
        {/* Navbar on the very right */}
        <Navigation horizontal textColor="black" />
      </div>

      {/* Mobile: Logo and Navbar centered in overlay */}
      <>
        <motion.button
          className="fixed top-4 right-4 z-50 lg:hidden w-12 h-12 rounded-full  shadow-lg flex items-center justify-center"
          onClick={() => setShowMobileNav(true)}
          aria-label="Open navigation"
          whileHover={{ scale: 1.12, rotate: 10, boxShadow: "0 8px 32px rgba(0,0,0,0.18)" }}
          whileTap={{ scale: 0.95, rotate: -10 }}
          initial={{ opacity: 0, y: -20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <motion.span
            initial={{ rotate: 0 }}
            animate={{ rotate: showMobileNav ? 90 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <FaBars className="text-2xl text-black" />
          </motion.span>
        </motion.button>
        <AnimatePresence>
          {showMobileNav && (
            <motion.div
              className="fixed inset-0 z-50 bg-white/60 backdrop-blur-md flex flex-col items-center justify-center"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
            >
              {/* Logo centered at top */}
              <div className="flex flex-col items-center w-full">
                <img
                  src="/logofull.png" // Change to your logo path
                  alt="Logo"
                  className="h-12 w-auto !mb-8 !mt-8 z-10"
                />
                <Navigation textColor="black" />
              </div>
              <motion.button
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center"
                onClick={() => setShowMobileNav(false)}
                aria-label="Close navigation"
                whileHover={{ scale: 1.15, rotate: 90 }}
                whileTap={{ scale: 0.92, rotate: -90 }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <span className="text-2xl text-white">&times;</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </>

      {/* Sidebar removed for full screen layout */}
      <div className="w-full flex flex-col min-h-screen">
        <div className="h-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default PageLayout;
