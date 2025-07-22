

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';


function ProjectDetail() {
  const { id } = useParams();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [galleryImages, setGalleryImages] = useState([]);

  useEffect(() => {
    // Listen for project data
    const unsub = onSnapshot(collection(db, 'projects'), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ docId: doc.id, ...doc.data() }));
      // Find project by id param
      const project = data.find((p) => p.docId === id || p.id === Number(id));
      if (project) {
        const images = [];
        if (Array.isArray(project.interiorImages)) images.push(...project.interiorImages);
        if (Array.isArray(project.exteriorImages)) images.push(...project.exteriorImages);
        setGalleryImages(images);
        setCurrentIdx(0);
      }
    });
    return () => unsub();
  }, [id]);

  // Preload images
  useEffect(() => {
    galleryImages.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, [galleryImages]);

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };
  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % galleryImages.length);
  };

  // Get project details from Firestore snapshot
  const [projectDetails, setProjectDetails] = useState(null);
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'projects'), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ docId: doc.id, ...doc.data() }));
      const project = data.find((p) => p.docId === id || p.id === Number(id));
      if (project) {
        setProjectDetails(project);
      }
    });
    return () => unsub();
  }, [id]);

  if (galleryImages.length === 0) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No images found.</div>;
  }

  // Calculate next image index
  const nextIdx = (currentIdx + 1) % galleryImages.length;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '112px' }}>
      <div style={{ position: 'relative', width: '100vw', height: '78vh', maxHeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <motion.div
          className="gallery-slider"
          style={{ display: 'flex', width: `calc(${galleryImages.length + 1} * 95%)`, height: '100%' }}
          animate={{ x: `-${currentIdx * 100}%` }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          {/* ...existing code for images... */}
          {galleryImages.map((src, idx) => (
            <div
              key={idx}
              style={{
                flex: '0 0 95%',
                height: '100%',
                position: 'relative',
                marginRight: 8,
                opacity: idx === currentIdx ? 1 : 1,
                zIndex: idx === currentIdx ? 2 : 1,
                transition: 'opacity 0.3s',
              }}
            >
              <img
                src={src}
                alt={`Gallery ${idx + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 0, boxShadow: idx === currentIdx ? '0 4px 24px rgba(0,0,0,0.10)' : '0 2px 8px rgba(0,0,0,0.08)' }}
              />
            </div>
          ))}
          {/* Add a duplicate of the first image for wrap preview */}
          {galleryImages.length > 0 && (
            <div
              key="wrap-preview"
              style={{
                flex: '0 0 95%',
                height: '100%',
                position: 'relative',
                marginRight: 0,
                opacity: 1,
                zIndex: 1,
                transition: 'opacity 0.3s',
              }}
            >
              <img
                src={galleryImages[0]}
                alt="Gallery 1 preview"
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
              />
            </div>
          )}
        </motion.div>
      </div>
      {/* ...existing code for navigation buttons and index... */}
      <div style={{ position: 'relative', width: '100vw', height: 0 }}>
        <button
          onClick={handlePrev}
          style={{
            position: 'absolute',
            right: 96,
            bottom: -50,
            background: 'transparent',
            color: 'white',
            border: 'none',
            fontSize: 32,
            cursor: 'pointer',
            zIndex: 3,
            borderRadius: 8,
            padding: '8px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Previous"
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 8L12 16L20 24" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button
          onClick={handleNext}
          style={{
            position: 'absolute',
            right: 34,
            bottom: -50,
            background: 'transparent',
            color: 'white',
            border: 'none',
            fontSize: 32,
            cursor: 'pointer',
            zIndex: 3,
            borderRadius: 8,
            padding: '8px 54px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Next"
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 8L20 16L12 24" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      {/* Project details section below image */}
{projectDetails && (
  <div className="w-screen mx-auto  !px-6 flex flex-row gap-8 bg-black">
    {/* Left: Project Data (50%) */}
    <div className="flex-1 min-w-[60px] max-w-[30%] text-left !p-20">
      <h2 className="text-3xl font-extrabold !mb-2 text-white tracking-widest">{projectDetails.title || 'Untitled Project'}</h2>
      <div className="text-lg text-white font-extrabold !mb-4 tracking-widest">{projectDetails.category || projectDetails.customCategory || projectDetails.projectType || ''}</div>
      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
        <div className="text-[1.3rem] font-extrabold text-white">Location</div>
        <div className="text-[1.2rem] font-semibold text-gray-500">{projectDetails.location || '-'}</div>
        {/* <div className="text-[1.3rem] font-extrabold text-white">Client</div>
        <div className="text-[1.2rem] font-semibold text-gray-500">{projectDetails.client || '-'}</div>
        <div className="text-[1.3rem] font-extrabold text-white">Area</div>
        <div className="text-[1.2rem] font-semibold text-gray-500">{projectDetails.area || projectDetails.size || '-'}</div> */}
        <div className="text-[1.3rem] font-extrabold text-white">Year</div>
        <div className="text-[1.2rem] font-semibold text-gray-500">{projectDetails.year || '-'}</div>
        <div className="text-[1.3rem] font-extrabold text-white">Type</div>
        <div className="text-[1.2rem] font-semibold text-gray-500">{projectDetails.type || projectDetails.useType || '-'}</div>
        {/* <div className="text-[1.3rem] font-extrabold text-white">Design Team</div>
        <div className="text-[1.2rem] font-semibold text-gray-500">{projectDetails.designTeam || '-'}</div>
        <div className="text-[1.3rem] font-extrabold text-white">Services Provided</div>
        <div className="text-[1.2rem] font-semibold text-gray-500">{projectDetails.servicesProvided || '-'}</div> */}
        
      </div>
      {/* Project Dates */}
      {projectDetails.projectDates && (
        <div className="!mt-4 grid grid-cols-2 gap-x-8 gap-y-2">
          <div className="text-[1.3rem] font-extrabold text-white">Design</div>
          <div className="text-[1.2rem] font-semibold text-gray-500">{projectDetails.projectDates.design || '-'}</div>
          <div className="text-[1.3rem] font-extrabold text-white">Fabrication</div>
          <div className="text-[1.2rem] font-semibold text-gray-500">{projectDetails.projectDates.fabrication || '-'}</div>
          <div className="text-[1.3rem] font-extrabold text-white">Opening</div>
          <div className="text-[1.2rem] font-semibold text-gray-500">{projectDetails.projectDates.opening || '-'}</div>
        </div>
      )}
    </div>
    {/* Right: Description (50%) */}
    <div className="flex-1 max-w-[50%] text-left flex flex-col justify-start !p-20">
      <div className="text-[1.3rem] text-white font-extrabold !mb-2">Description</div>
      <div className="text-[1.3rem] text-white font-semibold tracking-widest">{projectDetails.description || '-'}</div>
    </div>
  </div>
)}
      
      
    </div>
  );
}

export default ProjectDetail;