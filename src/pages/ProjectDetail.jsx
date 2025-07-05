import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import '../App.css';

function ProjectDetail() {
  const { id } = useParams();
  const numericId = Number(id);
  const [allProjects, setAllProjects] = useState([]);
  const [showInfo, setShowInfo] = useState(false);
  const [activeTab, setActiveTab] = useState('info'); // 'info' or 'story'
  const scrollRef = useRef(null);

  // Static white background
  const backgroundColor = '#ffffff';

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
      {/* Top Right Tab Buttons */}
      <div className="fixed top-6 right-6 z-50">
        <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-lg flex items-center overflow-hidden border border-white/30">
          <button
            className="!px-4 !py-2 text-gray-800 font-extrabold tracking-widest !mr-5 truncate max-w-[200px]"
          >
            {currentProject.title}
          </button>
          <button
            onClick={() => {
              if (showInfo && activeTab === 'info') {
                setShowInfo(false);
              } else {
                setShowInfo(true);
                setActiveTab('info');
              }
            }}
            className={`!px-4 !py-2 font-semibold transition-colors cursor-pointer tracking-widest ${
              activeTab === 'info' && showInfo 
                ? ' text-gray-800 ' 
                : 'text-gray-600 '
            }`}
          >
            Info
          </button>
          <button
            onClick={() => {
              if (showInfo && activeTab === 'story') {
                setShowInfo(false);
              } else {
                setShowInfo(true);
                setActiveTab('story');
              }
            }}
            className={`!px-4 !py-2 font-semibold transition-colors cursor-pointer tracking-widest ${
              activeTab === 'story' && showInfo 
                ? ' text-gray-800' 
                : 'text-gray-600'
            }`}
          >
            Story
          </button>
        </div>
      </div>

      {/* Info Overlay - Slides in from right */}
      <div className={`fixed top-0 right-0 w-[820px] h-full bg-white/40 backdrop-blur-lg border-l border-white/50 shadow-2xl transition-all duration-300 ease-out z-40 ${
        showInfo ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}>
        <div className="!p-6 h-full overflow-y-auto !mt-16">
          {/* Content based on active tab */}
          {activeTab === 'info' && (
            <div>
              {/* Project Description/Story */}
              

              {/* Project Details Table */}
              <div className="border-0  overflow-hidden">
                {/* Client */}
                {currentProject.client && (
                  <div className="grid grid-cols-5 border-b border-black/100 last:border-b-0">
                    <div className="col-span-2 !px-0 !py-2 font-semibold text-black text-lg tracking-wider">
                      Client
                    </div>
                    <div className="col-span-3 !px-0 !py-2 text-black text-lg font-semibold tracking-wider">
                      {currentProject.client}
                    </div>
                  </div>
                )}

                {/* Location */}
                {currentProject.location && (
                  <div className="grid grid-cols-5 border-b border-black/100 last:border-b-0">
                    <div className="col-span-2 !px-0 !py-2 font-semibold text-black text-lg tracking-wider">
                      Location
                    </div>
                    <div className="col-span-3 !px-0 !py-2 text-lg">
                      <span className="text-black    font-semibold tracking-wider">{currentProject.location}</span>
                    </div>
                  </div>
                )}

                {/* Size */}
                {currentProject.size && (
                  <div className="grid grid-cols-5 border-b border-black/100 last:border-b-0">
                    <div className="col-span-2 !px-0 !py-2 font-semibold text-black text-lg tracking-wider">
                      Size
                    </div>
                    <div className="col-span-3 !px-0 !py-2 text-black text-lg font-semibold tracking-wider">
                      {currentProject.size} m²
                    </div>
                  </div>
                )}

                {/* Project Dates */}
                {(currentProject.projectDates?.design || 
                  currentProject.projectDates?.fabrication || 
                  currentProject.projectDates?.opening) && (
                  <div className="grid grid-cols-5 border-b border-black/100 last:border-b-0">
                    <div className="col-span-2 !px-0 !py-2 font-semibold text-black text-lg tracking-wider">
                      Project dates
                    </div>
                    <div className="col-span-3 !px-0 !py-2 text-black text-lg font-semibold tracking-wider">
                      {currentProject.projectDates?.design && (
                        <div>Design: {currentProject.projectDates.design}</div>
                      )}
                      {currentProject.projectDates?.fabrication && (
                        <div>Fabrication & Installation: {currentProject.projectDates.fabrication}</div>
                      )}
                      {currentProject.projectDates?.opening && (
                        <div>Opening: {currentProject.projectDates.opening}</div>
                      )}
                    </div>
                  </div>
                )}

                {/* Services Provided */}
                {currentProject.servicesProvided && (
                  <div className="grid grid-cols-5 border-b border-black/100 last:border-b-0">
                    <div className="col-span-2 !px-0 !py-2 font-semibold text-black text-lg tracking-wider">
                      Services provided
                    </div>
                    <div className="col-span-3 !px-0 !py-2 text-black text-lg font-semibold tracking-wider">
                      {currentProject.servicesProvided}
                    </div>
                  </div>
                )}

                {/* Design Team */}
                {currentProject.designTeam && (
                  <div className="grid grid-cols-5 border-b border-black/100 last:border-b-0">
                    <div className="col-span-2 !px-0 !py-2 font-semibold text-black text-lg tracking-wider">
                      Design team
                    </div>
                    <div className="col-span-3 !px-0 !py-2 text-black text-lg font-semibold tracking-wider">
                      {currentProject.designTeam}
                    </div>
                  </div>
                )}

                {/* Press Links */}
                {(currentProject.pressLinks && currentProject.pressLinks.length > 0) && (
                  <div className="grid grid-cols-5 border-b border-black/100 last:border-b-0">
                    <div className="col-span-2 !px-0 !py-2 font-semibold text-black text-lg tracking-wider">
                      Press links
                    </div>
                    <div className="col-span-3 !px-0 !py-2 text-lg font-semibold tracking-wider">
                      {currentProject.pressLinks.map((link, idx) => (
                        <div key={idx} className="!mb-1">
                          <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-800 underline decoration-2 decoration-blue-800 cursor-pointer font-semibold tracking-wider">
                            {link}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Project Type */}
                {currentProject.projectType && (
                  <div className="grid grid-cols-5 border-b border-black/100 last:border-b-0">
                    <div className="col-span-2 !px-0 !py-2 font-semibold text-black text-lg tracking-wider">
                      Project type
                    </div>
                    <div className="col-span-3 !px-0 !py-2 text-black text-lg font-semibold tracking-wider">
                      {currentProject.projectType}
                    </div>
                  </div>
                )}

                {/* Use Type */}
                {currentProject.useType && (
                  <div className="grid grid-cols-5 border-b border-black/100 last:border-b-0">
                    <div className="col-span-2 !px-0 !py-2 font-semibold text-black text-lg tracking-wider">
                      Use type
                    </div>
                    <div className="col-span-3 !px-0 !py-2 text-black text-lg font-semibold tracking-wider">
                      <div className="flex flex-wrap gap-2">
                        {currentProject.useType.split(',').map((type, idx) => (
                          <span key={idx} className="bg-black/30 text-black !px-2 !py-1  text-xs font-semibold tracking-wider">
                            {type.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Year */}
                {currentProject.year && (
                  <div className="grid grid-cols-5 border-b border-black/100 last:border-b-0">
                    <div className="col-span-2 !px-0 !py-2 font-semibold text-black text-lg tracking-wider">
                      Year
                    </div>
                    <div className="col-span-3 !px-0 !py-2 text-black text-lg font-semibold tracking-wider">
                      {currentProject.year}
                    </div>
                  </div>
                )}

                {/* Area */}
                {currentProject.area && (
                  <div className="grid grid-cols-5 border-b border-black/100 last:border-b-0">
                    <div className="col-span-2 !px-0 !py-2 font-semibold text-black text-lg tracking-wider">
                      Area
                    </div>
                    <div className="col-span-3 !px-0 !py-2 text-black text-lg font-semibold tracking-wider">
                      {currentProject.area}
                    </div>
                  </div>
                )}

                {/* Category */}
                {currentProject.category && (
                  <div className="grid grid-cols-5 border-b border-black/100 last:border-b-0">
                    <div className="col-span-2 !px-0 !py-2 font-semibold text-black text-lg tracking-wider">
                      Category
                    </div>
                    <div className="col-span-3 !px-0 !py-2 text-black text-lg font-semibold tracking-wider">
                      {currentProject.category === "Other" && currentProject.customCategory
                        ? currentProject.customCategory
                        : currentProject.category}
                    </div>
                  </div>
                )}

                {/* Type */}
                {currentProject.type && (
                  <div className="grid grid-cols-5 border-b border-black/100 last:border-b-0">
                    <div className="col-span-2 !px-0 !py-2 font-semibold text-black text-lg tracking-wider">
                      Type
                    </div>
                    <div className="col-span-3 !px-0 !py-2 text-black text-lg font-semibold tracking-wider">
                      {currentProject.type}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'story' && (
            <div>
              {currentProject.description ? (
                <div className="text-black leading-relaxed text-base font-semibold tracking-wider">
                  {currentProject.description}
                </div>
              ) : (
                <p className="text-black/70 italic font-semibold tracking-wider">No story available for this project.</p>
              )}
            </div>
          )}
        </div>
      </div>

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
                    className={`flex-shrink-0 ${width} ${height}  overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 ${
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
