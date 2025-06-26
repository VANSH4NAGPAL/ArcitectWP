import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProjectCard from './ProjectCard';
import { projects } from '../data/projects';

const Carousel = ({ currentSlide, onSlideChange }) => {
  // Limit to first 4 projects
  const carouselProjects = projects.slice(0, 4);
  
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    duration: 25, // Slower transition for smoothness
    dragFree: false,
    skipSnaps: false,
    align: 'start',
    speed: 8, // Reduced speed for smoother transitions
    startIndex: 0
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const newIndex = emblaApi.selectedScrollSnap();
    setSelectedIndex(newIndex);
    onSlideChange(newIndex);
  }, [emblaApi, onSlideChange]);

  const scrollTo = useCallback(
    (index) => {
      if (emblaApi) {
        emblaApi.scrollTo(index);
        setIsAutoScrolling(false);
        setTimeout(() => setIsAutoScrolling(true), 5000);
      }
    },
    [emblaApi]
  );

  const scrollPrev = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
    setIsAutoScrolling(false);
    setTimeout(() => setIsAutoScrolling(true), 5000);
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
    setIsAutoScrolling(false);
    setTimeout(() => setIsAutoScrolling(true), 5000);
  }, [emblaApi]);

  // Auto-scroll effect - simplified to let Embla handle smooth looping
  useEffect(() => {
    if (!emblaApi || !isAutoScrolling) return;

    const autoScroll = setInterval(() => {
      emblaApi.scrollNext();
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(autoScroll);
  }, [emblaApi, isAutoScrolling]);

  // Pause auto-scroll on hover
  const handleMouseEnter = () => setIsAutoScrolling(false);
  const handleMouseLeave = () => setIsAutoScrolling(true);

  useEffect(() => {
    if (!emblaApi) return;
    
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (emblaApi && currentSlide !== selectedIndex) {
      const timeoutId = setTimeout(() => {
        emblaApi.scrollTo(currentSlide);
      }, 50);
      
      return () => clearTimeout(timeoutId);
    }
  }, [currentSlide, selectedIndex, emblaApi]);

  return (
    <div 
      className="relative w-full h-screen overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Carousel */}
      <div className="embla" ref={emblaRef}>
        <div className="embla__container">
          {carouselProjects.map((project, index) => (
            <div className="embla__slide" key={project.id}>
              <ProjectCard 
                project={project} 
                isActive={selectedIndex === index}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Progress Indicators - Bottom Center (Desktop) / Left Side Vertical (Mobile) */}
      <div className="absolute top-1/2 left-4 -translate-y-1/2 z-50 md:bottom-8 md:left-1/2 md:-translate-x-1/2 md:top-auto md:translate-y-0">
        <div className="flex flex-col gap-3 md:flex-row">
          {scrollSnaps.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => scrollTo(index)}
              className="relative cursor-pointer focus:outline-none focus:ring-0 focus:border-none"
              style={{ outline: 'none', border: 'none' }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <motion.div
                className="bg-white/40 transition-all duration-500 md:w-[60px] md:h-[2px] w-[2px] h-[60px]"
                animate={{
                  backgroundColor: selectedIndex === index 
                    ? 'rgba(255,255,255,0.9)' 
                    : 'rgba(255,255,255,0.4)',
                  boxShadow: selectedIndex === index 
                    ? '0 0 10px rgba(255,255,255,0.3)' 
                    : 'none'
                }}
                transition={{ 
                  duration: 0.3, 
                  ease: "easeInOut"
                }}
              />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Project Counter */}
      <motion.div 
        className="absolute bottom-8 right-30 z-50 text-white/60"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <div className="flex items-center space-x-2 text-sm font-light tracking-wider">
          <motion.span 
            key={selectedIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-white text-xl font-medium"
          >
            {String(selectedIndex + 1).padStart(2, '0')}
          </motion.span>
          <span>/</span>
          <span>{String(carouselProjects.length).padStart(2, '0')}</span>
        </div>
      </motion.div>
    </div>
  );
};

export default Carousel;