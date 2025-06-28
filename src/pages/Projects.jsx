import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { allProjects } from '../data/projects';
import '../App.css';

function Projects() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [columnCount, setColumnCount] = useState(3);
  const [columns, setColumns] = useState([]);
  const [displayedProjects, setDisplayedProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loadingSkeletons, setLoadingSkeletons] = useState([]);
  const navigate = useNavigate();
  
  // Use all projects from projects.js - memoize to prevent recreation
  const projects = useMemo(() => allProjects, []);
  const containerRef = useRef(null);
  const PROJECTS_PER_LOAD = 11;

  // Initial load
  useEffect(() => {
    setDisplayedProjects(projects.slice(0, PROJECTS_PER_LOAD));
    setHasMore(projects.length > PROJECTS_PER_LOAD);
  }, [projects]);

  // Load more projects
  const loadMoreProjects = useCallback(() => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    
    // Calculate current and next batch
    const currentLength = displayedProjects.length;
    const remainingProjects = projects.length - currentLength;
    const projectsToLoad = Math.min(PROJECTS_PER_LOAD, remainingProjects);
    const nextProjects = projects.slice(currentLength, currentLength + projectsToLoad);
    
    if (nextProjects.length === 0) {
      setIsLoading(false);
      setHasMore(false);
      return;
    }
    
    // Create loading skeletons with proper heights
    const heights = [283, 568];
    
    const skeletons = nextProjects.map((project, index) => {
      const height = heights[(currentLength + index) % heights.length];
      return {
        id: `skeleton-${currentLength + index}`,
        height,
        isLarge: height > 300,
        isSkeleton: true
      };
    });
    
    setLoadingSkeletons(skeletons);
    
    // Simulate loading delay for better UX
    setTimeout(() => {
      setDisplayedProjects(prev => [...prev, ...nextProjects]);
      const newLength = currentLength + nextProjects.length;
      setHasMore(newLength < projects.length);
      setIsLoading(false);
      setLoadingSkeletons([]);
    }, 800);
  }, [displayedProjects.length, projects, isLoading, hasMore]);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      let scrollTop, scrollHeight, clientHeight;
      
      // Check if we're on mobile/tablet or desktop
      if (window.innerWidth < 1024) {
        // Mobile/tablet - use window scroll
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        scrollHeight = document.documentElement.scrollHeight;
        clientHeight = window.innerHeight;
      } else {
        // Desktop - use container scroll
        if (!containerRef.current) return;
        const container = containerRef.current;
        scrollTop = container.scrollTop;
        scrollHeight = container.scrollHeight;
        clientHeight = container.clientHeight;
      }
      
      const scrollPosition = scrollTop + clientHeight;
      const threshold = scrollHeight - 300; // Trigger 300px before bottom
      
      if (scrollPosition >= threshold && hasMore && !isLoading) {
        loadMoreProjects();
      }
    };

    // Add listeners for both window and container
    window.addEventListener('scroll', handleScroll);
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [loadMoreProjects, hasMore, isLoading]);

  // Calculate number of columns based on screen width
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        if (width < 480) {
          setColumnCount(1); // Single column for very small screens
        } else if (width < 640) {
          setColumnCount(2);
        } else if (width < 768) {
          setColumnCount(2);
        } else if (width < 1024) {
          setColumnCount(3);
        } else {
          setColumnCount(3);
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Distribute projects into columns for masonry layout with varied heights
  useEffect(() => {
    const newColumns = Array.from({ length: columnCount }, () => []);
    const columnHeights = Array(columnCount).fill(0);

    // Create varied heights for uneven masonry effect - only 283 and 568
    const heights = [283, 568];
    
    // Combine displayed projects with loading skeletons
    const allItems = [...displayedProjects, ...loadingSkeletons];
    
    const itemsWithSizes = allItems.map((item, index) => {
      if (item.isSkeleton) {
        return item; // Already has height and isLarge
      }
      
      const randomHeight = heights[index % heights.length];
      const isLarge = randomHeight > 300;
      
      // Add random animation properties - only for newly loaded items
      const isNewlyLoaded = index >= displayedProjects.length - PROJECTS_PER_LOAD;
      const randomDelay = isNewlyLoaded ? Math.random() * 0.8 : 0; // Random delay only for new items
      const randomDirection = Math.random() > 0.5 ? 30 : -30; // Random Y direction
      const randomX = Math.random() > 0.5 ? 20 : -20; // Random X direction
      
      return {
        ...item,
        height: randomHeight,
        isLarge,
        size: isLarge ? 'large' : 'small',
        animationDelay: randomDelay,
        animationY: randomDirection,
        animationX: randomX
      };
    });

    // Distribute items to balance column heights
    itemsWithSizes.forEach((item) => {
      // Find the shortest column
      const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
      newColumns[shortestColumnIndex].push(item);
      columnHeights[shortestColumnIndex] += item.height + 16; // 16px for gap
    });

    setColumns(newColumns);
  }, [columnCount, displayedProjects, loadingSkeletons]);

  // Loading skeleton component
  const LoadingSkeleton = ({ height, isLarge }) => (
    <div className={`cursor-pointer group ${isLarge ? 'mb-2' : 'mb-2'} w-full max-w-full`}>
      <div className={`relative overflow-hidden shadow-sm transition-all duration-300 bg-gradient-to-br w-full ${
        isLarge 
          ? 'from-gray-100 to-gray-200 shadow-md' 
          : 'from-gray-50 to-gray-100 shadow-sm'
      }`}>
        <div 
          className="max-w-[493px] !min-h-[233px] relative overflow-hidden animate-pulse bg-gray-200"
          style={{ height: `${height}px` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row overflow-hidden">
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-6 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center bg-white/80 backdrop-blur-md border border-gray-200 shadow-lg transition-all duration-300 active:scale-95"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        style={{
          boxShadow: isMobileMenuOpen
            ? '0 8px 32px 0 rgba(0,0,0,0.18)'
            : '0 2px 8px 0 rgba(0,0,0,0.10)',
          border: '1.5px solid #e5e7eb',
        }}
        aria-label="Open menu"
      >
        <motion.div
          initial={false}
          animate={isMobileMenuOpen ? { rotate: 180, scale: 1.1 } : { rotate: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
          className="w-7 h-7 flex items-center justify-center relative"
        >
          {/* Minimal Hamburger/X animation */}
          <span
            className={`absolute left-1/2 top-1/2 w-6 h-0.5 bg-black rounded-full transition-all duration-400
              ${isMobileMenuOpen
                ? 'rotate-45 -translate-x-1/2 -translate-y-1/2'
                : '-translate-x-1/2 -translate-y-2'}
            `}
            style={{
              height: '3px',
              transition: 'all 0.4s cubic-bezier(.87,-0.41,.19,1.44)',
            }}
          />
          <span
            className={`absolute left-1/2 top-1/2 w-6 h-0.5 bg-black rounded-full transition-all duration-400
              ${isMobileMenuOpen
                ? '-rotate-45 -translate-x-1/2 -translate-y-1/2'
                : '-translate-x-1/2 translate-y-2'}
            `}
            style={{
              height: '3px',
              transition: 'all 0.4s cubic-bezier(.87,-0.41,.19,1.44)',
            }}
          />
        </motion.div>
      </button>

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
            <div className="flex items-center justify-center h-full">
              <div className="text-center" onClick={(e) => e.stopPropagation()}>
                <Navigation textColor="black" activePage="Projects" isMobile={true} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Left Sidebar */}
      <div
        className="hidden lg:flex lg:w-[30%] lg:h-screen flex-col relative bg-cover bg-bottom bg-no-repeat"
        style={{
          backgroundImage: "url('/images/pb1.jpg')"
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
      <div className="flex justify-center lg:justify-start lg:w-[70%] lg:h-screen  overflow-y-auto overflow-x-hidden ml-0 mt-0 lg:!ml-5 lg:!mt-5 items-center " ref={containerRef}>
        <div className="pt-20 lg:pt-0 h-full px-2 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8 w-[90%] lg:w-[100%]">
          <div className="flex gap-2 sm:gap-3 lg:gap-4 overflow-x-hidden !mt-20 md:!mt-20 lg:!mt-0">
            {columns.map((column, columnIndex) => (
              <div key={`column-${columnIndex}`} className="flex-1 flex flex-col gap-2 sm:gap-3 lg:gap-4 min-w-0">
                {column.map((item, itemIndex) => {
                  // Render skeleton if it's a loading skeleton
                  if (item.isSkeleton) {
                    return (
                      <LoadingSkeleton 
                        key={`${item.id}-${columnIndex}-${itemIndex}`}
                        height={item.height} 
                        isLarge={item.isLarge} 
                      />
                    );
                  }
                  
                  // Render actual project
                  return (
                    <motion.div
                      key={`${item.id}-${columnIndex}-${itemIndex}`}
                      className={`cursor-pointer group ${item.isLarge ? 'mb-1 sm:mb-2' : 'mb-1 sm:mb-2'} w-full max-w-full`}
                      onClick={() => navigate(`/project/${item.id}`)}
                      initial={{ 
                        opacity: 0, 
                        y: item.animationY || 20,
                        x: item.animationX || 0,
                        scale: 0.9
                      }}
                      animate={{ 
                        opacity: 1, 
                        y: 0,
                        x: 0,
                        scale: 1
                      }}
                      transition={{ 
                        duration: 0.6, 
                        delay: item.animationDelay || 0,
                        ease: "easeOut",
                        type: "spring",
                        stiffness: 100
                      }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className={`relative overflow-hidden shadow-sm group-hover:shadow-lg transition-all duration-300 bg-gradient-to-br w-full    ${
                        item.isLarge 
                          ? 'from-gray-100 to-gray-200 shadow-md' 
                          : 'from-gray-50 to-gray-100 shadow-sm'
                      }`}>
                        {/* Project Image */}
                        <div 
                          className="lg:w-full !sm:max-w-[70%] relative overflow-hidden object-cover object-center"
                          style={{ 
                            height: `${item.height}px`,
                            minHeight: '150px', // Minimum height for mobile
                          }}
                        >
                          {/* Main project image */}
                          <img
                            className="absolute inset-0 w-full h-full object-contain object-center transition-all duration-500 opacity-0 image-fade-in"
                            src={item.mainImage || item.image}
                            alt={item.title}
                            loading="lazy"
                            onLoad={(e) => {
                              e.target.classList.add('loaded');
                            }}
                          />
                          
                          {/* Hover image overlay */}
                          <img
                            className="absolute inset-0 w-full h-full object-contain object-center opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                            src={item.hoverImage || item.mainImage || item.image}
                            alt={item.title}
                            loading="lazy"
                          />
                        </div>
                        
                        {/* Hover overlay */}
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
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </div>
          
          {/* Loading indicator at bottom */}
          {hasMore && !isLoading && displayedProjects.length > 0 && (
            <div className="text-center py-4 sm:py-6 lg:py-8">
              <p className="text-gray-500 text-xs sm:text-sm">Scroll down to load more projects...</p>
            </div>
          )}
          
          {/* Final message when all projects are loaded */}
          {!hasMore && displayedProjects.length === projects.length && (
            <div className="text-center py-4 sm:py-6 lg:py-8">
              <p className="text-gray-600 font-medium text-sm sm:text-base">All {projects.length} projects loaded</p>
            </div>
          )}
        </div>
      </div>

      {/* Custom Scrollbar and Shimmer Animation */}
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
      `}</style>
    </div>
  );
}

export default Projects;