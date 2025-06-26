import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { projects, getExteriorProjects, getInteriorProjects } from '../data/projects';
import '../App.css';

function ProjectDetail() {
  console.log('ProjectDetail component is rendering');
  const { id } = useParams();
  console.log('Current URL params:', { id });
  
  const [hoveredProject, setHoveredProject] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Find the current project
  const currentProject = projects.find(p => p.id === parseInt(id));
  console.log('Found project:', currentProject);

  // Get filtered project data based on current project's ID
  let exteriorProjects = [];
  let interiorProjects = [];

  if (currentProject) {
    exteriorProjects = getExteriorProjects(id); // Pass the ID parameter
    interiorProjects = getInteriorProjects(id); // Pass the ID parameter
    console.log('Exterior projects for current project:', exteriorProjects);
    console.log('Interior projects for current project:', interiorProjects);
  }

  const ProjectCard = ({ project }) => (
    <motion.div
      className="relative cursor-pointer group mb-16"
      onMouseEnter={() => setHoveredProject(project.id)}
      onMouseLeave={() => setHoveredProject(null)}
      onClick={() => navigate(`/project/${project.id}`)}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
    >
      <div 
        className="relative overflow-hidden bg-gray-100 mb-4" 
        style={{ 
          width: '360px', 
          height: '543.14px'
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
        className="text-left !pt-7"
        animate={{ y: hoveredProject === project.id ? -3 : 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <h3 className="text-[20px] font-400 text-gray-900 transition-colors duration-300 group-hover:text-gray-700">
          {project.title}
        </h3>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row overflow-hidden">
      {/* Mobile Menu Button - Only visible on mobile */}
      <motion.button
        className="lg:hidden fixed top-6 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center bg-transparent cursor-pointer "
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="w-10 h-10 rounded-full relative"
          style={{
            background: `conic-gradient(from 0deg, black 0deg, black 270deg, transparent 270deg, transparent 360deg)`,
            padding: '1px',
          }}
          whileHover={{
            rotate: 360,
            transition: { duration: 0.8, ease: "easeInOut" }
          }}
        >
          <div className="w-full h-full rounded-full bg-gray-50" />
        </motion.div>
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
        className="hidden lg:flex lg:w-[33%] lg:h-screen flex-col relative"
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
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.h1
            className="text-black mb-8 font-bold tracking-wider text-[32px]"
            style={{ fontFamily: '"Nunito Sans", sans-serif' }}
            whileHover={{ scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
            StudioDesignPalette
          </motion.h1>

          <Navigation textColor="black" noActiveState={true} />
        </motion.div>

        {/* Description */}
        
      </div>

      {/* Main Content Area - Desktop: 67% split into two columns | Mobile: Full width single column */}
      <div className="w-full lg:w-[67%] flex flex-col lg:flex-row lg:h-screen">
        {/* Exterior Section - Only show if current project is exterior */}
        {exteriorProjects.length > 0 && (
          <div 
            className="w-full lg:w-1/2 lg:border-r lg:border-gray-200 lg:h-full overflow-y-auto"
            style={{ scrollBehavior: 'smooth' }}
          >
            <div className="px-4 lg:px-8 py-8 lg:py-16 pt-20 lg:pt-16 flex justify-center !mt-20">
              <div className="flex flex-col items-center">
                <motion.div
                  className="flex flex-col items-center relative gap-8 lg:gap-35"
                  style={{ marginTop: '2rem lg:6rem' }}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  {exteriorProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      className="relative"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                    >
                      {/* EXTERIOR label */}
                      {index === 0 && (
                        <motion.div
                          className="absolute left-[-60px] lg:left-[-110px] top-8 text-xs tracking-[0.3em] text-black font-bold transform -rotate-90"
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
                </motion.div>
              </div>
            </div>
          </div>
        )}

        {/* Interior Section - Only show if current project is interior */}
        {interiorProjects.length > 0 && (
          <div 
            className={`w-full ${exteriorProjects.length > 0 ? 'lg:w-1/2' : ''} lg:h-full overflow-y-auto !mt-20`}
            style={{ scrollBehavior: 'smooth' }}
          >
            <div className="px-4 lg:px-8 py-8 lg:py-16 pt-8 lg:pt-16 flex justify-center">
              <div className="flex flex-col items-center">
                <motion.div
                  className="flex flex-col items-center relative gap-8 lg:gap-35"
                  style={{ marginTop: '2rem lg:6rem' }}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
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
                      {/* INTERIOR label */}
                      {index === 0 && (
                        <motion.div
                          className="absolute left-[-60px] lg:left-[-110px] top-8 text-xs tracking-[0.3em] text-black font-bold transform -rotate-90"
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
        
        .overflow-y-auto::-webkit-scrollbar {
          display: none;
        }
        
        .overflow-y-auto {
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