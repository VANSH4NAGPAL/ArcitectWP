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
            {/* Brand Name with typewriter animation */}
            <motion.div className="text-center">
              <motion.h1
                className="text-3xl md:text-4xl font-light text-neutral-700 tracking-[0.25em] min-h-[4rem] flex items-center justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{
                  duration: 1.2,
                  delay: 0.2,
                  ease: "easeOut",
                  exit: { duration: 0.4 },
                }}
              >
                {displayText || "STUDIO DESIGN PALETTE"}
                <motion.span
                  className="inline-block w-0.5 h-9 bg-neutral-500 ml-2"
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </motion.h1>
            </motion.div>

            {/* Elegant Professional Building */}
            <motion.div
              className="relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                delay: 0.3,
                exit: { duration: 0.5 },
              }}
            >
              <svg
                width="200"
                height="240"
                viewBox="0 0 200 240"
                className="drop-shadow-lg"
              >
                {/* Background glow */}
                <defs>
                  <radialGradient id="buildingGlow" cx="50%" cy="50%" r="60%">
                    <stop offset="0%" stopColor="#e0e7ef" />
                    <stop offset="100%" stopColor="#cbd5e1" />
                  </radialGradient>
                  <filter id="softGlow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Foundation */}
                <motion.rect
                  x="20"
                  y="210"
                  width="160"
                  height="4"
                  fill="#a3a3a3"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                />

                {/* Main Tower - Modern Glass Building */}
                <motion.rect
                  x="60"
                  y="50"
                  width="80"
                  height="160"
                  fill="none"
                  stroke="#64748b"
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                />

                {/* Left Wing */}
                <motion.rect
                  x="30"
                  y="90"
                  width="30"
                  height="120"
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="1.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                />

                {/* Right Wing */}
                <motion.rect
                  x="140"
                  y="80"
                  width="30"
                  height="130"
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="1.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                />

                {/* Window Grid - Main Building */}
                {MAIN_WINDOWS.map((win, i) => (
                  <motion.rect
                    key={`main-window-${i}`}
                    x={win.x}
                    y={win.y}
                    width="8"
                    height="8"
                    fill={
                      mainWindowStates[i]
                        ? "url(#windowGlowYellowBlue)"
                        : "#e0e7ef"
                    }
                    stroke="#38bdf8"
                    strokeWidth="0.5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 0.15,
                      delay: 0.6 + Math.floor(i / 4) * 0.05 + (i % 4) * 0.02,
                    }}
                  />
                ))}

                {/* Left Wing Windows */}
                {LEFT_WINDOWS.map((win, i) => (
                  <motion.rect
                    key={`left-window-${i}`}
                    x={win.x}
                    y={win.y}
                    width="6"
                    height="6"
                    fill={
                      leftWindowStates[i]
                        ? "url(#windowGlowYellowBlue)"
                        : "#e0e7ef"
                    }
                    stroke="#38bdf8"
                    strokeWidth="0.5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 0.15,
                      delay: 0.8 + Math.floor(i / 2) * 0.04,
                    }}
                  />
                ))}

                {/* Right Wing Windows */}
                {RIGHT_WINDOWS.map((win, i) => (
                  <motion.rect
                    key={`right-window-${i}`}
                    x={win.x}
                    y={win.y}
                    width="6"
                    height="6"
                    fill={
                      rightWindowStates[i]
                        ? "url(#windowGlowYellowBlue)"
                        : "#e0e7ef"
                    }
                    stroke="#38bdf8"
                    strokeWidth="0.5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 0.15,
                      delay: 0.9 + Math.floor(i / 2) * 0.04,
                    }}
                  />
                ))}

                {/* Window Glow Gradient */}
                <defs>
                  <radialGradient id="windowGlowYellowBlue" cx="50%" cy="50%" r="80%">
                    <stop offset="0%" stopColor="#faff70" /> {/* Neon yellow */}
                    <stop offset="60%" stopColor="#faff70" />
                    <stop offset="100%" stopColor="#38bdf8" /> {/* Sky blue */}
                  </radialGradient>
                  {/* ...existing gradients and filters... */}
                </defs>

                {/* Entrance lighting */}
                <motion.rect
                  x="85"
                  y="195"
                  width="30"
                  height="15"
                  fill="#f1f5f9"
                  stroke="#cbd5e1"
                  strokeWidth="1"
                  rx="2"
                  animate={{
                    opacity: [0.5, 0.9, 0.5],
                  }}
                  transition={{
                    duration: 1.2,
                    delay: 0.7,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* Subtle building fill with gradient */}
                <motion.rect
                  x="60"
                  y="50"
                  width="80"
                  height="160"
                  fill="url(#buildingGlow)"
                  opacity="0.13"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.13 }}
                  transition={{ duration: 1, delay: 1.2 }}
                />

                {/* Connecting bridges */}
                <motion.line
                  x1="60"
                  y1="120"
                  x2="30"
                  y2="120"
                  stroke="#cbd5e1"
                  strokeWidth="1"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3, delay: 0.7 }}
                />

                <motion.line
                  x1="140"
                  y1="110"
                  x2="170"
                  y2="110"
                  stroke="#cbd5e1"
                  strokeWidth="1"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3, delay: 0.8 }}
                />
              </svg>

              {/* Ambient glow effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-radial from-neutral-200/30 via-transparent to-transparent pointer-events-none rounded-full"
                animate={{
                  opacity: [0, 0.25, 0],
                  scale: [0.9, 1.1, 0.9],
                }}
                transition={{
                  duration: 3,
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
