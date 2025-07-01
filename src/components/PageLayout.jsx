import React, { useRef } from 'react';
import LeftSidebar from './LeftSidebar';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

const PageLayout = () => {
  const sidebarRef = useRef(null);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row overflow-hidden">
      <LeftSidebar ref={sidebarRef} />
      <div className="w-full lg:w-[80%] flex flex-col lg:h-screen overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
              duration: 0.6,
              ease: "easeOut",
              delay: 0.1
            }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PageLayout;