import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Loader = ({ isLoading }) => {
  const [displayText, setDisplayText] = useState("");
  const fullText = "STUDIO DESIGN PALETTE";
  
  useEffect(() => {
    if (isLoading) {
      let currentIndex = 0;
      const typewriterInterval = setInterval(() => {
        if (currentIndex <= fullText.length) {
          setDisplayText(fullText.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typewriterInterval);
        }
      }, 80); // Adjust speed here (lower = faster)
      
      return () => clearInterval(typewriterInterval);
    } else {
      setDisplayText("");
    }
  }, [isLoading]);

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-gradient-to-br from-slate-50 to-stone-100 flex items-center justify-center min-h-screen overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            scale: 1.02,
            filter: "blur(8px)"
          }}
          transition={{ 
            duration: 0.5,
            exit: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
          }}
        >
          <motion.div 
            className="relative flex flex-col items-center space-y-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ 
              opacity: 0, 
              y: -20,
              scale: 0.95
            }}
            transition={{ 
              duration: 0.8, 
              ease: "easeOut",
              exit: { duration: 0.6 }
            }}
          >
            
            {/* Brand Name with typewriter animation */}
            <motion.div className="text-center">
              <motion.h1 
                className="text-3xl font-extralight text-slate-800 tracking-[0.25em] mb-2 min-h-[3rem] flex items-center justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ 
                  duration: 1.2, 
                  delay: 0.2,
                  ease: "easeOut",
                  exit: { duration: 0.4 }
                }}
              >
                {displayText}
                <motion.span
                  className="inline-block w-0.5 h-8 bg-slate-800 ml-1"
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ 
                    duration: 1, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                />
              </motion.h1>
            </motion.div>

            {/* Architectural Blueprint Loader */}
            <motion.div 
              className="relative flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ 
                delay: 0.2,
                exit: { duration: 0.5 }
              }}
            >
              {/* Drafting compass animation */}
              <motion.div 
                className="!mb-6 w-8 h-8 !mt-6"
                animate={{ rotate: isLoading ? 360 : 0 }}
                exit={{ rotate: 540, scale: 0 }}
                transition={{ 
                  rotate: { 
                    duration: 4, 
                    repeat: isLoading ? Infinity : 0, 
                    ease: "linear" 
                  },
                  exit: { duration: 0.5 }
                }}
              >
                <div className="w-full h-full border-2 border-slate-400 rounded-full relative">
                  <div className="absolute top-0 left-1/2 w-0.5 h-3 bg-slate-600 -translate-x-1/2" />
                </div>
              </motion.div>

              {/* Building structure container */}
              <div className="relative">
                {/* Foundation line */}
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-400"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  exit={{ scaleX: 0, opacity: 0 }}
                  transition={{ 
                    duration: 0.7, 
                    delay: 0,
                    exit: { duration: 0.3 }
                  }}
                />
                
                {/* Building structure with blueprint aesthetic */}
                <div className="flex items-end justify-center gap-1 px-4">
                  {([
                    { height: 48, delay: 1.2, width: 12 },
                    { height: 64, delay: 1.4, width: 12 },
                    { height: 80, delay: 1.6, width: 16 },
                    { height: 96, delay: 1.8, width: 16 },
                    { height: 72, delay: 2.0, width: 12 },
                    { height: 56, delay: 2.2, width: 12 },
                    { height: 40, delay: 2.4, width: 10 }
                  ]).map((building, index) => (
                    <motion.div
                      key={index}
                      className="bg-slate-600 relative overflow-hidden flex-shrink-0"
                      style={{ width: `${building.width}px` }}
                      initial={{ height: 0 }}
                      animate={{ 
                        height: `${building.height}px`,
                        scaleY: isLoading ? [1, 1.02, 1] : 1
                      }}
                      exit={{
                        height: 0,
                        opacity: 0
                      }}
                      transition={{ 
                        height: { duration: 0.8, delay: building.delay, ease: "easeOut" },
                        scaleY: { 
                          duration: 2, 
                          delay: building.delay + 1, 
                          repeat: isLoading ? Infinity : 0, 
                          ease: "easeInOut" 
                        },
                        exit: { duration: 0.3, delay: index * 0.03 }
                      }}
                    >
                      {/* Window details */}
                      <motion.div 
                        className="absolute inset-x-0 top-1 space-y-1 px-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ 
                          delay: building.delay + 0.5,
                          exit: { duration: 0.2 }
                        }}
                      >
                        {Array.from({ length: Math.floor(building.height / 16) }).map((_, i) => (
                          <div key={i} className="grid grid-cols-2 gap-0.5">
                            <div className="h-1 bg-slate-300" />
                            <div className="h-1 bg-slate-300" />
                          </div>
                        ))}
                      </motion.div>
                      
                      {/* Subtle building glow */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-slate-500/20 to-transparent"
                        animate={{ opacity: isLoading ? [0.3, 0.6, 0.3] : 0.3 }}
                        exit={{ opacity: 0 }}
                        transition={{ 
                          duration: 3, 
                          delay: building.delay + 2,
                          repeat: isLoading ? Infinity : 0, 
                          ease: "easeInOut",
                          exit: { duration: 0.2 }
                        }}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Loader;
