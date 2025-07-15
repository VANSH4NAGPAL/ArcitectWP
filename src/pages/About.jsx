import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars } from 'react-icons/fa';
import Navigation from '../components/Navigation';
import Carousel from '../components/Carousel';


const About = () => {
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);

  return (
    <div className="min-h-screen bg-white flex flex-col !px-0 md:!px-0 !mt-30">
      {/* Mobile Navigation Button - Top Right, animated with framer-motion (from Contact.jsx) */}
      <>
        <motion.button
          className="fixed top-4 right-4 z-50 lg:hidden w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center"
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
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <Navigation textColor="black" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>

      {/* ABOUT SECTION */}
      <div>
        {/* MAIN CONTENT */}
        <motion.main
          className="flex-1 flex flex-col !gap-12 !px-0 md:!px-0 !py-0 md:!py-0 !mt-0 md:!mt-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* HERO SECTION */}
          <section className="w-full flex flex-col md:flex-row min-h-[70vh] !mt-35 !p-0 ">
            {/* Left: Company Name and Project Title */}
            <div className="basis-[40%] md:basis-[40%]  flex flex-col justify-center items-start  !px-10 md:!px-20 !py-0 md:!py-0 !min-h-[340px]">
              <h1
                className="!mb-16  text-3xl md:text-7xl  tracking-widest text-black"
              >
                Studio Design Palette
              </h1>
              <div className="!mt-10">
                <div className="  md:text-lg font-light tracking-widest text-black/70 min-h-[2.5rem] flex items-center">
                  <AnimatePresence mode="wait">
                    {currentProject?.title && (
                      <motion.span
                        key={currentProject.title}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        className="block w-full text-4xl"
                      >
                        {currentProject.title}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
            {/* Right: Carousel */}
            <div className="basis-[60%] md:basis-[60%] flex items-center justify-center bg-white !p-0 !m-0 min-h-[340px] relative">
              <div className="w-full h-[340px] md:h-auto !m-0 !p-0">
                <Carousel onSlideChange={setCurrentProject} />
              </div>
            </div>
          </section>

          

          {/* CEO SECTION */}
          <section className="w-full flex flex-col md:flex-row !mt-32 !mb-0 !px-0 md:!px-0 items-center justify-center">
            {/* Left: CEO Image */}
            <div className="basis-[50%] md:basis-[50%] flex items-center justify-center !p-0 !m-0 min-h-[420px]">
              <img
                src="/background-image.png"
                alt="CEO"
                className="w-full h-[420px] object-cover object-center"
                style={{ maxWidth: '100%', maxHeight: '420px' }}
              />
            </div>
            {/* Right: CEO Text */}
            <div className="basis-[50%] md:basis-[50%] flex flex-col justify-center items-center !px-10 md:!px-20 !py-0 md:!py-0 bg-white min-h-[420px]">
              <div className="w-full flex flex-col items-center">
                <h2
                  className="text-4xl md:text-6xl font-normal tracking-tight text-black mb-8 text-center"
                >
                  ABOUT<br />US
                </h2>
                <p className="text-black/80 text-base md:text-lg font-light leading-relaxed !mb-0 !mt-0 text-center" style={{ maxWidth: 420 }}>
                  This is the area you explain who you are and how you can solve their problem. Pull them in and show them exactly why they need you and how you'll be able to make their life/business better.
                </p>
              </div>
            </div>
          </section>
        </motion.main>
        
      </div>
    </div>
  );
};

export default About;