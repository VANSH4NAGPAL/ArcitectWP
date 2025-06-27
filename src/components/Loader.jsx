import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MAIN_WINDOWS = Array.from({ length: 12 * 4 }, (_, i) => ({
  x: 68 + (i % 4) * 16,
  y: 60 + Math.floor(i / 4) * 12,
}));
const LEFT_WINDOWS = Array.from({ length: 8 * 2 }, (_, i) => ({
  x: 35 + (i % 2) * 10,
  y: 100 + Math.floor(i / 2) * 12,
}));
const RIGHT_WINDOWS = Array.from({ length: 9 * 2 }, (_, i) => ({
  x: 145 + (i % 2) * 10,
  y: 90 + Math.floor(i / 2) * 12,
}));

const Loader = ({ isLoading }) => {
  const [displayText, setDisplayText] = useState("");
  const fullText = "STUDIO DESIGN PALETTE";

  // For random blinking windows
  const [mainWindowStates, setMainWindowStates] = useState(
    () => Array(MAIN_WINDOWS.length).fill(true)
  );
  const [leftWindowStates, setLeftWindowStates] = useState(
    () => Array(LEFT_WINDOWS.length).fill(true)
  );
  const [rightWindowStates, setRightWindowStates] = useState(
    () => Array(RIGHT_WINDOWS.length).fill(true)
  );

  // Faster typewriter
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
      }, 30);
      return () => clearInterval(typewriterInterval);
    } else {
      setDisplayText("");
    }
  }, [isLoading, fullText]);

  // Random blink for windows
  useEffect(() => {
    if (!isLoading) return;
    const mainInterval = setInterval(() => {
      setMainWindowStates((arr) =>
        arr.map(() => Math.random() > 0.5)
      );
    }, 250);
    const leftInterval = setInterval(() => {
      setLeftWindowStates((arr) =>
        arr.map(() => Math.random() > 0.5)
      );
    }, 300);
    const rightInterval = setInterval(() => {
      setRightWindowStates((arr) =>
        arr.map(() => Math.random() > 0.5)
      );
    }, 320);
    return () => {
      clearInterval(mainInterval);
      clearInterval(leftInterval);
      clearInterval(rightInterval);
    };
  }, [isLoading]);

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-gradient-to-br from-neutral-100 via-white to-neutral-200 flex items-center justify-center min-h-screen overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.02,
            filter: "blur(8px)",
          }}
          transition={{
            duration: 0.5,
            exit: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
          }}
        >
          <motion.div
            className="relative flex flex-col items-center space-y-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{
              opacity: 0,
              y: -20,
              scale: 0.95,
            }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
              exit: { duration: 0.6 },
            }}
          >
            {/* Logo Loader with Image */}
            <motion.div
              className="relative flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                delay: 0.3,
                exit: { duration: 0.5 },
              }}
            >
              <motion.img
                src="/blacklogo.png"
                alt="Studio Design Palette Logo"
                className="w-[200px] md:w-[240px] drop-shadow-xl mx-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                draggable={false}
              />
              <motion.div
                className="mt-8 text-center"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: {},
                }}
              >
                <div className="flex flex-row justify-center items-end gap-3 md:gap-6 mb-2">
                  <motion.span
                    className="text-3xl md:text-5xl font-semibold text-black tracking-widest"
                    initial={{ opacity: 0, y: 40, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.7, type: "spring" }}
                  >
                    STUDIO
                  </motion.span>
                  <motion.span
                    className="text-3xl md:text-5xl font-extralight text-neutral-700 tracking-widest"
                    initial={{ opacity: 0, y: 40, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.7, type: "spring" }}
                  >
                    DESIGN
                  </motion.span>
                  <motion.span
                    className="text-3xl md:text-5xl font-light text-neutral-700 tracking-widest"
                    initial={{ opacity: 0, y: 40, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.7, type: "spring" }}
                  >
                    PALETTE
                  </motion.span>
                </div>
                <motion.p
                  className="text-neutral-500 text-lg md:text-xl tracking-wide"
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
                >
                  Inspiring spaces, creative solutions.
                </motion.p>
              </motion.div>
              {/* Subtle animated glow */}
              <motion.div
                className="absolute inset-0 pointer-events-none rounded-full"
                style={{ background: "radial-gradient(circle, #fff6 0%, #fff0 80%)" }}
                animate={{
                  opacity: [0.1, 0.25, 0.1],
                  scale: [0.98, 1.04, 0.98],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Loader;
