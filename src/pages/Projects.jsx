import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import Navigation from '../components/Navigation';
import { allProjects } from '../data/projects';
import '../App.css';

gsap.registerPlugin(ScrollTrigger, TextPlugin);

const PROJECTS_PER_LOAD = 11;
const HEIGHTS = [283, 568];

function Projects() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [columnCount, setColumnCount] = useState(3);
  const [columns, setColumns] = useState([]);
  const [displayedProjects, setDisplayedProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loadingSkeletons, setLoadingSkeletons] = useState([]);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [showGrid, setShowGrid] = useState(false);

  const navigate = useNavigate();
  const titleRef = useRef(null);
  const lineRef = useRef(null);
  const sidebarRef = useRef(null);
  const mobileNavRef = useRef(null);
  const projectsGridRef = useRef(null);
  const tlRef = useRef(null);
  const containerRef = useRef(null);

  const projects = useMemo(() => allProjects, []);

  // GSAP Page Load Animation (Typing effect preserved)
  useEffect(() => {
    const tl = gsap.timeline();
    tlRef.current = tl;
    const isMobile = window.innerWidth < 1024;
    const headingYStart = isMobile ? 80 : window.innerHeight / 2 - 120;
    const headingYEnd = isMobile ? 20 : 0;

    gsap.set([titleRef.current, lineRef.current], { opacity: 0 });
    gsap.set(titleRef.current, { y: headingYStart, scale: 1 });

    if (isMobile) {
      tl.to(titleRef.current, {
        opacity: 1,
        y: headingYEnd,
        duration: 0.9,
        ease: "power3.out",
        onStart: () => { if (titleRef.current) titleRef.current.textContent = "A Glimpse into Our Projects"; },
        onComplete: () => {
          gsap.fromTo(
            lineRef.current,
            { opacity: 1, scaleX: 0, transformOrigin: "left center" },
            {
              scaleX: 1,
              duration: 1.3,
              ease: "power3.inOut",
              onComplete: () => setShowGrid(true)
            }
          );
        }
      });
    } else {
      tl.to(titleRef.current, {
        opacity: 1,
        y: headingYStart,
        duration: 0.7,
        ease: "power3.out",
        onStart: () => { if (titleRef.current) titleRef.current.textContent = ""; },
        onComplete: () => {
          gsap.to(titleRef.current, {
            duration: 1.3,
            text: { value: "A Glimpse into Our Projects", delimiter: "", speed: 0.5 },
            ease: "none",
            onUpdate: () => {
              if (titleRef.current) {
                titleRef.current.innerHTML = titleRef.current.textContent + '<span class="typing-indicator">|</span>';
              }
            },
            onComplete: () => {
              if (titleRef.current) titleRef.current.innerHTML = titleRef.current.textContent;
              gsap.to(titleRef.current, {
                y: headingYEnd,
                duration: 0.9,
                ease: "power3.inOut",
                onComplete: () => {
                  gsap.fromTo(
                    lineRef.current,
                    { opacity: 1, scaleX: 0, transformOrigin: "left center" },
                    {
                      scaleX: 1,
                      duration: 1.3,
                      ease: "power3.inOut",
                      onComplete: () => setShowGrid(true)
                    }
                  );
                }
              });
            }
          });
        }
      });
    }

    if (mobileNavRef.current) {
      gsap.fromTo(
        mobileNavRef.current,
        { scale: 0, rotation: -180, opacity: 0 },
        { scale: 1, rotation: 0, opacity: 1, duration: 0.8, ease: "back.out(1.7)", delay: 0.5 }
      );
    }

    return () => {
      tlRef.current && tlRef.current.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Animate projects on load and scroll
  useEffect(() => {
    if (!displayedProjects.length) return;
    const projectElements = document.querySelectorAll('.project-item');
    projectElements.forEach((el, index) => {
      if (!el.classList.contains('animated')) {
        const delay = (index % PROJECTS_PER_LOAD) * 0.1;
        gsap.fromTo(el,
          { opacity: 0, y: 60, scale: 0.8, rotation: Math.random() * 10 - 5 },
          {
            opacity: 1, y: 0, scale: 1, rotation: 0,
            duration: 0.8, delay, ease: "power3.out",
            onComplete: () => el.classList.add('animated')
          }
        );
      }
    });
  }, [displayedProjects, columns]);

  // Skeleton loading animation
  useEffect(() => {
    if (!loadingSkeletons.length) return;
    const skeletonElements = document.querySelectorAll('.loading-skeleton');
    skeletonElements.forEach((el, index) => {
      gsap.to(el, {
        opacity: 0.5, duration: 1, repeat: -1, yoyo: true, ease: "power2.inOut", delay: index * 0.1
      });
      const shimmer = el.querySelector('.shimmer-effect');
      shimmer && gsap.to(shimmer, { x: '100%', duration: 1.5, repeat: -1, ease: "power2.inOut" });
    });
  }, [loadingSkeletons]);

  // Scroll-triggered animations
  useEffect(() => {
    if (!sidebarRef.current) return;
    gsap.to(sidebarRef.current, {
      backgroundPosition: '50% 100%',
      ease: 'none',
      scrollTrigger: {
        trigger: sidebarRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });

    ScrollTrigger.batch('.project-item', {
      onEnter: (elements) => {
        elements.forEach((el, i) => {
          const randomRotation = gsap.utils.random(-18, 18, 1);
          gsap.fromTo(
            el,
            { opacity: 0, y: 80, scale: 0.8, rotate: randomRotation, filter: "blur(8px)" },
            {
              opacity: 1, y: 0, scale: 1, rotate: 0, filter: "blur(0px)",
              duration: 1.1, ease: "expo.out", delay: i * 0.08
            }
          );
        });
      },
      onLeave: (elements) => {
        gsap.to(elements, {
          opacity: 0.5, scale: 0.95, filter: "blur(4px)", duration: 0.4, stagger: 0.05
        });
      },
      onEnterBack: (elements) => {
        elements.forEach((el, i) => {
          gsap.to(el, {
            opacity: 1, y: 0, scale: 1, rotate: 0, filter: "blur(0px)",
            duration: 0.7, ease: "expo.out", delay: i * 0.06
          });
        });
      },
      onLeaveBack: (elements) => {
        gsap.to(elements, {
          opacity: 0, y: 60, scale: 0.8, filter: "blur(8px)", duration: 0.5, stagger: 0.05
        });
      }
    });

    return () => ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  }, []);

  // Initial load
  useEffect(() => {
    setDisplayedProjects(projects.slice(0, PROJECTS_PER_LOAD));
    setHasMore(projects.length > PROJECTS_PER_LOAD);
  }, [projects]);

  // Load more projects
  const loadMoreProjects = useCallback(() => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    const currentLength = displayedProjects.length;
    const remainingProjects = projects.length - currentLength;
    const projectsToLoad = Math.min(PROJECTS_PER_LOAD, remainingProjects);
    const nextProjects = projects.slice(currentLength, currentLength + projectsToLoad);

    if (!nextProjects.length) {
      setIsLoading(false);
      setHasMore(false);
      return;
    }

    const skeletons = nextProjects.map((_, index) => {
      const height = HEIGHTS[(currentLength + index) % HEIGHTS.length];
      return {
        id: `skeleton-${currentLength + index}`,
        height,
        isLarge: height > 300,
        isSkeleton: true
      };
    });

    setLoadingSkeletons(skeletons);

    setTimeout(() => {
      setDisplayedProjects(prev => [...prev, ...nextProjects]);
      setHasMore(currentLength + nextProjects.length < projects.length);
      setIsLoading(false);
      setLoadingSkeletons([]);
    }, 800);
  }, [displayedProjects.length, projects, isLoading, hasMore]);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      let scrollTop, scrollHeight, clientHeight;
      if (window.innerWidth < 1024) {
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        scrollHeight = document.documentElement.scrollHeight;
        clientHeight = window.innerHeight;
      } else {
        if (!containerRef.current) return;
        const container = containerRef.current;
        scrollTop = container.scrollTop;
        scrollHeight = container.scrollHeight;
        clientHeight = container.clientHeight;
      }
      const scrollPosition = scrollTop + clientHeight;
      const threshold = scrollHeight - 300;
      if (scrollPosition >= threshold && hasMore && !isLoading) {
        loadMoreProjects();
      }
    };
    window.addEventListener('scroll', handleScroll);
    const container = containerRef.current;
    container && container.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      container && container.removeEventListener('scroll', handleScroll);
    };
  }, [loadMoreProjects, hasMore, isLoading]);

  // Responsive column count
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.offsetWidth;
      setColumnCount(width < 480 ? 1 : width < 768 ? 2 : 3);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Distribute projects into columns for masonry layout
  useEffect(() => {
    const newColumns = Array.from({ length: columnCount }, () => []);
    const columnHeights = Array(columnCount).fill(0);
    const allItems = [...displayedProjects, ...loadingSkeletons];
    const itemsWithSizes = allItems.map((item, index) => {
      if (item.isSkeleton) return item;
      const randomHeight = HEIGHTS[index % HEIGHTS.length];
      return {
        ...item,
        height: randomHeight,
        isLarge: randomHeight > 300,
        size: randomHeight > 300 ? 'large' : 'small'
      };
    });
    itemsWithSizes.forEach((item) => {
      const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
      newColumns[shortestColumnIndex].push(item);
      columnHeights[shortestColumnIndex] += item.height + 16;
    });
    setColumns(newColumns);
  }, [columnCount, displayedProjects, loadingSkeletons]);

  // Loading skeleton component
  const LoadingSkeleton = ({ height, isLarge }) => (
    <div className={`cursor-pointer group loading-skeleton ${isLarge ? 'mb-2' : 'mb-2'} w-full max-w-full`}>
      <div className={`relative overflow-hidden shadow-sm transition-all duration-300 bg-gradient-to-br w-full ${
        isLarge ? 'from-gray-100 to-gray-200 shadow-md' : 'from-gray-50 to-gray-100 shadow-sm'
      }`}>
        <div
          className="max-w-[493px] !min-h-[233px] relative overflow-hidden bg-gray-200"
          style={{ height: `${height}px` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent shimmer-effect" style={{ transform: 'translateX(-100%)' }}></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row overflow-hidden">
      {/* Animated Mobile Navigation Circle */}
      <motion.button
        ref={mobileNavRef}
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

      {/* Animated Mobile Navigation Overlay */}
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

      {/* Left Sidebar */}
      <div
        ref={sidebarRef}
        className="hidden lg:flex lg:w-[30%] lg:h-screen flex-col relative bg-cover bg-bottom bg-no-repeat"
        style={{
          backgroundImage: "url('/images/pb1.jpg')",
          willChange: "transform, opacity"
        }}
      >
        <div className="p-4 sm:p-8 lg:p-12 absolute top-4 sm:top-6 lg:top-8 left-4 sm:left-6 lg:left-8 z-50">
          <img
            src="/logofullw.png"
            alt="StudioDesignPalette Logo"
            className="object-contain rounded-lg"
            style={{
              marginLeft: -13,
              width: 230,
              height: 'auto',
            }}
          />
          <Navigation textColor="white" />
        </div>
      </div>

      {/* Main Content - Masonry Grid */}
      <div
        className="flex justify-center lg:justify-start lg:w-[85%] lg:h-screen  overflow-y-auto overflow-x-hidden ml-0 mt-0 lg:!ml-5 lg:!mt-5 items-center"
        ref={containerRef}
        style={{ willChange: "transform, opacity" }}
      >
        <div className="!pt-12 lg:!pt-0 h-full px-2 sm:!px-4 lg:!px-8 py-4 sm:!py-6 lg:!py-8 w-[90%] lg:w-[100%]">
          {/* Heading with typing and slide-up animation */}
          <div
            className="relative flex flex-col items-center justify-center w-full !mb-8 sm:!mb-10 lg:!mb-12 transition-all duration-700"
            style={{
              position: "relative",
              width: "100%",
              background: "transparent",
              zIndex: 10,
            }}
          >
            <h1
              ref={titleRef}
              className="font-light tracking-tight text-gray-900"
              style={{
                fontFamily: 'Coolvetica Extra Light',
                fontWeight: 300,
                fontSize: 'clamp(2rem, 7vw, 4.5rem)',
                letterSpacing: '0.04em',
                lineHeight: 1.08,
                marginBottom: '0.5rem',
                background: 'transparent',
                width: '90vw',
                maxWidth: '90vw',
                textAlign: 'center',
                textTransform: 'uppercase',
                zIndex: 70,
                color: '#111',
                transition: "all 0.7s cubic-bezier(.77,0,.18,1)",
                opacity: 1,
                transform: 'translateY(0)',
              }}
            >
              A Glimpse into Our Projects
            </h1>
            <div
              ref={lineRef}
              className="!mt-4"
              style={{
                opacity: 1,
                zIndex: 10,
                width: '100vw',
                maxWidth: '100vw',
                height: '1px',
                background: '#222',
                left: '50%',
                transform: 'translateX(-50%) scaleX(0)',
                transformOrigin: 'left center',
                position: 'relative',
                transition: "opacity 0.7s cubic-bezier(.77,0,.18,1)"
              }}
            />
          </div>
          {/* Show grid only after heading animation */}
          {showGrid && (
            <div ref={projectsGridRef} className="flex gap-2 sm:gap-3 lg:gap-4 overflow-x-hidden !mt-7 md:!mt-20 lg:!mt-0">
              {columns.map((column, columnIndex) => (
                <div key={`column-${columnIndex}`} className="flex-1 flex flex-col gap-2 sm:gap-3 lg:gap-4 min-w-0">
                  {column.map((item, itemIndex) => {
                    if (item.isSkeleton) {
                      return (
                        <LoadingSkeleton
                          key={`${item.id}-${columnIndex}-${itemIndex}`}
                          height={item.height}
                          isLarge={item.isLarge}
                        />
                      );
                    }
                    return (
                      <div
                        key={`${item.id}-${columnIndex}-${itemIndex}`}
                        className={`cursor-pointer group project-item ${item.isLarge ? 'mb-1 sm:mb-2' : 'mb-1 sm:mb-2'} w-full max-w-full`}
                        onClick={() => navigate(`/project/${item.id}`)}
                      >
                        <div className={`relative overflow-hidden shadow-sm group-hover:shadow-lg transition-all duration-300 bg-gradient-to-br w-full ${
                          item.isLarge
                            ? 'from-gray-100 to-gray-200 shadow-md'
                            : 'from-gray-50 to-gray-100 shadow-sm'
                        }`}>
                          {/* Project Image */}
                          <div
                            className="lg:w-full !sm:max-w-[70%] relative overflow-hidden object-cover object-center"
                            style={{
                              height: `${item.height}px`,
                              minHeight: '150px',
                            }}
                          >
                            <img
                              className="absolute inset-0 w-full h-full object-contain object-center transition-all duration-500 opacity-0 image-fade-in"
                              src={item.mainImage || item.image}
                              alt={item.title}
                              loading="lazy"
                              onLoad={(e) => {
                                e.target.classList.add('loaded');
                              }}
                            />
                            <img
                              className="absolute inset-0 w-full h-full object-contain object-center opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                              src={item.hoverImage || item.mainImage || item.image}
                              alt={item.title}
                              loading="lazy"
                            />
                          </div>
                          <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-95 transition-all duration-300 flex items-center justify-end">
                            <div className="text-black flex justify-start flex-col bg-white w-[90%] h-16 sm:h-18 lg:h-20 transform translate-x-full group-hover:translate-x-0 transition-all duration-300 px-3 sm:px-4 lg:px-6 items-center">
                              <p className="text-gray-500 text-xs sm:text-sm !mt-2 sm:!mt-3 font-light tracking-wide mb-1" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                                {item.type}
                              </p>
                              <h3 className={`font-extrabold tracking-wide text-black ${item.isLarge ? 'text-lg sm:text-xl lg:text-2xl' : 'text-base sm:text-lg lg:text-xl'}`} style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                                {item.title}
                              </h3>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
          {hasMore && !isLoading && displayedProjects.length > 0 && (
            <div className="text-center py-4 sm:py-6 lg:py-8"></div>
          )}
          {!hasMore && displayedProjects.length === projects.length && (
            <div className="text-center py-4 sm:py-6 lg:py-8">
              <p className="text-gray-600 font-medium text-sm sm:text-base">All {projects.length} projects loaded</p>
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        .overflow-y-auto::-webkit-scrollbar {
          width: 4px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: transparent;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 2px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.3);
        }
        img {
          object-fit: cover;
          object-position: center;
        }
        .image-fade-in {
          opacity: 0;
          transition: opacity 0.5s ease-in-out;
        }
        .image-fade-in.loaded {
          opacity: 1;
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
        .typing-indicator {
          display: inline-block;
          width: 1ch;
          color: #222;
          font-weight: 400;
          animation: blink 0.8s steps(1) infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default Projects;