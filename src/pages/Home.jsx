import React, { useState, useEffect } from "react";
import gsap from "gsap";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "../components/Navigation";
import { FaBars } from "react-icons/fa";
import { projects } from "../data/projects";
import { usePageLoader } from "../hooks/usePageLoader";
import "../App.css";
import { useGSAP } from "@gsap/react";

function Home() {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [showVideoLoader, setShowVideoLoader] = useState(false);
  const [minLoadingTime, setMinLoadingTime] = useState(false);
  const { isLoading: pageLoading } = usePageLoader();
  const [showMobileNav, setShowMobileNav] = useState(false);

  const menuItems = projects.slice(0, 4);

  // Handle loading state
  useEffect(() => {
    if (!pageLoading && !videoLoaded) {
      setShowVideoLoader(true);
      const timer = setTimeout(() => setMinLoadingTime(true), 2000);
      return () => clearTimeout(timer);
    } else {
      setShowVideoLoader(false);
    }
  }, [pageLoading, videoLoaded]);

  useEffect(() => {
    if (videoLoaded && minLoadingTime) setShowVideoLoader(false);
  }, [videoLoaded, minLoadingTime]);

  const handleVideoLoaded = () => {
    setVideoLoaded(true);
    if (minLoadingTime) setShowVideoLoader(false);
  };

  const toggleOverlay = () => setIsOverlayOpen(!isOverlayOpen);

  // ✅ GSAP Timeline Animation
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

    // 1️⃣ Logo Reveal
    tl.fromTo("#logo", {
      clipPath: "inset(0% 50% 0% 50%)",
      opacity: 0,
    }, {
      clipPath: "inset(0% 0% 0% 0%)",
      opacity: 1,
      duration: 1.2,
    });

    // 2️⃣ Navbar Reveal
    tl.fromTo(".navbar", {
      opacity: 0,
      y: -20,
      duration: 0.6,
    }, {
      opacity: 1,
      y: 0,
      duration: 0.6, // Overlap with logo reveal
    });

    // 3️⃣ Overlay Toggle Reveal
    tl.fromTo(".overlay-toggle", {
      opacity: 0,
      y: -20,
      duration: 0.6,
    }, {
      opacity: 1,
      y: 0,
      duration: 0.6, // Overlap with navbar reveal
    });
  });

  return (
    <div className="relative w-full h-screen overflow-hidden bg-white">
      {/* Mobile Nav Button */}
      <>
        <motion.button
          className="fixed top-4 right-4 z-[70] lg:hidden w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center"
          onClick={() => setShowMobileNav(true)}
          aria-label="Open navigation"
          whileHover={{ scale: 1.12, rotate: 10, boxShadow: "0 8px 32px rgba(0,0,0,0.18)" }}
          whileTap={{ scale: 0.95, rotate: -10 }}
          initial={{ opacity: 0, y: -20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={{ pointerEvents: showMobileNav ? 'none' : 'auto' }}
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
              className="fixed inset-0 z-[100] bg-white/60 backdrop-blur-md flex flex-col items-center justify-center"
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

      {/* 🖼️ Centered Logo */}
      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
        <img
          src="/logofullw.png"
          alt="StudioDesignPalette Logo"
          className="w-64 h-auto max-w-xs md:w-160 select-none"
          style={{ filter: 'drop-shadow(0 2px 16px rgba(0,0,0,0.10))' }}
          draggable="false"
          id="logo"
        />
      </div>

      {/* 📌 Top Right Navigation (Desktop) */}
      <div className="fixed top-4 right-4 md:top-8 md:right-8 z-[60] navbar hidden lg:block">
        <Navigation horizontal={true} textColor="white" />
      </div>

      {/* 📌 Top Left Toggle Overlay Button */}
      <div className="fixed top-4 left-4 md:top-8 md:left-8 z-[60] overlay-toggle">
        <button
          className={`relative w-12 h-12 md:w-16 md:h-16 flex items-center justify-center ${isOverlayOpen ? "text-slate-800" : "text-white"}`}
          onClick={toggleOverlay}
        >
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 64 64">
            <circle
              cx="32"
              cy="32"
              r="25"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="150 10"
              style={{ opacity: isOverlayOpen ? 0 : 1 }}
            />
            <line
              x1="20"
              y1="32"
              x2="44"
              y2="32"
              stroke="currentColor"
              strokeWidth="0.5"
              style={{ opacity: isOverlayOpen ? 1 : 0 }}
            />
          </svg>
          <div className="relative z-10 flex flex-col items-center justify-center">
            {!isOverlayOpen ? (
              <div className="space-y-1">
                <div className="w-3 h-0.5 md:w-4 md:h-0.5 bg-current" />
              </div>
            ) : (
              <div className="w-5 h-0.5 md:w-6 md:h-0.5 bg-current" />
            )}
          </div>
        </button>
      </div>

      {/* 🎬 Video Background */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
        <video
          className="w-full h-full object-cover"
          src="/BG-VID.mp4"
          autoPlay
          loop
          muted
          playsInline
          onCanPlayThrough={handleVideoLoaded}
          onLoadedData={handleVideoLoaded}
        />
      </div>

      {/* ⏳ Loader */}
      {showVideoLoader && (
        <motion.div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
          <motion.h1
            className="text-slate-800 text-4xl font-light tracking-[0.2em] mb-12"
            style={{ fontFamily: '"Coolvetica Extra Light", sans-serif' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            StudioDesignPalette
          </motion.h1>
          <div className="relative flex items-center justify-center">
            <motion.div className="w-24 h-24 border-2 border-slate-200 rounded-full" />
            <motion.div
              className="absolute w-24 h-24 border-2 border-transparent border-t-slate-600 border-r-slate-400 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute w-2 h-2 bg-slate-600 rounded-full"
              animate={{ scale: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <motion.div className="mt-6 w-64 h-0.5 bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-slate-400 to-slate-600"
              animate={{ width: "100%" }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          </motion.div>
        </motion.div>
      )}

      {/* 📂 Overlay Menu */}
      <AnimatePresence>
        {isOverlayOpen && (
          <motion.div
            className="fixed inset-0 z-[55] bg-white overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <motion.div
              className="absolute top-4 md:top-8 left-1/2 transform -translate-x-1/2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-slate-800 text-3xl font-bold tracking-wider text-center">
                StudioDesignPalette
              </h1>
            </motion.div>

            <div className="flex items-center justify-center min-h-screen p-8 pt-24">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl w-full">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.title}
                    className="group cursor-pointer"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  >
                    <div className="relative mb-4">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="object-cover w-full max-w-[295px] h-auto transition-all duration-500 group-hover:grayscale"
                        style={{ aspectRatio: "295 / 454" }}
                      />
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-xs text-slate-500 uppercase tracking-widest">
                        {item.category} • {item.type}
                      </p>
                      <h3 className="text-lg font-light text-slate-800">
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-600 font-light">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Home;
