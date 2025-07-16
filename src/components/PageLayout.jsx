import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars } from 'react-icons/fa';


const PageLayout = () => {
  const [showMobileNav, setShowMobileNav] = useState(false);



  return (
    <div className="w-full min-h-screen flex flex-col lg:flex-row z-50 relative">
      {/* Desktop Navbar and Logo at top */}
      <div className="hidden lg:block w-full absolute inset-x-0 top-0 z-50">
        <div
          className="relative flex items-center justify-between w-full h-28 !pr-8 !px-8"
          style={{
            backgroundColor: '#ffffff',
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 200 200'%3E%3Cdefs%3E%3ClinearGradient id='a' gradientUnits='userSpaceOnUse' x1='88' y1='88' x2='0' y2='0'%3E%3Cstop offset='0' stop-color='%23070b0b'/%3E%3Cstop offset='1' stop-color='%230c1010'/%3E%3C/linearGradient%3E%3ClinearGradient id='b' gradientUnits='userSpaceOnUse' x1='75' y1='76' x2='168' y2='160'%3E%3Cstop offset='0' stop-color='%23868686'/%3E%3Cstop offset='0.09' stop-color='%23ababab'/%3E%3Cstop offset='0.18' stop-color='%23c4c4c4'/%3E%3Cstop offset='0.31' stop-color='%23d7d7d7'/%3E%3Cstop offset='0.44' stop-color='%23e5e5e5'/%3E%3Cstop offset='0.59' stop-color='%23f1f1f1'/%3E%3Cstop offset='0.75' stop-color='%23f9f9f9'/%3E%3Cstop offset='1' stop-color='%23FFFFFF'/%3E%3C/linearGradient%3E%3Cfilter id='c' x='0' y='0' width='200%25' height='200%25'%3E%3CfeGaussianBlur in='SourceGraphic' stdDeviation='12' /%3E%3C/filter%3E%3C/defs%3E%3Cpolygon fill='url(%23a)' points='0 174 0 0 174 0'/%3E%3Cpath fill='%23000' fill-opacity='.5' filter='url(%23c)' d='M121.8 174C59.2 153.1 0 174 0 174s63.5-73.8 87-94c24.4-20.9 87-80 87-80S107.9 104.4 121.8 174z'/%3E%3Cpath fill='url(%23b)' d='M142.7 142.7C59.2 142.7 0 174 0 174s42-66.3 74.9-99.3S174 0 174 0S142.7 62.6 142.7 142.7z'/%3E%3C/svg%3E\")",
            backgroundAttachment: 'fixed',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'top left',
          }}
        >
          {/* Logo on the very left */}
          <div className="group relative">
            <img
              src="/logofullw.png" // Change to your logo path
              alt="Logo"
              className="h-20 w-auto !pl-5 relative z-20"
            />
          </div>
          {/* Navbar on the very right */}
          <Navigation horizontal textColor="black" linkClassName="nav-underline-animate" />
        </div>
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
        <div className="h-full pt-32 lg:pt-32">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default PageLayout;
