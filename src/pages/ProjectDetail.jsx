import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import '../App.css';

function ProjectDetail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const numericId = Number(id);
  const [allProjects, setAllProjects] = useState([]);
  const scrollRef = useRef(null);

  // Get the background color from URL params
  const backgroundColor = searchParams.get('color') || '#f9fafb';

  // Fetch projects
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'projects'), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        docId: doc.id,
        ...doc.data(),
      }));
      setAllProjects(data);
    });
    return () => unsub();
  }, []);

  // Find current project and get all images
  const currentProject = allProjects.find((p) => {
    if (p.docId === id) return true;
    if (!isNaN(numericId) && p.id === numericId) return true;
    return false;
  });

  const interiorImages = currentProject?.interiorImages || [];
  const exteriorImages = currentProject?.exteriorImages || [];
  const allImages = [...interiorImages, ...exteriorImages];

  // Different image size configurations for gallery effect
  const getImageSize = (index) => {
    const patterns = [
      { width: 'w-[700px]', height: 'h-[500px]' }, // Large
      { width: 'w-[450px]', height: 'h-[350px]' }, // Medium
      { width: 'w-[600px]', height: 'h-[400px]' }, // Medium-Large
      { width: 'w-[400px]', height: 'h-[480px]' }, // Tall
      { width: 'w-[650px]', height: 'h-[420px]' }, // Wide
      { width: 'w-[380px]', height: 'h-[300px]' }, // Small
    ];
    return patterns[index % patterns.length];
  };

  // Mouse wheel horizontal scroll
  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    const handleWheel = (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        e.stopPropagation();
        
        const scrollSpeed = 3; // Increased scroll speed for more responsiveness
        const newScrollLeft = scrollElement.scrollLeft + e.deltaY * scrollSpeed;
        
        // Clamp to scroll bounds
        const maxScroll = scrollElement.scrollWidth - scrollElement.clientWidth;
        scrollElement.scrollLeft = Math.max(0, Math.min(newScrollLeft, maxScroll));
      }
    };

    scrollElement.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      scrollElement.removeEventListener('wheel', handleWheel);
    };
  }, [allImages.length]);

  if (allProjects.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl font-semibold">Loading project...</div>
      </div>
    );
  }

  if (!currentProject) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold !mb-4">Project Not Found</h1>
          <p className="text-gray-600 !mb-4">
            Project with ID "{id}" does not exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor }}>
      {/* All Images Horizontal Scroll */}
      {allImages.length > 0 && (
        <div className="w-full h-screen flex items-center !py-12">
          <div 
            ref={scrollRef}
            className="overflow-x-auto overflow-y-hidden scroll-smooth w-full"
            style={{ 
              height: 'calc(100vh - 96px)', // Account for padding
              scrollbarWidth: 'thin',
              scrollbarColor: '#888 transparent',
              willChange: 'scroll-position',
              transform: 'translateZ(0)'
            }}
          >
             <div className="flex gap-6 items-center !px-8" style={{ 
              width: 'max-content',
              height: '100%',
              backfaceVisibility: 'hidden',
              perspective: '1000px'
            }}>
              {allImages.map((imageUrl, idx) => {
                const { width, height } = getImageSize(idx);
                const isLarge = width.includes('700') || height.includes('500');
                
                return (
                  <div
                    key={idx}
                    className={`flex-shrink-0 ${width} ${height} rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 ${
                      isLarge ? 'ring-2 ring-white/20' : ''
                    }`}
                    style={{
                      willChange: 'transform',
                      backfaceVisibility: 'hidden',
                      transform: `translateY(${Math.sin(idx * 0.5) * 15}px)` // Reduced vertical offset
                    }}
                  >
                    <img
                      src={imageUrl}
                      alt={`Project Image ${idx + 1}`}
                      className="w-full h-full object-cover bg-center hover:scale-110 transition-transform duration-700 cursor-pointer"
                      style={{
                        willChange: 'transform',
                        backfaceVisibility: 'hidden',
                        filter: 'brightness(0.95) contrast(1.05)',
                        transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                      loading="lazy"
                      onMouseEnter={(e) => {
                        e.target.style.filter = 'brightness(1.1) contrast(1.15) saturate(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.filter = 'brightness(0.95) contrast(1.05)';
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectDetail;
