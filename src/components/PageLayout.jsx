import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars } from 'react-icons/fa';


const PageLayout = () => {
  return (
    <div className="w-full min-h-screen flex flex-col lg:flex-row z-50 relative">
      <div className="w-full flex flex-col min-h-screen">
        <div className="h-full pt-32 lg:pt-32">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default PageLayout;
