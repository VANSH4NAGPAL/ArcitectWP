import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { FaBars, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '../components/Navigation';
import '../App.css';

function ProjectDetail() {
  const { id } = useParams();
  const numericId = Number(id);
  const [allProjects, setAllProjects] = useState([]);
  const [showInfo, setShowInfo] = useState(false);
  const [activeTab, setActiveTab] = useState('info'); // 'info' or 'story'
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mainImageIdx, setMainImageIdx] = useState(0);
  const [images, setImages] = useState([]);
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

  // Set images when currentProject changes
  useEffect(() => {
    if (currentProject) {
      const interiorImages = currentProject.interiorImages || [];
      const exteriorImages = currentProject.exteriorImages || [];
      setImages([...interiorImages, ...exteriorImages]);
      setMainImageIdx(0); // Reset to first image
    }
  }, [currentProject]);

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
  }, [images.length]);

  // Placeholder: Replace with your actual sidebar open state/prop
  const isSidebarOpen = false; // TODO: Replace with real sidebar state

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
    <div className="min-h-screen bg-white flex flex-col items-center justify-center !mt-60    ">
      {/* Top Image Section */}
      <div className="flex flex-row w-[70vw]   mx-auto !gap-6">
        {/* Main Image */}
        <div className="flex-1  bg-gray-200 h-[60vh] overflow-hidden shadow-lg">
          <AnimatePresence mode="wait">
            {images[mainImageIdx] && (
              <motion.img
                key={images[mainImageIdx]}
                src={images[mainImageIdx]}
                alt="Main Project"
                className="w-full h-full object-cover center"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.03 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
              />
            )}
          </AnimatePresence>
        </div>
        {/* Thumbnails */}
        <div className="flex flex-col !gap-4  max-w-[320px] h-[60vh]">
          {[1, 2, 3].map((offset, idx) => {
            const imgIdx = offset < images.length ? offset : null;
            if (imgIdx === null || !images[imgIdx]) return <div key={`empty-${idx}`} className=" bg-gray-100 " />;
            // Swap logic: clicking swaps main and thumbnail in images state
            const handleSwap = () => {
              if (mainImageIdx === imgIdx) return;
              const newImages = [...images];
              // Always swap with index 0 (main image)
              [newImages[0], newImages[imgIdx]] = [newImages[imgIdx], newImages[0]];
              setImages(newImages);
              setMainImageIdx(0);
            };
            return (
              <button
                key={images[imgIdx] ? images[imgIdx] + '-' + imgIdx : imgIdx}
                className={`aspect-[4/3]  overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                  mainImageIdx === imgIdx ? "border-black" : "border-transparent"
                }`}
                onClick={handleSwap}
                tabIndex={0}
              >
                <motion.img
                  src={images[imgIdx]}
                  alt={`Thumbnail ${imgIdx + 1}`}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.07 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Details Section */}
      <div className="w-[71vw] mx-auto flex flex-col !mt-10 ">
        {/* Left: Meta Info */}
        <div className="w-full !py-4 !px-4 flex flex-row gap-10">
          <div>
            <div className="uppercase text-xl text-black !mb-1 tracking-[0.1em]">Client</div>
            <div className="font-semibold text-black tracking-[0.1em]">{currentProject.client}</div>
          </div>
          <div>
            <div className="uppercase text-xl text-black !mb-1 tracking-[0.1em]">Category</div>
            <div className="font-semibold text-black tracking-[0.1em]">{currentProject.category || "-"}</div>
          </div>
          <div>
            <div className="uppercase text-xl text-black !mb-1 tracking-[0.1em]">Type</div>
            <div className="font-semibold text-black tracking-[0.1em]">{currentProject.type || "-"}</div>
          </div>
          <div>
            <div className="uppercase text-xl text-black !mb-1 tracking-[0.1em]">Use Type</div>
            <div className="font-semibold text-black tracking-[0.1em]">{currentProject.useType || "-"}</div>
          </div>
          <div>
            <div className="uppercase text-xl text-black !mb-1 tracking-[0.1em]">Area</div>
            <div className="font-semibold text-black tracking-[0.1em]">{currentProject.area || "-"}</div>
          </div>
          <div>
            <div className="uppercase text-xl text-black !mb-1 tracking-[0.1em]">Size</div>
            <div className="font-semibold text-black tracking-[0.1em]">{currentProject.size || "-"}</div>
          </div>
          
          <div>
            <div className="uppercase text-xl text-black !mb-1 tracking-[0.1em]">Location</div>
            <div className="font-semibold text-black tracking-[0.1em]">{currentProject.location || "-"}</div>
          </div>
          <div>
            <div className="uppercase text-xl text-black !mb-1 tracking-[0.1em]">Design Team</div>
            <div className="font-semibold text-black tracking-[0.1em]">{currentProject.designTeam || "-"}</div>
          </div>
          <div>
            <div className="uppercase text-xl text-black !mb-1 tracking-[0.1em]">Services Provided</div>
            <div className="font-semibold text-black tracking-[0.1em]">{currentProject.servicesProvided || "-"}</div>
          </div>
          <div>
            <div className="uppercase text-xl text-black !mb-1 tracking-[0.1em]">Project Dates</div>
            <div className="font-semibold text-black tracking-[0.1em]">
              {currentProject.projectDates?.design && (
                <div>Design: {currentProject.projectDates.design}</div>
              )}
              {currentProject.projectDates?.fabrication && (
                <div>Fabrication: {currentProject.projectDates.fabrication}</div>
              )}
              {currentProject.projectDates?.opening && currentProject.projectDates.opening !== "" && (
                <div>Opening: {currentProject.projectDates.opening}</div>
              )}
            </div>
          </div>
        </div>
        {/* Right: Description */}
        <div className="w-full !py-8 !px-8 flex flex-col justify-start">
          <div className="uppercase text-xl text-gray-700 !mb-2 font-semibold">About</div>
          <div className="text-gray-800 whitespace-pre-line">{currentProject.description || "No description available."}</div>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetail;
