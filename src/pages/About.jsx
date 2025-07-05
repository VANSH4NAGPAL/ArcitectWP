import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars } from 'react-icons/fa';
import Navigation from '../components/Navigation';

const About = () => {
  const [showMobileNav, setShowMobileNav] = useState(false);

  return (
    <div className="min-h-screen bg-[#faf9f7] flex flex-col !px-0 md:!px-0">
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
          className="flex-1 flex flex-col !gap-12 !px-4 md:!px-12 !py-8 md:!py-12 !mt-8 md:!mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* HERO SECTION */}
          <motion.section
            className="flex flex-col md:flex-row w-full bg-[#faf9f7] border-b border-gray-200   !p-4 md:!p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            whileHover={{ scale: 1.01, boxShadow: "0 8px 32px rgba(0,0,0,0.1)" }}
          >
            {/* Left: Heading and subtext */}
            <div className="flex-1 flex flex-col justify-center !pr-0 md:!pr-8 !pb-8 md:!pb-0">
              <motion.h2
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
                whileHover={{ scale: 1.02, color: '#000' }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                Welcome to our world where inspiration drives design
              </motion.h2>
              <motion.p 
                className="text-gray-600 text-base md:text-lg font-light max-w-md leading-relaxed"
                whileHover={{ color: '#374151' }}
                transition={{ duration: 0.3 }}
              >
                We create beautiful spaces that reflect your unique vision and personality. Our team blends creativity with technical expertise to deliver exceptional results for every project.
              </motion.p>
            </div>
            
            {/* Right: Person image */}
            <div className="flex-1 min-h-[340px] relative flex items-center justify-center !px-0 md:!px-2">
              {/* Person photo - full height */}
              <div className="w-full max-w-md">
                <motion.img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Full body portrait of team member"
                  className="w-full h-[340px] md:h-[420px] object-cover object-center  shadow"
                  style={{ maxHeight: 420 }}
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                    filter: "brightness(1.1)"
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </div>
            </div>
          </motion.section>

          {/* ABOUT SECTION */}
          <motion.section
            className="w-full bg-[#faf9f7] border-b border-gray-200  !p-4 md:!p-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            whileHover={{ scale: 1.01, boxShadow: "0 8px 32px rgba(0,0,0,0.1)" }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 !gap-8 items-start">
              {/* Left: Modern asymmetrical image grid */}
              <div className="lg:col-span-7">
                <div className="grid grid-cols-6 grid-rows-4 !gap-3 h-[400px] md:h-[500px]">
                  {/* Large featured image - spans 4 columns, 3 rows */}
                  <motion.div
                    className="col-span-4 row-span-3 relative group overflow-hidden  shadow-lg"
                    whileHover={{ scale: 1.02, rotate: 0.5 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    <motion.img
                      src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
                      alt="Team collaboration"
                      className="w-full h-full object-cover"
                      whileHover={{ 
                        scale: 1.1,
                        filter: "brightness(1.1) saturate(1.2) contrast(1.1)"
                      }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.div>

                  {/* Small image - top right */}
                  <motion.div
                    className="col-span-2 row-span-1 relative group overflow-hidden  shadow-md"
                    whileHover={{ scale: 1.05, rotate: -1 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    <motion.img
                      src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80"
                      alt="Design process"
                      className="w-full h-full object-cover"
                      whileHover={{ 
                        scale: 1.15,
                        filter: "brightness(1.2) saturate(1.3)"
                      }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.div>

                  {/* Medium image - middle right */}
                  <motion.div
                    className="col-span-2 row-span-2 relative group overflow-hidden  shadow-md"
                    whileHover={{ scale: 1.03, rotate: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    <motion.img
                      src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80"
                      alt="Team meeting"
                      className="w-full h-full object-cover"
                      whileHover={{ 
                        scale: 1.1,
                        filter: "brightness(1.1) saturate(1.1) contrast(1.05)"
                      }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-tl from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.div>

                  {/* Wide image - bottom */}
                  <motion.div
                    className="col-span-6 row-span-1 relative group overflow-hidden  shadow-md"
                    whileHover={{ scale: 1.02, y: -2 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    <motion.img
                      src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                      alt="Architecture design"
                      className="w-full h-full object-cover"
                      whileHover={{ 
                        scale: 1.05,
                        filter: "brightness(1.05) saturate(1.1)"
                      }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-transparent to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.div>
                </div>
              </div>

              {/* Right: About text */}
              <motion.div 
                className="lg:col-span-5 flex flex-col justify-center !pl-0 lg:!pl-8 !pt-8 lg:!pt-0"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <motion.h2
                  className="!mb-6"
                  style={{
                    fontFamily: 'Coolvetica Extra Light',
                    fontWeight: 300,
                    fontSize: '2.2rem',
                    color: '#181818',
                    letterSpacing: '0.01em',
                    textTransform: 'none',
                  }}
                  whileHover={{ scale: 1.02, color: '#000' }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  About Our Work
                </motion.h2>
                <motion.p 
                  className="text-gray-700 text-lg font-light !mb-4 leading-relaxed"
                  whileHover={{ color: '#374151' }}
                  transition={{ duration: 0.3 }}
                >
                  Our team works at the intersection of design, strategy, and making. We create spaces that inspire, using a collaborative approach to bring your vision to life.
                </motion.p>
                <motion.p 
                  className="text-gray-600 text-lg font-light leading-relaxed"
                  whileHover={{ color: '#374151' }}
                  transition={{ duration: 0.3 }}
                >
                  Every project is unique, and we pride ourselves on attention to detail and a passion for excellence. From concept to completion, we ensure a seamless process and outstanding results.
                </motion.p>
              </motion.div>
            </div>
          </motion.section>
        </motion.main>
        
      </div>
    </div>
  );
};

export default About;