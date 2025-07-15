import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { motion, AnimatePresence } from 'framer-motion';
import '../App.css';

function ProjectDetail() {
  const { id } = useParams();
  const numericId = Number(id);
  const [allProjects, setAllProjects] = useState([]);
  // Removed unused: showInfo, setShowInfo, activeTab, setActiveTab, mobileNavOpen, setMobileNavOpen
  const [mainImageIdx, setMainImageIdx] = useState(0);
  const [images, setImages] = useState([]);
  const scrollRef = useRef(null);

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

  const currentProject = allProjects.find((p) => {
    if (p.docId === id) return true;
    if (!isNaN(numericId) && p.id === numericId) return true;
    return false;
  });

  useEffect(() => {
    if (currentProject) {
      const interiorImages = currentProject.interiorImages || [];
      const exteriorImages = currentProject.exteriorImages || [];
      setImages([...interiorImages, ...exteriorImages]);
      setMainImageIdx(0);
    }
  }, [currentProject]);

  // (Unused) getImageSize function removed for cleanliness

  // Mouse wheel horizontal scroll for thumbnails
  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;
    const handleWheel = (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        e.stopPropagation();
        const scrollSpeed = 3;
        const newScrollLeft = scrollElement.scrollLeft + e.deltaY * scrollSpeed;
        const maxScroll = scrollElement.scrollWidth - scrollElement.clientWidth;
        scrollElement.scrollLeft = Math.max(0, Math.min(newScrollLeft, maxScroll));
      }
    };
    scrollElement.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      scrollElement.removeEventListener('wheel', handleWheel);
    };
  }, [images.length]);


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
    <div className="min-h-screen bg-white flex flex-col items-center justify-center !mt-8 md:!mt-56 !px-2 sm:!px-4">
      <div className="w-full">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black !mb-14 text-center break-words">
            {currentProject.title}
          </h1>
        </div>
      <div className="flex flex-col md:flex-row w-full max-w-[96vw] md:max-w-[70vw] mx-auto gap-4 md:gap-6">
        
        <div className="flex-1 bg-gray-200 h-[32vh] sm:h-[40vh] md:h-[60vh] overflow-hidden shadow-lg min-w-0 ">
          <AnimatePresence mode="wait">
            {images[mainImageIdx] && (
              <motion.img
                key={images[mainImageIdx]}
                src={images[mainImageIdx]}
                alt="Main Project"
                className="w-full h-full object-cover center min-h-[140px] sm:min-h-[200px]"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.03 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
              />
            )}
          </AnimatePresence>
        </div>
        <div className="flex flex-row md:flex-col gap-2 md:gap-4 w-full md:max-w-[320px] h-auto md:h-[60vh] !mt-2 md:!mt-0">
          {[1, 2, 3].map((offset, idx) => {
            const imgIdx = offset < images.length ? offset : null;
            if (imgIdx === null || !images[imgIdx]) return <div key={`empty-${idx}`} className="bg-gray-100 w-[28vw] h-[12vw] min-w-[60px] min-h-[40px] md:w-auto md:h-auto " />;
            const handleSwap = () => {
              if (mainImageIdx === imgIdx) return;
              const newImages = [...images];
              [newImages[0], newImages[imgIdx]] = [newImages[imgIdx], newImages[0]];
              setImages(newImages);
              setMainImageIdx(0);
            };
            return (
              <button
                key={images[imgIdx] ? images[imgIdx] + '-' + imgIdx : imgIdx}
                className={`aspect-[4/3] overflow-hidden border-2 transition-all duration-200 cursor-pointer ${mainImageIdx === imgIdx ? "border-black" : "border-transparent"} w-[28vw] h-[12vw] min-w-[60px] min-h-[40px] md:w-auto md:h-auto `}
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
      <div className="w-full max-w-[98vw] md:max-w-[71vw] mx-auto flex flex-col !mt-6 md:!mt-10">
        {/* Responsive two-column grid for project info (always two columns) */}
        <div className="w-full !py-4 !px-2 sm:!px-4 grid grid-cols-2 gap-4 md:gap-10 text-center sm:text-left">
          <div>
            <div className="uppercase text-base sm:text-xl text-black !mb-1 tracking-[0.1em]">Client</div>
            <div className="font-semibold text-black tracking-[0.1em] text-sm sm:text-base">{currentProject.client}</div>
          </div>
          <div>
            <div className="uppercase text-base sm:text-xl text-black !mb-1 tracking-[0.1em]">Category</div>
            <div className="font-semibold text-black tracking-[0.1em] text-sm sm:text-base">{currentProject.category || "-"}</div>
          </div>
          <div>
            <div className="uppercase text-base sm:text-xl text-black !mb-1 tracking-[0.1em]">Type</div>
            <div className="font-semibold text-black tracking-[0.1em] text-sm sm:text-base">{currentProject.type || "-"}</div>
          </div>
          <div>
            <div className="uppercase text-base sm:text-xl text-black !mb-1 tracking-[0.1em]">Use Type</div>
            <div className="font-semibold text-black tracking-[0.1em] text-sm sm:text-base">{currentProject.useType || "-"}</div>
          </div>
          <div>
            <div className="uppercase text-base sm:text-xl text-black !mb-1 tracking-[0.1em]">Area</div>
            <div className="font-semibold text-black tracking-[0.1em] text-sm sm:text-base">{currentProject.area || "-"}</div>
          </div>
          <div>
            <div className="uppercase text-base sm:text-xl text-black !mb-1 tracking-[0.1em]">Size</div>
            <div className="font-semibold text-black tracking-[0.1em] text-sm sm:text-base">{currentProject.size || "-"}</div>
          </div>
          <div>
            <div className="uppercase text-base sm:text-xl text-black !mb-1 tracking-[0.1em]">Location</div>
            <div className="font-semibold text-black tracking-[0.1em] text-sm sm:text-base">{currentProject.location || "-"}</div>
          </div>
          <div>
            <div className="uppercase text-base sm:text-xl text-black !mb-1 tracking-[0.1em]">Design Team</div>
            <div className="font-semibold text-black tracking-[0.1em] text-sm sm:text-base">{currentProject.designTeam || "-"}</div>
          </div>
          <div>
            <div className="uppercase text-base sm:text-xl text-black !mb-1 tracking-[0.1em]">Services Provided</div>
            <div className="font-semibold text-black tracking-[0.1em] text-sm sm:text-base">{currentProject.servicesProvided || "-"}</div>
          </div>
          <div>
            <div className="uppercase text-base sm:text-xl text-black !mb-1 tracking-[0.1em]">Project Dates</div>
            <div className="font-semibold text-black tracking-[0.1em] text-sm sm:text-base">
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
        {/* Description always centered and full width */}
        <div className="w-full !py-6 !px-2 sm:!px-8 flex flex-col justify-center items-center text-center">
          <div className="uppercase text-base sm:text-xl text-gray-700 !mb-2 font-semibold">About</div>
          <div className="text-gray-800 whitespace-pre-line text-sm sm:text-base max-w-2xl">{currentProject.description || "No description available."}</div>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetail;
