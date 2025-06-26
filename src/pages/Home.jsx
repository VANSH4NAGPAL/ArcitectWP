import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Carousel from '../components/Carousel';
import Navigation from '../components/Navigation';
import { projects } from '../data/projects';
import '../App.css';

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const radius = 15; // Even smaller radius to ensure it fits and is visible
  const circumference = 2 * Math.PI * radius;

  const handleSlideChange = (slideIndex) => {
    setCurrentSlide(slideIndex);
  };

  const toggleOverlay = () => {
    setIsOverlayOpen(!isOverlayOpen);
  };

  const menuItems = [
    {
      title: projects[0].title, // "Nordic Winter Residence"
      image: projects[0].image,
      category: projects[0].category,
      type: projects[0].type,
      description: projects[0].description
    },
    {
      title: projects[1].title, // "Sunset Villa Estate"
      image: projects[1].image,
      category: projects[1].category,
      type: projects[1].type,
      description: projects[1].description
    },
    {
      title: projects[2].title, // "Mountain View Residence"
      image: projects[2].image,
      category: projects[2].category,
      type: projects[2].type,
      description: projects[2].description
    },
    {
      title: projects[3].title, // "Mediterranean Modern Villa"
      image: projects[3].image,
      category: projects[3].category,
      type: projects[3].type,
      description: projects[3].description
    }
  ];

  return (
    <div className="relative w-full h-screen overflow-hidden bg-white">
      {/* Logo - Centered at Top */}
      <motion.div
        className="fixed top-4 md:top-8  left-1/2 md:left-53 transform -translate-x-1/2 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <motion.h1
          className="text-white font-bold tracking-wider text-xl sm:text-2xl md:text-3xl lg:text-4xl text-center md:text-left "
          style={{ fontFamily: '"Nunito Sans", sans-serif' }}
          whileHover={{ scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        >
          StudioDesignPalette
        </motion.h1>
      </motion.div>

      {/* Navigation - Positioned Below Logo */}
      <motion.div
        className="fixed top-16 md:top-20 lg:top-24 left-4 md:left-8 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <Navigation />
      </motion.div>

      {/* Toggle Circle Button - Top Right */}
      <motion.div
        className="fixed top-4 right-4 md:top-8 md:right-8 z-[60]"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <motion.button
          className={`relative w-12 h-12 md:w-16 md:h-16 flex items-center justify-center transition-all duration-300 focus:outline-none cursor-pointer ${
            isOverlayOpen ? 'text-slate-800' : 'text-white'
          }`}
          whileHover="hover"
          whileTap={{ scale: 0.95 }}
          onClick={toggleOverlay}
        >
          {/* Circle and Line SVG */}
          <motion.svg 
            className="absolute inset-0 w-full h-full" 
            viewBox="0 0 64 64"
            variants={{
              initial: { rotate: 0, scale: 1 },
              hover: { 
                rotate: 360, 
                scale: 1.1,
                transition: { 
                  rotate: { duration: 0.6, ease: "easeInOut" },
                  scale: { duration: 0.3, ease: "easeOut" }
                }
              }
            }}
          >
            {/* Circle with animated dash - visible when overlay is closed */}
            <motion.circle
              cx="32"
              cy="32"
              r="25"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="150 10"
              variants={{
                initial: { 
                  strokeDashoffset: 0,
                  opacity: 1
                },
                hover: {
                  strokeDashoffset: 160,
                  opacity: 1,
                  transition: { 
                    strokeDashoffset: { duration: 0.6, ease: "easeInOut" },
                    opacity: { duration: 0.3 }
                  }
                }
              }}
              animate={{
                opacity: isOverlayOpen ? 0 : 1
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
            
            {/* Line - visible when overlay is open */}
            <motion.line
              x1="20"
              y1="32"
              x2="44"
              y2="32"
              stroke="currentColor"
              strokeWidth="0.5"
              animate={{
                opacity: isOverlayOpen ? 1 : 0
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
          </motion.svg>

          {/* Toggle Icon */}
          <motion.div 
            className="relative z-10 flex flex-col items-center justify-center"
            variants={{
              initial: { scale: 1 },
              hover: { scale: 1.1 }
            }}
            transition={{ duration: 0.3 }}
          >
            {!isOverlayOpen ? (
              // Hamburger icon
              <motion.div 
                className="space-y-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
              
                <motion.div 
                  className="w-3 h-0.5 md:w-4 md:h-0.5 bg-current"
                  whileHover={{ scaleX: 1.2 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                />
               
              </motion.div>
            ) : (
              // Minus icon
              <motion.div 
                className="w-5 h-0.5 md:w-6 md:h-0.5 bg-current"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </motion.div>
        </motion.button>
      </motion.div>

      {/* Fullscreen Overlay */}
      <AnimatePresence>
        {isOverlayOpen && (
          <motion.div
            className="fixed inset-0 z-[55] bg-white overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {/* Company Name in Overlay - Centered */}
            <motion.div
              className="absolute top-4 md:top-8 left-1/2 transform -translate-x-1/2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ 
                duration: 0.6, 
                delay: 0.2
              }}
            >
              <h1 className="text-slate-800 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-wider text-center">
                StudioDesignPalette
              </h1>
            </motion.div>

            {/* Menu Grid - Responsive Layout */}
             <div className="flex items-center justify-center min-h-screen p-4 md:p-8 pt-24 md:pt-20 lg:pt-24">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-7xl w-full">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.title}
                    className="group cursor-pointer"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: 0.3 + index * 0.1,
                      ease: "easeOut" 
                    }}
                    whileHover={{ y: -8 }}
                  >
                    {/* Image with responsive dimensions */}
                    <div className="relative overflow-hidden mb-4 w-full">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="transition-all duration-500 group-hover:grayscale object-cover w-full h-auto"
                        style={{ 
                          aspectRatio: '295/454',
                          maxWidth: '295px',
                          maxHeight: '454px'
                        }}
                      />
                      
                      {/* Animated Mask that reveals from left to right */}
                      <motion.div
                        className="absolute inset-0 bg-white"
                        initial={{ x: "0%" }}
                        animate={{ x: "100%" }}
                        transition={{
                          duration: 0.8,
                          delay: 0.5 + index * 0.15,
                          ease: "easeInOut"
                        }}
                      />
                    </div>
                    
                    {/* Category and Type - Above Title - Centered */}
                    <motion.div
                      className="flex items-center justify-center gap-2 mb-2 flex-wrap"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ 
                        duration: 0.4, 
                        delay: 1.0 + index * 0.1 
                      }}
                    >
                      <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">
                        {item.category}
                      </span>
                      <span className="text-slate-400 text-xs">•</span>
                      <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">
                        {item.type}
                      </span>
                    </motion.div>

                    {/* Project Title - Centered */}
                    <motion.h3
                      className="text-slate-800 text-lg md:text-xl font-light tracking-wide mb-2 group-hover:text-slate-600 transition-colors duration-300 text-center"
                      style={{ fontFamily: '"Nunito Sans", sans-serif' }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ 
                        duration: 0.4, 
                        delay: 1.05 + index * 0.1 
                      }}
                    >
                      {item.title}
                    </motion.h3>
                    
                    {/* Description */}
                    <motion.p
                      className="text-slate-600 text-sm font-light leading-relaxed"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ 
                        duration: 0.4, 
                        delay: 1.1 + index * 0.1 
                      }}
                    >
                      {item.description}
                    </motion.p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Carousel - only visible when overlay is closed */}
      {!isOverlayOpen && (
        <Carousel
          currentSlide={currentSlide}
          onSlideChange={handleSlideChange}
        />
      )}
    </div>
  );
}

export default Home;