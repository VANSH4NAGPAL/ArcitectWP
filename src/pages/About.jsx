import React, { useRef, useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars } from 'react-icons/fa';
import gsap from 'gsap';

const About = () => {
  const headerRef = useRef(null);
  const [showMobileNav, setShowMobileNav] = useState(false);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.from(headerRef.current, {
      opacity: 0,
      y: -40,
      duration: 0.8,
      ease: 'power3.out',
      clearProps: 'all'
    });
    return () => tl.kill();
  }, []);

  return (
    <div className="min-h-screen bg-[#faf9f7] flex flex-col px-8 md:px-20">
      {/* MOBILE NAV BUTTON */}
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
          <FaBars className="text-2xl text-gray-800" />
        </motion.span>
      </motion.button>

      {/* MOBILE NAV OVERLAY */}
      <AnimatePresence>
        {showMobileNav && (
          <motion.div
            className="fixed inset-0 z-50 bg-white bg-opacity-95 flex flex-col items-center justify-center"
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
              <span className="text-2xl text-gray-800">&times;</span>
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

      {/* TOP NAVIGATION BAR */}
      <header
        ref={headerRef}
        className="w-full flex flex-col items-center bg-white border-b border-gray-200 !px-4 md:!px-12 !py-4 md:!py-6"
      >
        {/* PAGE HEADING with logo and About Us side by side */}
        <div className="w-full flex flex-col md:flex-row items-center justify-center md:justify-between !mt-2">
          <div className="flex items-center gap-4 md:gap-6">
            <img
              src="/logofull.png"
              alt="Archdeco Logo"
              className="h-20 w-auto object-contain"
              style={{ maxHeight: 80 }}
            />
            <h1
              className="font-bold uppercase tracking-widest text-3xl md:text-4xl"
              style={{
                fontFamily: 'Coolvetica Extra Light',
                color: '#181818',
                letterSpacing: '0.03em',
              }}
            >
              About Us
            </h1>
          </div>
          <div className="!mt-4 md:!mt-0 md:!ml-8 flex justify-center hidden lg:flex">
            <Navigation textColor="black" horizontal />
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col !gap-12 !px-4 md:!px-12 !py-8 md:!py-12">
        {/* HERO SECTION */}
        <section
          className="flex flex-col md:flex-row w-full bg-[#faf9f7] border-b border-gray-200 rounded-xl md:rounded-2xl !p-4 md:!p-8"
        >
          {/* Left: Heading and subtext */}
          <div className="flex-1 flex flex-col justify-center !pr-0 md:!pr-8 !pb-8 md:!pb-0">
            <h2
              className="font-light"
              style={{
                fontFamily: 'Coolvetica Extra Light',
                fontWeight: 300,
                fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                letterSpacing: '0.01em',
                lineHeight: 1.1,
                textTransform: 'uppercase',
                color: '#181818',
                marginBottom: '2.5rem',
                maxWidth: 500,
              }}
            >
              Welcome to our world where inspiration drives design
            </h2>
            <p className="text-gray-600 text-base md:text-lg font-light max-w-md leading-relaxed">
              We create beautiful spaces that reflect your unique vision and personality. Our team blends creativity with technical expertise to deliver exceptional results for every project.
            </p>
          </div>
          {/* Right: Hero image */}
          <div className="flex-1 min-h-[340px] relative flex items-center justify-center !px-0 md:!px-2">
            <img
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
              alt="Modern office space"
              className="w-full h-[340px] md:h-[420px] object-cover object-center rounded-lg shadow"
              style={{ maxHeight: 420 }}
            />
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section
          className="w-full bg-[#faf9f7] border-b border-gray-200 rounded-xl md:rounded-2xl !p-4 md:!p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 !gap-8 items-center">
            {/* Left: Two stacked images */}
            <div className="md:col-span-3 flex flex-col !gap-4">
              <img
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
                alt="Team collaboration"
                className="w-full h-40 md:h-48 object-cover rounded-lg shadow"
              />
              <img
                src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80"
                alt="Design process"
                className="w-full h-32 md:h-40 object-cover rounded-lg shadow"
              />
            </div>
            {/* Center: Single tall image */}
            <div className="md:col-span-3 flex items-center">
              <img
                src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80"
                alt="Team meeting"
                className="w-full h-40 md:h-80 object-cover rounded-lg shadow"
              />
            </div>
            {/* Right: About text */}
            <div className="md:col-span-6 flex flex-col justify-center !pl-0 md:!pl-8">
              <h2
                className="!mb-6"
                style={{
                  fontFamily: 'Coolvetica Extra Light',
                  fontWeight: 300,
                  fontSize: '2.2rem',
                  color: '#181818',
                  letterSpacing: '0.01em',
                  textTransform: 'none',
                }}
              >
                About Our Work
              </h2>
              <p className="text-gray-700 text-lg font-light !mb-4 leading-relaxed">
                Our team works at the intersection of design, strategy, and making. We create spaces that inspire, using a collaborative approach to bring your vision to life.
              </p>
              <p className="text-gray-600 text-lg font-light leading-relaxed">
                Every project is unique, and we pride ourselves on attention to detail and a passion for excellence. From concept to completion, we ensure a seamless process and outstanding results.
              </p>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full text-center text-xs text-gray-400 !py-4 bg-white border-t border-gray-200 !mt-8">
        &copy; {new Date().getFullYear()} Archdeco
      </footer>
    </div>
  );
};

export default About;