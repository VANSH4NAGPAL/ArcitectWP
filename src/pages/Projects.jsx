import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaExpand } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '../components/Navigation';
import { collection, onSnapshot } from "firebase/firestore";
import { db } from '../firebase';
import '../App.css';

const PROJECTS_PER_LOAD = 11;
const CARD_WIDTH = 280;
const CARD_HEIGHT = 200;
const CARD_WIDTH_MOBILE = 180;
const CARD_HEIGHT_MOBILE = 130;
const GRID_SPACING = 60;
const GRID_SPACING_MOBILE = 40;
const WHITEBOARD_WIDTH = 3000;
const WHITEBOARD_HEIGHT = 3000;
const BOUNDARY_PADDING = 200;

function Projects() {
  const [displayedProjects, setDisplayedProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loadingSkeletons, setLoadingSkeletons] = useState([]);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [activeCategories, setActiveCategories] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [whiteboardBgColor] = useState('#FAF9F6');
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationPhase, setAnimationPhase] = useState('idle');
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);

  const dragStateRef = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    initialTransformX: 0,
    initialTransformY: 0
  });
  
  const transformRef = useRef({ x: 0, y: 0, scale: 1 });
  const navigate = useNavigate();
  const lineRef = useRef(null);
  const mobileNavRef = useRef(null);
  const containerRef = useRef(null);
  const whiteboardRef = useRef(null);

  // Fetch projects from Firestore
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "projects"), (snapshot) => {
      const data = snapshot.docs.map((docSnap) => ({
        docId: docSnap.id,
        ...docSnap.data(),
      }));
      setAllProjects(data);
    });
    return () => unsub();
  }, []);

  // Get all unique categories from projects (only available ones)
  const allCategories = useMemo(() => {
    const categories = new Set();
    allProjects.forEach(p => p.category && categories.add(p.category));
    return Array.from(categories);
  }, [allProjects]);

  // Filtered projects based on activeCategories (show all if none selected)
  const filteredProjects = useMemo(() => {
    if (activeCategories.length === 0) {
      return allProjects;
    }
    return allProjects.filter(p => p.category && p.category === activeCategories[0]);
  }, [activeCategories, allProjects]);

  // Initial load
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

    const skeletons = nextProjects.map((_, index) => ({
      id: `skeleton-${currentLength + index}`,
      isSkeleton: true
    }));

    setLoadingSkeletons(skeletons);

    setTimeout(() => {
      setDisplayedProjects(prev => [...prev, ...nextProjects]);
      setHasMore(currentLength + nextProjects.length < filteredProjects.length);
      setIsLoading(false);
      setLoadingSkeletons([]);
    }, 800);
  }, [displayedProjects.length, filteredProjects, isLoading, hasMore]);

  // Generate grid positions for projects with animation support
  const projectsWithPositions = useMemo(() => {
    const allItems = animationPhase === 'scrambling' 
      ? [...allProjects, ...loadingSkeletons]
      : [...displayedProjects, ...loadingSkeletons];
    
    const isMobile = window.innerWidth < 768;
    const cardWidth = isMobile ? CARD_WIDTH_MOBILE : CARD_WIDTH;
    const cardHeight = isMobile ? CARD_HEIGHT_MOBILE : CARD_HEIGHT;
    const gridSpacing = isMobile ? GRID_SPACING_MOBILE : GRID_SPACING;
    
    const normalItems = displayedProjects.length + loadingSkeletons.length;
    const itemsPerRow = Math.ceil(Math.sqrt(normalItems));
    const totalRows = Math.ceil(normalItems / itemsPerRow);
    
    const gridWidth = itemsPerRow * (cardWidth + gridSpacing) - gridSpacing;
    const gridHeight = totalRows * (cardHeight + gridSpacing) - gridSpacing;
    
    const startX = (WHITEBOARD_WIDTH - gridWidth) / 2;
    const startY = (WHITEBOARD_HEIGHT - gridHeight) / 2;
    
    return allItems.map((item, index) => {
      let currentX, currentY;
      
      if (animationPhase === 'scrambling') {
        const seed = item.docId || `skeleton-${index}`;
        let hash = 0;
        for (let i = 0; i < seed.length; i++) {
          hash = ((hash << 5) - hash) + seed.charCodeAt(i);
          hash = hash & hash;
        }
        
        const random1 = Math.abs(Math.sin(hash * 0.1)) * 0.8 + 0.1;
        const random2 = Math.abs(Math.sin(hash * 0.2)) * 0.8 + 0.1;
        
        currentX = random1 * (WHITEBOARD_WIDTH - cardWidth);
        currentY = random2 * (WHITEBOARD_HEIGHT - cardHeight);
      } else {
        const displayIndex = displayedProjects.findIndex(p => p.docId === item.docId);
        const gridIndex = displayIndex >= 0 ? displayIndex : (displayedProjects.length + (index - displayedProjects.length));
        
        const row = Math.floor(gridIndex / itemsPerRow);
        const col = gridIndex % itemsPerRow;
        
        currentX = startX + col * (cardWidth + gridSpacing);
        currentY = startY + row * (cardHeight + gridSpacing);
      }
      
      return {
        ...item,
        x: currentX,
        y: currentY,
        cardWidth,
        cardHeight,
        animationPhase
      };
    });
  }, [displayedProjects, loadingSkeletons, animationPhase, allProjects]);

  // Update transform ref whenever transform state changes
  useEffect(() => {
    transformRef.current = transform;
  }, [transform]);
  
  // Center the view on initial load
  const centerView = useCallback(() => {
    if (displayedProjects.length > 0 && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      
      const isMobile = window.innerWidth < 768;
      const cardWidth = isMobile ? CARD_WIDTH_MOBILE : CARD_WIDTH;
      const cardHeight = isMobile ? CARD_HEIGHT_MOBILE : CARD_HEIGHT;
      const gridSpacing = isMobile ? GRID_SPACING_MOBILE : GRID_SPACING;
      
      const totalItems = displayedProjects.length + loadingSkeletons.length;
      const itemsPerRow = Math.ceil(Math.sqrt(totalItems));
      const totalRows = Math.ceil(totalItems / itemsPerRow);
      
      const gridWidth = itemsPerRow * (cardWidth + gridSpacing) - gridSpacing;
      const gridHeight = totalRows * (cardHeight + gridSpacing) - gridSpacing;
      
      const paddingFactor = 0.72;
      const scaleToFitWidth = (containerRect.width * paddingFactor) / gridWidth;
      const scaleToFitHeight = (containerRect.height * paddingFactor) / gridHeight;
      
      let initialScale = Math.min(scaleToFitWidth, scaleToFitHeight);
      initialScale = Math.max(0.3, Math.min(2, initialScale));
      
      const scaledWhiteboardWidth = WHITEBOARD_WIDTH * initialScale;
      const scaledWhiteboardHeight = WHITEBOARD_HEIGHT * initialScale;
      const centerX = (containerRect.width - scaledWhiteboardWidth) / 2;
      const centerY = (containerRect.height - scaledWhiteboardHeight) / 2;
      
      setTransform({ x: centerX, y: centerY, scale: initialScale });
    }
  }, [displayedProjects.length, loadingSkeletons.length]);

  useEffect(() => {
    const timer = setTimeout(centerView, 100);
    return () => clearTimeout(timer);
  }, [centerView]);

  // Smooth boundary constraint function
  const constrainTransform = useCallback((newTransform) => {
    if (!containerRef.current) return newTransform;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const scaledWidth = WHITEBOARD_WIDTH * newTransform.scale;
    const scaledHeight = WHITEBOARD_HEIGHT * newTransform.scale;
    
    const minX = Math.min(0, containerRect.width - scaledWidth - BOUNDARY_PADDING);
    const maxX = BOUNDARY_PADDING;
    const minY = Math.min(0, containerRect.height - scaledHeight - BOUNDARY_PADDING);
    const maxY = BOUNDARY_PADDING;
    
    return {
      ...newTransform,
      x: Math.max(minX, Math.min(maxX, newTransform.x)),
      y: Math.max(minY, Math.min(maxY, newTransform.y))
    };
  }, []);

  // Mouse and touch handlers
  const handleMouseDown = useCallback((e) => {
    if (showMobileNav) return;
    // Only allow drag with left mouse button
    if (e.button !== undefined && e.button !== 0) return;
    e.preventDefault();
    const currentTransform = transformRef.current;
    dragStateRef.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      initialTransformX: currentTransform.x,
      initialTransformY: currentTransform.y
    };
    setIsDragging(true);
  }, [showMobileNav]);

  const handleTouchStart = useCallback((e) => {
    if (showMobileNav) return;
    if (e.touches.length === 1) {
      // Single finger drag from anywhere
      const touch = e.touches[0];
      const currentTransform = transformRef.current;
      dragStateRef.current = {
        isDragging: true,
        startX: touch.clientX,
        startY: touch.clientY,
        initialTransformX: currentTransform.x,
        initialTransformY: currentTransform.y
      };
      setIsDragging(true);
    }
    // Pinch handled in effect below
  }, [showMobileNav]);

  // Global event listeners for dragging
  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (showMobileNav || !dragStateRef.current.isDragging) return;
      e.preventDefault();
      
      const deltaX = e.clientX - dragStateRef.current.startX;
      const deltaY = e.clientY - dragStateRef.current.startY;
      
      const newTransform = {
        scale: transformRef.current.scale,
        x: dragStateRef.current.initialTransformX + deltaX,
        y: dragStateRef.current.initialTransformY + deltaY,
      };
      
      setTransform(constrainTransform(newTransform));
    };

    const handleGlobalMouseUp = () => {
      if (dragStateRef.current.isDragging) {
        dragStateRef.current.isDragging = false;
        setIsDragging(false);
      }
    };

    const handleGlobalTouchMove = (e) => {
      if (showMobileNav || !dragStateRef.current.isDragging) return;
      e.preventDefault();
      
      const touch = e.touches[0];
      const deltaX = touch.clientX - dragStateRef.current.startX;
      const deltaY = touch.clientY - dragStateRef.current.startY;
      
      const newTransform = {
        scale: transformRef.current.scale,
        x: dragStateRef.current.initialTransformX + deltaX,
        y: dragStateRef.current.initialTransformY + deltaY,
      };
      
      setTransform(constrainTransform(newTransform));
    };

    const handleGlobalTouchEnd = () => {
      if (dragStateRef.current.isDragging) {
        dragStateRef.current.isDragging = false;
        setIsDragging(false);
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove, { passive: false });
      document.addEventListener('mouseup', handleGlobalMouseUp, { passive: true });
      document.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
      document.addEventListener('touchend', handleGlobalTouchEnd, { passive: true });
      
      document.body.style.userSelect = 'none';
      document.body.style.overflow = 'hidden';
    }

    return () => {
      if (isDragging) {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
        document.removeEventListener('touchmove', handleGlobalTouchMove);
        document.removeEventListener('touchend', handleGlobalTouchEnd);
        
        document.body.style.userSelect = '';
        document.body.style.overflow = '';
      }
    };
  }, [isDragging, constrainTransform, showMobileNav]);

  // Wheel event for zooming
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheelEvent = (e) => {
      e.preventDefault();
      const rect = container.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const scaleFactor = e.deltaY > 0 ? 0.95 : 1.05;
      const currentTransform = transformRef.current;
      const newScale = Math.min(Math.max(currentTransform.scale * scaleFactor, 0.3), 2);
      
      const newTransform = {
        ...currentTransform,
        scale: newScale,
        x: centerX - (centerX - currentTransform.x) * scaleFactor,
        y: centerY - (centerY - currentTransform.y) * scaleFactor,
      };
      
      setTransform(constrainTransform(newTransform));
    };

    container.addEventListener('wheel', handleWheelEvent, { passive: false });
    return () => container.removeEventListener('wheel', handleWheelEvent);
  }, [constrainTransform]);

  // Pinch-to-zoom support for touch devices
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let lastDistance = null;
    let pinchStartScale = null;
    let pinchStartTransform = null;
    let pinchMidpoint = null;

    function getDistance(touches) {
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    }

    function getMidpoint(touches, rect) {
      return {
        x: (touches[0].clientX + touches[1].clientX) / 2 - rect.left,
        y: (touches[0].clientY + touches[1].clientY) / 2 - rect.top
      };
    }

    function handleTouchStart(e) {
      if (e.touches.length === 2) {
        lastDistance = getDistance(e.touches);
        pinchStartScale = transformRef.current.scale;
        pinchStartTransform = { ...transformRef.current };
        const rect = container.getBoundingClientRect();
        pinchMidpoint = getMidpoint(e.touches, rect);
      }
    }

    function handleTouchMove(e) {
      if (e.touches.length === 2 && lastDistance && pinchStartScale && pinchMidpoint) {
        e.preventDefault();
        const newDistance = getDistance(e.touches);
        const scaleFactor = newDistance / lastDistance;
        let newScale = pinchStartScale * scaleFactor;
        newScale = Math.max(0.3, Math.min(2, newScale));
        // Center zoom on initial midpoint between fingers
        const currentTransform = pinchStartTransform;
        const newTransform = {
          ...currentTransform,
          scale: newScale,
          x: pinchMidpoint.x - (pinchMidpoint.x - currentTransform.x) * (newScale / currentTransform.scale),
          y: pinchMidpoint.y - (pinchMidpoint.y - currentTransform.y) * (newScale / currentTransform.scale),
        };
        setTransform(constrainTransform(newTransform));
      }
    }

    function handleTouchEnd(e) {
      if (e.touches.length < 2) {
        lastDistance = null;
        pinchStartScale = null;
        pinchStartTransform = null;
        pinchMidpoint = null;
      }
    }

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [constrainTransform]);

  // Zoom controls
  const resetView = useCallback(() => {
    centerView();
  }, [centerView]);

  // Check if we need to load more projects
  useEffect(() => {
    const checkBounds = () => {
      if (!whiteboardRef.current) return;
      const rect = whiteboardRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      
      if (rect.right < containerRect.right + 500 || rect.bottom < containerRect.bottom + 500) {
        if (hasMore && !isLoading) {
          loadMoreProjects();
        }
      }
    };
    
    checkBounds();
  }, [transform, hasMore, isLoading, loadMoreProjects]);

  // Loading skeleton component
  const LoadingSkeleton = ({ x, y, cardWidth, cardHeight, animationPhase }) => (
    <div 
      className="project-card absolute bg-gray-200 rounded-lg shadow-sm"
      style={{
        left: x,
        top: y,
        width: cardWidth,
        height: cardHeight,
        zIndex: animationPhase === 'scrambling' ? 10 : 1,
        opacity: animationPhase === 'scrambling' ? 0.8 : 1,
        transition: animationPhase === 'scrambling' 
          ? 'opacity 0.2s ease'
          : 'all 0.3s ease',
        transitionDelay: animationPhase === 'sliding' ? `${Math.random() * 0.1}s` : '0s',
      }}
    >
      <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
      </div>
    </div>
  );

  // Animation handler for filter changes
  const triggerFilterAnimation = useCallback((newCategories) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setAnimationPhase('scrambling');
    setActiveCategories(newCategories);
    
    setTimeout(() => {
      setAnimationPhase('sliding');
      setTimeout(() => {
        setAnimationPhase('idle');
        setIsAnimating(false);
      }, 800);
    }, 200);
  }, [isAnimating]);

  // Filter handlers
  const handleCategoryClick = (category) => {
    const newCategories = activeCategories.includes(category) 
      ? activeCategories.filter(cat => cat !== category)
      : [category];
    
    if (JSON.stringify(newCategories) !== JSON.stringify(activeCategories)) {
      triggerFilterAnimation(newCategories);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row overflow-hidden">
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

      {/* Main Whiteboard Container */}
      <div 
        ref={containerRef}
        className={`flex-1 relative overflow-hidden select-none transition-colors duration-900`}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        style={{ 
          backgroundColor: whiteboardBgColor,
          backgroundSize: '40px 40px',
          backgroundPosition: '0 0, 20px 20px',
          touchAction: 'none',
          }}
      >

        {/* Header - Fixed position */}
        <div className="absolute top-8 left-8 right-8 z-30 bg-transparent rounded-lg !p-4 w-auto">
          <div className="flex flex-col">
            {/* Category Filter Bar */}
            <div className="flex flex-wrap gap-2 justify-center">
              {allCategories.map((category) => {
                const isActive = activeCategories.includes(category);
                return (
                  <button
                    key={category}
                    className={`relative flex items-center !px-4 !py-2 cursor-pointer rounded-full tracking-widest sm:text-3xl md:text-4xl text-xl  font-semibold transition-colors font-700 lowercase
                      ${isActive
                        ? 'text-black border-black'
                        : 'text-gray-500 border-gray-300 '}
                    `}
                    onClick={() => handleCategoryClick(category)}
                    style={{ cursor: 'pointer' }}
                  >
                    <span>{category}</span>
                  </button>
                );
              })}
            </div>
            
            {/* Underline for visual separation */}
            <div ref={lineRef} className="w-full h-0.5 bg-gray-900 !mt-3" />
          </div>
        </div>

        {/* Whiteboard Content */}
        <div
          ref={whiteboardRef}
          className="absolute inset-0"
          style={{
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
            transformOrigin: '0 0',
            willChange: isDragging ? 'transform' : 'auto',
            transition: isDragging ? 'none' : 'transform 0.1s ease-out'
          }}
        >
          {/* Animation overlay to prevent visual artifacts */}
          {isAnimating && (
            <div 
              className="absolute inset-0 pointer-events-none z-5"
              style={{
                backgroundColor: whiteboardBgColor,
                opacity: animationPhase === 'scrambling' ? 0.1 : 0,
                transition: 'opacity 0.3s ease'
              }}
            />
          )}
          
          {/* Projects Grid */}
          <div className="relative" style={{ width: `${WHITEBOARD_WIDTH}px`, height: `${WHITEBOARD_HEIGHT}px` }}>
            {projectsWithPositions.map((item) => {
              if (item.isSkeleton) {
                return <LoadingSkeleton key={item.id} x={item.x} y={item.y} cardWidth={item.cardWidth} cardHeight={item.cardHeight} animationPhase={item.animationPhase} />;
              }
              return (
                <div
                  key={item.docId}
                  className="project-card absolute cursor-pointer group"
                  style={{
                    left: item.x,
                    top: item.y,
                    width: item.cardWidth,
                    height: item.cardHeight,
                    zIndex: item.animationPhase === 'scrambling' ? 10 : 1,
                    opacity: item.animationPhase === 'scrambling' ? 0.8 : 1,
                    transition: item.animationPhase === 'sliding' 
                      ? 'left 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), top 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.3s ease' 
                      : item.animationPhase === 'scrambling'
                      ? 'opacity 0.2s ease'
                      : 'all 0.3s ease',
                    transitionDelay: item.animationPhase === 'sliding' ? `${Math.random() * 0.1}s` : '0s',
                    cursor: 'pointer'
                  }}
                  onClick={() => navigate(`/project/${item.docId}`)}
                >
                  <div 
                    className="w-full h-full overflow-hidden relative"
                  >
                    {item.cimg ? (
                      <div className="relative w-full h-full overflow-hidden">
                        <img 
                          src={item.cimg} 
                          alt={item.title || 'Project image'}
                          className="w-full h-full object-cover transition-opacity duration-300 "
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-500">No Image</span>
                      </div>
                    )}
                  </div>
                  {/* Title that appears beneath card on hover (desktop) or always visible (mobile) */}
                  <div className="absolute top-full left-0 right-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 z-50 pointer-events-none">
                    <h3 className="text-sm font-semibold text-black line-clamp-2 !mt-2 text-center px-2 tracking-widest">
                      {item.title}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Projects;