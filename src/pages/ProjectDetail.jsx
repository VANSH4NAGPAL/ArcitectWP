import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { projects, getExteriorProjects, getInteriorProjects } from '../data/projects';
import '../App.css';

function ProjectDetail() {
  const { id } = useParams();
  const [hoveredProject, setHoveredProject] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [modalImages, setModalImages] = useState(null);
  const [modalIndex, setModalIndex] = useState(0); // 0 for main, 1 for hover

  // Find the current project
  const currentProject = projects.find(p => p.id === parseInt(id));

  // Get filtered project data based on current project's ID
  let exteriorProjects = [];
  let interiorProjects = [];

  if (currentProject) {
    exteriorProjects = getExteriorProjects(id);
    interiorProjects = getInteriorProjects(id);
  }

  // Modal for showing one image at a time with navigation, square, transparent, beautiful nav buttons, dull background
  const ImageModal = ({ images, onClose }) => {
    if (!images) return null;
    const imageList = [
      { src: images.main },
      { src: images.hover }
    ];

    // Track direction for fade animation
    const [direction, setDirection] = useState(0);

    // Fade variants (no slide, just smooth fade)
    const variants = {
      enter: { opacity: 0, scale: 0.98, position: "absolute" },
      center: { opacity: 1, scale: 1, position: "relative" },
      exit: { opacity: 0, scale: 1.02, position: "absolute" }
    };

    // Handlers for next/prev
    const handleNext = (e) => {
      e.stopPropagation();
      setDirection(1);
      setModalIndex((prev) => (prev + 1) % imageList.length);
    };
    const handlePrev = (e) => {
      e.stopPropagation();
      setDirection(-1);
      setModalIndex((prev) => (prev + imageList.length - 1) % imageList.length);
    };

    return (
      <AnimatePresence custom={direction}>
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.35, ease: "easeInOut" } }}
          exit={{ opacity: 0, transition: { duration: 0.25, ease: "easeInOut" } }}
          style={{ background: "rgba(0,0,0,0.92)", cursor: "pointer" }}
          onClick={onClose}
        >
          <motion.div
            className="relative flex items-center justify-center"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, transition: { duration: 0.35, ease: "easeInOut" } }}
            exit={{ scale: 0.95, opacity: 0, transition: { duration: 0.25, ease: "easeInOut" } }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={e => e.stopPropagation()}
            style={{
              width: 'min(90vw, 90vh)',
              height: 'min(90vw, 90vh)',
              maxWidth: 800,
              maxHeight: 800,
              background: 'transparent',
              borderRadius: '2rem',
              boxShadow: 'none',
              overflow: 'hidden',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-black text-3xl font-bold bg-white/80 rounded-full w-12 h-12 flex items-center justify-center shadow transition"
              onClick={onClose}
              aria-label="Close"
              style={{
                zIndex: 10,
                backdropFilter: 'blur(4px)',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              &times;
            </button>
            {/* Back Button */}
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-gray-200 text-gray-700 hover:text-black rounded-full w-12 h-12 flex items-center justify-center shadow transition text-2xl"
              onClick={handlePrev}
              style={{ zIndex: 10, border: 'none', cursor: 'pointer' }}
              aria-label="Previous"
            >
              <span style={{ fontWeight: 700, fontSize: 28 }}>&#8592;</span>
            </button>
            {/* Forward Button */}
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-gray-200 text-gray-700 hover:text-black rounded-full w-12 h-12 flex items-center justify-center shadow transition text-2xl"
              onClick={handleNext}
              style={{ zIndex: 10, border: 'none', cursor: 'pointer' }}
              aria-label="Next"
            >
              <span style={{ fontWeight: 700, fontSize: 28 }}>&#8594;</span>
            </button>
            {/* Smooth Fade Image */}
            <AnimatePresence custom={direction} mode="wait">
              <motion.img
                key={modalIndex}
                src={imageList[modalIndex].src}
                alt=""
                className="object-contain w-full h-full rounded-2xl transition-all duration-300"
                style={{
                  background: 'transparent',
                  boxShadow: '0 4px 32px 0 rgba(0,0,0,0.10)',
                  cursor: 'default'
                }}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  opacity: { duration: 0.35, ease: "easeInOut" },
                  scale: { duration: 0.35, ease: "easeInOut" }
                }}
              />
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  const ProjectCard = ({ project }) => (
    <motion.div
      className="relative cursor-pointer group !mb-8 sm:!mb-12 md:!mb-16"
      onMouseEnter={() => setHoveredProject(project.id)}
      onMouseLeave={() => setHoveredProject(null)}
      onClick={() => {
        setModalImages({ main: project.mainImage, hover: project.hoverImage });
        setModalIndex(0);
      }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className="relative overflow-hidden bg-gray-100 !mb-4"
        style={{
          width: '100%',
          maxWidth: '320px',
          height: 'min(128vw, 377px)',
          maxHeight: '482px'
        }}
      >
        {/* Main Image */}
        <motion.img
          src={project.mainImage}
          alt={project.title}
          className="w-full h-full object-cover absolute inset-0"
          initial={{ opacity: 1 }}
          animate={{
            opacity: hoveredProject === project.id ? 0 : 1
          }}
          transition={{
            opacity: { duration: 0.6, ease: "easeInOut" }
          }}
          style={{
            transform: hoveredProject === project.id ? 'scale(1.03)' : 'scale(1)',
            transition: 'transform 0.6s ease-out'
          }}
        />

        {/* Hover Image */}
        <motion.img
          src={project.hoverImage}
          alt={project.title}
          className="w-full h-full object-cover absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{
            opacity: hoveredProject === project.id ? 1 : 0
          }}
          transition={{
            opacity: { duration: 0.6, ease: "easeInOut" }
          }}
          style={{
            transform: hoveredProject === project.id ? 'scale(1.03)' : 'scale(1)',
            transition: 'transform 0.6s ease-out'
          }}
        />

        {/* Subtle overlay for depth */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: hoveredProject === project.id ? 1 : 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />
      </div>

      {/* Clean project name - left aligned */}
      <motion.div
        className="text-left !pt-4 sm:!pt-5 lg:!pt-7"
        animate={{ y: hoveredProject === project.id ? -3 : 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <h3 className="text-lg sm:text-[20px] font-400 text-gray-900 transition-colors duration-300 group-hover:text-gray-700">
          {project.title}
        </h3>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row overflow-x-hidden">
      {/* Modal for images */}
      <ImageModal images={modalImages} onClose={() => setModalImages(null)} />

      {/* Mobile Menu Button - Only visible on mobile */}
      <motion.button
        className="lg:hidden fixed top-4 sm:top-6 right-4 sm:right-6 z-50 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-transparent cursor-pointer"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.08 }}
      >
        <motion.svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          className="w-8 h-8 sm:w-10 sm:h-10"
          style={{ background: 'transparent', display: 'block' }}
        >
          {/* Animated fill circle */}
          <motion.circle
            cx="20"
            cy="20"
            r="18"
            fill="black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }}
            whileHover={{ opacity: 0.7, transition: { duration: 0.5, ease: "easeInOut" } }}
            whileTap={{ opacity: 0.7, transition: { duration: 0.3, ease: "easeInOut" } }}
            style={{ originX: 0.5, originY: 0.5 }}
          />
          {/* Stroke circle */}
          <motion.circle
            cx="20"
            cy="20"
            r="18"
            fill="none"
            stroke="black"
            strokeWidth="2.5"
            initial={{ stroke: "#000", opacity: 1 }}
            whileHover={{ stroke: "#555", opacity: 0.7, transition: { duration: 0.4 } }}
            whileTap={{ stroke: "#555", opacity: 0.7, transition: { duration: 0.4 } }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          />
        </motion.svg>
      </motion.button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="lg:hidden fixed inset-0 bg-white z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <Navigation
                  textColor="black"
                  isMobile={true}
                  noActiveState={true}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Left Sidebar - Hidden on mobile, visible on desktop */}
      <div
        className="hidden lg:flex lg:w-[33%] lg:h-screen flex-col relative overflow-hidden"
        style={{
          backgroundImage: "url('/images/pb.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'bottom',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Logo + Navigation Section */}
        <motion.div
          className="p-12 flex-shrink-0 fixed top-8 left-8 z-50"
          style={{ 
            minWidth: 0,
            maxWidth: 'calc(33vw - 4rem)'
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <img
            src="/logofull.png"
            alt="StudioDesignPalette Logo"
            className="object-contain rounded-lg"
            style={{
              marginLeft: -13,
              width: 230,
              height: 'auto',
            }}
          />
          <Navigation textColor="black" noActiveState={true} />
        </motion.div>
      </div>

      {/* Main Content Area */}
      <div className="w-full lg:w-[67%] flex flex-col lg:flex-row lg:h-screen overflow-x-hidden">
        {/* Exterior Section */}
        {exteriorProjects.length > 0 && (
          <div
            className="w-full lg:w-1/2 lg:border-r lg:border-gray-200 lg:h-full overflow-y-auto"
            style={{ scrollBehavior: 'smooth' }}
          >
            <div className="!px-6 sm:!px-8 lg:!px-12 !py-8 sm:!py-12 lg:!py-20 !pt-20 sm:!pt-24 lg:!pt-20 flex justify-center !mt-12 sm:!mt-16 lg:!mt-0">
              <div className="flex flex-col items-center">
                <motion.div
                  className="flex flex-col items-center relative !gap-8 sm:!gap-12 lg:!gap-16"
                  style={{ marginTop: '2rem sm:3rem lg:4rem' }}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  {/* Mobile: Show projects horizontally */}
                  <div className="lg:hidden flex flex-col gap-8 sm:gap-12 overflow-x-auto w-full justify-start px-4">
                    {exteriorProjects.map((project, index) => (
                      <motion.div
                        key={project.id}
                        className="relative flex-shrink-0"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                      >
                        {/* EXTERIOR label for mobile */}
                        {index === 0 && (
                          <motion.div
                            className="sticky left-0 top-[-25px] text-[10px] sm:text-xs tracking-[0.3em] !text-black font-bold"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                          >
                            EXTERIOR
                          </motion.div>
                        )}
                        <ProjectCard project={project} />
                      </motion.div>
                    ))}
                  </div>

                  {/* Desktop: Show projects vertically */}
                  <div className="hidden lg:flex lg:flex-col items-center gap-16">
                    {exteriorProjects.map((project, index) => (
                      <motion.div
                        key={project.id}
                        className="relative"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                      >
                        {/* EXTERIOR label for desktop */}
                        {index === 0 && (
                          <motion.div
                            className="absolute left-[-90px] top-6 sm:top-8 text-xs tracking-[0.3em] text-black font-bold transform -rotate-90"
                            style={{ transformOrigin: 'center' }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                          >
                            EXTERIOR
                          </motion.div>
                        )}
                        <ProjectCard project={project} />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        )}

        {/* Interior Section */}
        {interiorProjects.length > 0 && (
          <div
            className={`w-full ${exteriorProjects.length > 0 ? 'lg:w-1/2' : ''} lg:h-full overflow-y-auto !mt-12 sm:!mt-16 lg:!mt-0`}
            style={{ scrollBehavior: 'smooth' }}
          >
            <div className="!px-6 sm:!px-8 lg:!px-12 !py-8 sm:!py-12 lg:!py-20 !pt-8 sm:!pt-12 lg:!pt-20 flex justify-center">
              <div className="flex flex-col items-center">
                <motion.div
                  className="flex flex-col items-center relative !gap-8 sm:!gap-12 lg:!gap-16"
                  style={{ marginTop: '2rem sm:3rem lg:4rem' }}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  {/* Mobile: Show projects horizontally */}
                  <div className="lg:hidden flex flex-col gap-8 sm:gap-12 overflow-x-auto w-full justify-start px-4">
                    {interiorProjects.map((project, index) => (
                      <motion.div
                        key={project.id}
                        className="relative flex-shrink-0"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                      >
                        {/* INTERIOR label for mobile */}
                        {index === 0 && (
                          <motion.div
                            className="sticky left-0 top-[-25px] text-[10px] sm:text-xs tracking-[0.3em] text-black font-bold"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                          >
                            INTERIOR
                          </motion.div>
                        )}
                        <ProjectCard project={project} />
                      </motion.div>
                    ))}
                  </div>

                  {/* Desktop: Show projects vertically */}
                  <div className="hidden lg:flex lg:flex-col items-center gap-16">
                    {interiorProjects.map((project, index) => (
                      <motion.div
                        key={project.id}
                        className="relative"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                        style={{
                          animationDelay: `${index * 0.1}s`,
                          animation: `fadeInUp 0.6s ease-out forwards`,
                          opacity: 0
                        }}
                      >
                        {/* INTERIOR label for desktop */}
                        {index === 0 && (
                          <motion.div
                            className="absolute left-[-90px] top-6 sm:top-8 text-xs tracking-[0.3em] text-black font-bold transform -rotate-90"
                            style={{ transformOrigin: 'center' }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                          >
                            INTERIOR
                          </motion.div>
                        )}
                        <ProjectCard project={project} />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .border-r {
          border-right: 1px solid #d1d5db;
        }

        .overflow-y-auto::-webkit-scrollbar,
        .overflow-x-auto::-webkit-scrollbar {
          display: none;
        }

        .overflow-y-auto,
        .overflow-x-auto {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        /* Prevent any scrolling on the left sidebar for desktop */
        @media (min-width: 1024px) {
          .lg\\:w-\\[33\\%\\] {
            overflow: hidden !important;
          }
        }
      `}</style>
    </div>
  );
}

export default ProjectDetail;