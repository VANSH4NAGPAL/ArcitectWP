import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import Navigation from '../components/Navigation';
import { projects, getExteriorProjects, getInteriorProjects } from '../data/projects';
import '../App.css';

function ProjectDetail() {
  const { id } = useParams();
  // Convert id to number once
  const numericId = Number(id);
  const titleRef = useRef(null);
  const lineRef = useRef(null);
  const [hoveredProject, setHoveredProject] = useState(null);
  const [modalImages, setModalImages] = useState(null);
  const [modalIndex, setModalIndex] = useState(0);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [showSections, setShowSections] = useState(true); // Always show sections, no animation

  const currentProject = projects.find(p => p.id === numericId);
  const exteriorProjects = currentProject ? getExteriorProjects(numericId) : [];
  const interiorProjects = currentProject ? getInteriorProjects(numericId) : [];

  // --- Modal for Images ---
  const ImageModal = ({ images, onClose }) => {
    if (!images) return null;
    const imageList = [{ src: images.main }, { src: images.hover }];
    const [direction, setDirection] = useState(0);
    // Remove animation variants
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
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ background: "rgba(0,0,0,0.92)", cursor: "pointer" }}
        onClick={onClose}
      >
        <div
          className="relative flex items-center justify-center"
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
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-black text-3xl font-bold bg-white/80 rounded-full w-12 h-12 flex items-center justify-center shadow transition"
            onClick={onClose}
            aria-label="Close"
            style={{ zIndex: 10, backdropFilter: 'blur(4px)', border: 'none', cursor: 'pointer' }}
          >
            &times;
          </button>
          <button
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-gray-200 text-gray-700 hover:text-black rounded-full w-12 h-12 flex items-center justify-center shadow transition text-2xl"
            onClick={handlePrev}
            style={{ zIndex: 10, border: 'none', cursor: 'pointer' }}
            aria-label="Previous"
          >
            <span style={{ fontWeight: 700, fontSize: 28 }}>&#8592;</span>
          </button>
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-gray-200 text-gray-700 hover:text-black rounded-full w-12 h-12 flex items-center justify-center shadow transition text-2xl"
            onClick={handleNext}
            style={{ zIndex: 10, border: 'none', cursor: 'pointer' }}
            aria-label="Next"
          >
            <span style={{ fontWeight: 700, fontSize: 28 }}>&#8594;</span>
          </button>
          <img
            key={modalIndex}
            src={imageList[modalIndex].src}
            alt=""
            className="object-contain w-full h-full rounded-2xl"
            style={{
              background: 'transparent',
              boxShadow: '0 4px 32px 0 rgba(0,0,0,0.10)',
              cursor: 'default'
            }}
          />
        </div>
      </div>
    );
  };

  const ProjectCard = ({ project }) => (
    <div
      className="relative cursor-pointer group !mb-8 sm:!mb-12 md:!mb-16"
      onMouseEnter={() => setHoveredProject(project.id)}
      onMouseLeave={() => setHoveredProject(null)}
      onClick={() => {
        setModalImages({ main: project.mainImage, hover: project.hoverImage });
        setModalIndex(0);
      }}
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
        <img
          src={project.mainImage}
          alt={project.title}
          className="w-full h-full object-cover absolute inset-0"
          style={{
            opacity: hoveredProject === project.id ? 0 : 1,
            transform: hoveredProject === project.id ? 'scale(1.03)' : 'scale(1)',
            transition: 'none'
          }}
        />
        <img
          src={project.hoverImage}
          alt={project.title}
          className="w-full h-full object-cover absolute inset-0"
          style={{
            opacity: hoveredProject === project.id ? 1 : 0,
            transform: hoveredProject === project.id ? 'scale(1.03)' : 'scale(1)',
            transition: 'none'
          }}
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10"
          style={{
            opacity: hoveredProject === project.id ? 1 : 0,
            transition: 'none'
          }}
        />
      </div>
      <div
        className="text-left !pt-4 sm:!pt-5 lg:!pt-7"
        style={{
          transform: hoveredProject === project.id ? 'translateY(-3px)' : 'translateY(0)',
          transition: 'none'
        }}
      >
        <h3 className="text-lg sm:text-[20px] font-400 text-gray-900 transition-colors duration-300 group-hover:text-gray-700">
          {project.title}
        </h3>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row overflow-x-hidden">
      {/* Mobile Navigation */}
      <button
        className="fixed top-4 right-4 z-50 lg:hidden w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center"
        onClick={() => setShowMobileNav(true)}
        aria-label="Open navigation"
        style={{ transition: 'none' }}
      >
        <span>
          <FaBars className="text-2xl text-gray-800" />
        </span>
      </button>
      {showMobileNav && (
        <div
          className="fixed inset-0 z-50 bg-white bg-opacity-95 flex flex-col items-center justify-center"
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center"
            onClick={() => setShowMobileNav(false)}
            aria-label="Close navigation"
            style={{ transition: 'none' }}
          >
            <span className="text-2xl text-gray-800">&times;</span>
          </button>
          <div>
            <Navigation textColor="black" />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="w-full lg:w-[100%] flex flex-col lg:h-screen overflow-x-hidden ml-0 mt-0 lg:!ml-5 lg:!mt-5 items-center"
      style={{ willChange: "transform, opacity" }}>
        <div className="w-full flex">
          <div className='!pt-12 lg:!pt-0 h-full px-2 sm:!px-4 lg:!px-8 py-4 sm:!py-6 lg:!py-8 w-[90%] lg:w-[100%]'>
            {/* --- New Title and Underline Block --- */}
            <div
            className="relative flex flex-col items-start justify-start w-full !mb-8 sm:!mb-10 lg:!mb-12"
            style={{
              position: "relative",
              width: "100%",
              background: "transparent",
              zIndex: 10,
              marginTop: "2.5rem",
              marginLeft: "0.5rem",
            }}
          >
            <h1
              ref={titleRef}
              className="font-light tracking-tight text-gray-900 lowercase !mb-4 !mt-5"
              style={{
                fontWeight: 700,
                fontSize: 'clamp(2.2rem, 6vw, 4rem)',
                letterSpacing: '0.1em',
                lineHeight: 1.08,
                marginBottom: '0.2rem',
                background: 'transparent',
                width: 'auto',
                maxWidth: '90vw',
                textAlign: 'left',
                zIndex: 70,
                color: '#111',
                opacity: 1,
                transform: 'translateX(0px)',
                paddingLeft: 0,
              }}
            >
              project details
            </h1>
            <div
              ref={lineRef}
              className="!mt-1"
              style={{
                opacity: 1,
                zIndex: 10,
                width: '38%',                // full width underline
                maxWidth: '100vw',
                height: '1px',                // thinnest possible
                background: '#222',
                left: 0,
                transform: 'scaleX(1)',
                transformOrigin: 'left center',
                position: 'relative',
                marginLeft: 0,
                borderRadius: '1px',
              }}
            />
          </div>
          </div>
        </div>
        {showSections && (
          <div className="flex flex-col lg:flex-row w-full h-full">
            {/* Exterior Section */}
            {exteriorProjects.length > 0 && (
              <div className="w-full lg:w-1/2 lg:border-r lg:border-gray-200 lg:h-full overflow-y-auto">
                <div className="!px-6 sm:!px-8 lg:!px-12 !py-8 sm:!py-12 lg:!py-20 sm:!pt-24 lg:!pt-20 flex justify-center sm:!mt-16 lg:!mt-0">
                  <div className="flex flex-col items-center">
                    <div
                      className="flex flex-col items-center relative !gap-8 sm:!gap-12 lg:!gap-16"
                      style={{ marginTop: '2rem sm:3rem lg:4rem' }}
                    >
                      <div className="lg:hidden flex flex-col gap-8 sm:gap-12 overflow-x-auto w-full justify-start px-4">
                        {exteriorProjects.map((project, index) => (
                          <div
                            key={project.id}
                            className="relative flex-shrink-0"
                          >
                            {index === 0 && (
                              <div
                                className="sticky left-0 top-[-25px] text-[10px] sm:text-xs tracking-[0.3em] !text-black font-bold"
                              >
                                EXTERIOR
                              </div>
                            )}
                            <ProjectCard project={project} />
                          </div>
                        ))}
                      </div>
                      <div className="hidden lg:flex lg:flex-col items-center gap-16">
                        {exteriorProjects.map((project, index) => (
                          <div
                            key={project.id}
                            className="relative"
                          >
                            {index === 0 && (
                              <div
                                className="absolute left-[-110px] top-6 sm:top-8 text-l tracking-[0.3em] text-black font-bold transform -rotate-90"
                                style={{ transformOrigin: 'center' }}
                              >
                                EXTERIOR
                              </div>
                            )}
                            <ProjectCard project={project} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Interior Section */}
            {interiorProjects.length > 0 && (
              <div className={`w-full ${exteriorProjects.length > 0 ? 'lg:w-1/2' : ''} lg:h-full overflow-y-auto !mt-12 sm:!mt-16 lg:!mt-0`}>
                <div className="!px-6 sm:!px-8 lg:!px-12 !py-8 sm:!py-12 lg:!py-20 !pt-8 sm:!pt-12 lg:!pt-20 flex justify-center">
                  <div className="flex flex-col items-center">
                    <div
                      className="flex flex-col items-center relative !gap-8 sm:!gap-12 lg:!gap-16"
                      style={{ marginTop: '2rem sm:3rem lg:4rem' }}
                    >
                      <div className="lg:hidden flex flex-col gap-8 sm:gap-12 overflow-x-auto w-full justify-start px-4">
                        {interiorProjects.map((project, index) => (
                          <div
                            key={project.id}
                            className="relative flex-shrink-0"
                          >
                            {index === 0 && (
                              <div
                                className="sticky left-0 top-[-25px] text-[10px] sm:text-xs tracking-[0.3em] text-black font-bold"
                              >
                                INTERIOR
                              </div>
                            )}
                            <ProjectCard project={project} />
                          </div>
                        ))}
                      </div>
                      <div className="hidden lg:flex lg:flex-col items-center gap-16">
                        {interiorProjects.map((project, index) => (
                          <div
                            key={project.id}
                            className="relative"
                          >
                            {index === 0 && (
                              <div
                                className="absolute left-[-110px] top-6 sm:top-8 text-l tracking-[0.3em] text-black font-bold transform -rotate-90"
                                style={{ transformOrigin: 'center' }}
                              >
                                INTERIOR
                              </div>
                            )}
                            <ProjectCard project={project} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {modalImages && (
        <ImageModal images={modalImages} onClose={() => setModalImages(null)} />
      )}
      <style jsx>{`
        .border-r { border-right: 1px solid #d1d5db; }
        .overflow-y-auto::-webkit-scrollbar, .overflow-x-auto::-webkit-scrollbar { display: none; }
        .overflow-y-auto, .overflow-x-auto { -ms-overflow-style: none; scrollbar-width: none; }
        .typing-indicator {
          display: none;
        }
      `}</style>
    </div>
  );
}

export default ProjectDetail;