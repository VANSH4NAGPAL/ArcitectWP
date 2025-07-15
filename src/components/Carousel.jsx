import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const Carousel = ({ onSlideChange }) => {
  const [carouselProjects, setCarouselProjects] = useState([]);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    inViewThreshold: 1,
    startIndex: 0
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  // Fetch projects from Firestore
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'projects'), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        docId: doc.id,
        ...doc.data(),
      }));
      setCarouselProjects(data.slice(0, 4)); // Limit to 4 projects
    });
    return () => unsub();
  }, []);

  // Select handler
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const idx = emblaApi.selectedScrollSnap();
    setSelectedIndex(idx);
    if (onSlideChange && carouselProjects[idx]) {
      onSlideChange(carouselProjects[idx]);
    }
  }, [emblaApi, onSlideChange, carouselProjects]);

  // Scroll to slide
  const scrollTo = useCallback(
    (index) => {
      if (emblaApi) {
        emblaApi.scrollTo(index);
      }
    },
    [emblaApi]
  );

  // Embla events
  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    // Call initially
    onSelect();
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  // Auto-scroll effect
  useEffect(() => {
    if (!emblaApi || carouselProjects.length === 0) return;
    const autoScroll = setInterval(() => {
      if (!emblaApi) return;
      emblaApi.scrollNext();
    }, 6000);
    return () => clearInterval(autoScroll);
  }, [emblaApi, carouselProjects.length]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Carousel */}
      <div className="embla w-full h-full" ref={emblaRef}>
        <div className="embla__container flex w-full h-full">
          {carouselProjects.map((project, index) => (
            <div
              className="embla__slide flex-shrink-0 w-full h-full flex items-center justify-center !m-0 !p-0"
              key={project.docId || project.id || index}
              style={{ minWidth: '100%', minHeight: '100%' }}
            >
              <img
                src={project.cimg}
                alt={project.title || `Project ${index + 1}`}
                className="w-full h-full object-cover !rounded-none !shadow-none !m-0 !p-0"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="flex flex-row gap-3">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-200 ${selectedIndex === index ? 'bg-white' : 'bg-white/40'}`}
              style={{ outline: 'none', border: 'none' }}
            />
          ))}
        </div>
      </div>

      {/* Project Counter */}
      <div className="absolute top-6 right-8 z-50 text-white/80">
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