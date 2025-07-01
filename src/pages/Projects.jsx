import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import Navigation from '../components/Navigation';
import { allProjects } from '../data/projects';
import '../App.css';

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
  const [activeTypes, setActiveTypes] = useState([]); // Change activeType to an array for multi-select

  const navigate = useNavigate();
  const titleRef = useRef(null);
  const lineRef = useRef(null);
  const mobileNavRef = useRef(null);
  const projectsGridRef = useRef(null);
  const containerRef = useRef(null);

  // Get all unique types from projects (only those that actually exist)
  const allTypes = useMemo(() => {
    const types = new Set();
    allProjects.forEach(p => {
      if (p.type) types.add(p.type);
    });
    return ["All", ...Array.from(types)];
  }, []);

  // Filtered projects based on activeTypes (filter by type only)
  const filteredProjects = useMemo(() => {
    if (
      activeTypes.length === 0 ||
      activeTypes.includes("All")
    ) {
      return allProjects;
    }
    return allProjects.filter(
      p => p.type && activeTypes.includes(p.type)
    );
  }, [activeTypes]);

  // Initial load (no animation)
  useEffect(() => {
    setDisplayedProjects(filteredProjects.slice(0, PROJECTS_PER_LOAD));
    setHasMore(filteredProjects.length > PROJECTS_PER_LOAD);
  }, [filteredProjects]);

  // Load more projects
  const loadMoreProjects = useCallback(() => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    const currentLength = displayedProjects.length;
    const remainingProjects = filteredProjects.length - currentLength;
    const projectsToLoad = Math.min(PROJECTS_PER_LOAD, remainingProjects);
    const nextProjects = filteredProjects.slice(currentLength, currentLength + projectsToLoad);

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
      setHasMore(currentLength + nextProjects.length < filteredProjects.length);
      setIsLoading(false);
      setLoadingSkeletons([]);
    }, 800);
  }, [displayedProjects.length, filteredProjects, isLoading, hasMore]);

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

  // --- Filter Bar logic ---
  const handleTypeClick = (type) => {
    if (type === "All") {
      setActiveTypes([]);
    } else {
      setActiveTypes((prev) => {
        // If already selected, remove it (toggle)
        if (prev.includes(type)) {
          const next = prev.filter((t) => t !== type);
          // If none left, fallback to All
          return next.length === 0 ? [] : next;
        }
        // Add new type, remove "All" if present
        return [...prev.filter((t) => t !== "All"), type];
      });
    }
  };

  const handleRemoveType = (type) => {
    setActiveTypes((prev) => {
      const next = prev.filter((t) => t !== type);
      // If none left, fallback to All
      return next.length === 0 ? [] : next;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row overflow-hidden">
      {/* Mobile Navigation Button (no animation) */}
      <button
        ref={mobileNavRef}
        className="fixed top-4 right-4 z-50 lg:hidden w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center"
        onClick={() => setShowMobileNav(true)}
        aria-label="Open navigation"
      >
        <span>
          <FaBars className="text-2xl text-gray-800" />
        </span>
      </button>

      {/* Mobile Navigation Overlay (no animation) */}
      {showMobileNav && (
        <div
          className="fixed inset-0 z-50 bg-white bg-opacity-95 flex flex-col items-center justify-center"
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center"
            onClick={() => setShowMobileNav(false)}
            aria-label="Close navigation"
          >
            <span className="text-2xl text-gray-800">&times;</span>
          </button>
          <div>
            <Navigation textColor="black" />
          </div>
        </div>
      )}

      {/* Main Content - Masonry Grid */}
      <div
        className="flex justify-center lg:justify-start lg:w-[100%] lg:h-screen  overflow-y-auto  ml-0 mt-0 lg:!ml-5 lg:!mt-5 items-center"
        ref={containerRef}
        style={{ willChange: "transform, opacity" }}
      >
        <div className="!pt-12 lg:!pt-0 h-full px-2 sm:!px-4 lg:!px-8 py-4 sm:!py-6 lg:!py-8 w-[90%] lg:w-[100%]">
          {/* Heading */}
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
              projects
            </h1>
            <div
              ref={lineRef}
              className="!mt-1"
              style={{
                opacity: 1,
                zIndex: 10,
                width: '23%',                // full width underline
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
          {/* Filter Bar */}
          <div className="flex flex-wrap gap-2 !mb-6">
            {allTypes.map((type) => {
              const isActive = activeTypes.length === 0
                ? type === "All"
                : activeTypes.includes(type);
              return (
                <button
                  key={type}
                  className={`relative flex items-center !px-4 py-1 rounded-full border text-2xl font-medium transition-colors
                    ${isActive
                      ? 'bg-black text-white border-white'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}
                  `}
                  onClick={() => handleTypeClick(type)}
                  type="button"
                >
                  <span>{type}</span>
                  {type !== "All" && isActive && (
                    <span
                      className="!ml-2 flex items-center justify-center w-5 h-5 rounded-full bg-white text-black border border-gray-300 hover:bg-gray-200 transition-colors"
                      onClick={e => {
                        e.stopPropagation();
                        handleRemoveType(type);
                      }}
                      title="Remove filter"
                    >
                      <FaTimes size={12} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          {/* Show grid */}
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
                            <p className="text-gray-500 text-xs sm:text-sm !mt-2 sm:!mt-3 font-light tracking-wide mb-1">
                              {item.type}
                            </p>
                            <h3 className={`font-extrabold tracking-wide text-black ${item.isLarge ? 'text-lg sm:text-xl lg:text-2xl' : 'text-base sm:text-lg lg:text-xl'}`} style={{ letterSpacing: '0.1em' }}>
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
          {hasMore && !isLoading && displayedProjects.length > 0 && (
            <div className="text-center py-4 sm:py-6 lg:py-8"></div>
          )}
          {!hasMore && displayedProjects.length === filteredProjects.length && (
            <div className="text-center py-4 sm:py-6 lg:py-8">
              <p className="text-gray-600 font-medium text-sm sm:text-base">All {filteredProjects.length} projects loaded</p>
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
          display: none;
        }
      `}</style>
    </div>
  );
}

export default Projects;