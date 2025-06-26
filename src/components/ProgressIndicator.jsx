import React from 'react';
import { motion } from 'framer-motion';

const ProgressIndicator = ({ totalSlides, currentSlide, onSlideClick }) => {
  return (
    <motion.div 
      className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
    >
      {/* Horizontal progress lines */}
      <div className="flex space-x-6">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <motion.button
            key={index}
            onClick={() => onSlideClick && onSlideClick(index)}
            className="cursor-pointer focus:outline-none"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              className="bg-white/40 transition-all duration-500"
              style={{
                width: '60px',
                height: '2px',
              }}
              animate={{
                backgroundColor: currentSlide === index 
                  ? 'rgba(255,255,255,0.9)' 
                  : 'rgba(255,255,255,0.4)',
                boxShadow: currentSlide === index 
                  ? '0 0 10px rgba(255,255,255,0.3)' 
                  : 'none'
              }}
              transition={{ 
                duration: 0.3, 
                ease: "easeInOut"
              }}
            />
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default ProgressIndicator;