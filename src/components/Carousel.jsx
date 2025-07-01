import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import ProjectCard from './ProjectCard';
import { projects } from '../data/projects';

const Carousel = () => {
  // Limit to first 4 projects
  const carouselProjects = projects.slice(0, 4);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    dragFree: false,
    skipSnaps: false,
    align: 'start',
    speed: 8,
    startIndex: 0
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  // Select handler
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  // Scroll to slide
  const scrollTo = useCallback(
    (index) => {
      if (emblaApi) {
        emblaApi.scrollTo(index);
      }
    },
    [emblaApi]
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // Embla events
  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  // Auto-scroll effect
  useEffect(() => {
    if (!emblaApi) return;
    const autoScroll = setInterval(() => {
      emblaApi.scrollNext();
    }, 4000);
    return () => clearInterval(autoScroll);
  }, [emblaApi]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
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

      {/* Progress Indicators */}
      <div className="absolute top-1/2 left-4 -translate-y-1/2 z-50 md:bottom-8 md:left-1/2 md:-translate-x-1/2 md:top-auto md:translate-y-0">
        <div className="flex flex-col gap-3 md:flex-row">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`relative cursor-pointer focus:outline-none focus:ring-0 focus:border-none w-3 h-3 rounded-full ${selectedIndex === index ? 'bg-white' : 'bg-white/40'}`}
              style={{ outline: 'none', border: 'none' }}
            />
          ))}
        </div>
      </div>

      {/* Project Counter */}
      <div className="absolute bottom-8 right-30 z-50 text-white/60">
        <div className="flex items-center space-x-2 text-sm font-light tracking-wider">
          <span className="text-white text-xl font-medium">
            {String(selectedIndex + 1).padStart(2, '0')}
          </span>
          <span>/</span>
          <span>{String(carouselProjects.length).padStart(2, '0')}</span>
        </div>
      </div>
    </div>
  );
};

export default Carousel;