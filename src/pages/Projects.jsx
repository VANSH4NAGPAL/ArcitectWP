import React, { useEffect, useState, useRef } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const overlayRefs = useRef([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'projects'), (snapshot) => {
      const data = snapshot.docs.map((docSnap) => ({
        docId: docSnap.id,
        ...docSnap.data(),
      }));
      setProjects(data);
      const cats = Array.from(new Set(data.map(p => (p.category || '').trim()).filter(Boolean)));
      setCategories(['All', ...cats]);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const onWheel = (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        container.scrollTo({ left: container.scrollLeft + e.deltaY * 1.2, behavior: 'auto' });
      }
    };
    container.addEventListener('wheel', onWheel, { passive: false });

    let startX = 0;
    let scrollLeft = 0;
    const onTouchStart = (e) => {
      startX = e.touches[0].pageX;
      scrollLeft = container.scrollLeft;
    };
    const onTouchMove = (e) => {
      const x = e.touches[0].pageX;
      const walk = startX - x;
      container.scrollLeft = scrollLeft + walk;
    };
    container.addEventListener('touchstart', onTouchStart);
    container.addEventListener('touchmove', onTouchMove);

    return () => {
      container.removeEventListener('wheel', onWheel);
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
    };
  }, []);

  useEffect(() => {
    if (!scrollRef.current) return;
    ScrollTrigger.refresh();

    overlayRefs.current.forEach((overlay) => {
      if (!overlay) return;
      gsap.fromTo(
        overlay,
        { y: '0%' },
        {
          y: '100%',
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: overlay,
            scroller: scrollRef.current,
            horizontal: true,
            start: 'left bottom',
          },
        }
      );
    });
  }, [projects, activeCategory]);

  const filteredProjects = activeCategory === 'All' ? projects : projects.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row w-full !p-8 !m-0">
      <div className="md:w-1/3 w-full flex flex-col justify-end items-start !px-8 md:!pl-20 !pb-12 md:!pb-0 relative" style={{ minHeight: '500px' }}>
        <h1 className="text-6xl md:text-7xl font-light leading-tight text-black !mb-0" style={{ fontFamily: 'Omega Sans, sans-serif' }}>
          {categories.length > 0 && categories.map((cat, i) => (
            <React.Fragment key={cat}>
              {i > 0 && <br />}
              <span
                onClick={() => setActiveCategory(cat)}
                className={`cursor-pointer ${activeCategory === cat ? 'font-semibold' : ''}`}
              >
                {cat}.
              </span>
            </React.Fragment>
          ))}
        </h1>
      </div>

      <div className="md:w-2/3 w-full flex flex-col md:justify-end md:items-end overflow-x-auto" style={{ maxHeight: '100vh' }}>
        <div
          ref={scrollRef}
          className="flex flex-row items-end gap-0 md:gap-0 w-full h-full overflow-x-auto scrollbar-hide px-2 md:px-8"
          style={{ minHeight: 500, height: '100%', scrollBehavior: 'smooth' }}
        >
          {filteredProjects.map((project, idx) => (
            <div
              key={project.docId}
              className={`flex flex-col bg-white min-w-[437px] max-w-[447px] w-[437px] md:w-[400px] mx-0 border-l border-gray-200 first:border-l-0 last:border-r-0 h-full relative cursor-pointer group ${idx === 0 ? 'first-project-card-with-lines' : ''}`}
              onClick={() => navigate(`/project/${project.docId}`)}
            >
              {idx === 0 && (
                <>
                  <div className="first-card-line first-card-line-left"></div>
                  <div className="first-card-line first-card-line-right"></div>
                </>
              )}
              <div className="flex flex-col justify-end flex-grow">
                {project.cimg && (
                  <div className="relative w-[70%] h-110 self-center !mb-5 overflow-hidden">
                    <div
                      className="absolute top-0 left-0 w-full h-full bg-white z-10 reveal-overlay"
                      ref={(el) => (overlayRefs.current[idx] = el)}
                    />
                    <div className="overflow-hidden w-full h-full">
                      <img
                        src={project.cimg}
                        alt={project.title || 'Project image'}
                        className="w-full h-full object-cover project-image-hover"
                        style={{ background: '#eee', transition: 'transform 0.4s ease' }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                  </div>
                )}
                <div className="flex flex-col gap-1 !px-6">
                  <div className="flex items-center justify-between">
                    <div className="!px-10">
                      <div className="text-sm text-gray-600 tracking-widest uppercase font-extrabold">{project.category}</div>
                      <div className="text-2xl font-semibold text-black !mb-1 tracking-widest project-title-underline relative cursor-pointer inline-block">
                        <span className="relative z-10">{project.title}</span>
                        <span className="project-title-underline-bar"></span>
                      </div>
                      <div className="text-sm text-black tracking-widest font-extrabold">{project.year || ''}</div>
                    </div>
                    <div className="text-5xl text-black font-light project-arrow-hover">
                      <svg width="1em" height="1em" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 30 L30 10" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M22 10 H30 V18" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .project-arrow-hover { transition: transform 0.3s cubic-bezier(0.4,0,0.2,1); }
        .group:hover .project-arrow-hover { transform: scale(1.18); }

        .project-title-underline { display: inline-block; position: relative; }
        .project-title-underline .project-title-underline-bar {
          display: block;
          position: absolute;
          left: 0;
          right: 0;
          bottom: -2px;
          height: 2px;
          width: 0%;
          background: #000;
          transition: width 0.35s cubic-bezier(0.4,0,0.2,1);
          border-radius: 1px;
          content: '';
          z-index: 1;
        }
        .project-title-underline:hover .project-title-underline-bar {
          width: 100%;
        }

        .first-project-card-with-lines { position: relative; }
        .first-card-line {
          position: absolute;
          top: 0;
          height: 100vh;
          width: 1px;
          background: #e5e7eb;
          z-index: 10;
        }
        .first-card-line-left { left: 0; }
        .first-card-line-right { right: 0; }

        .group:hover .project-image-hover {
          transform: translateX(-16px);
        }

        .reveal-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: white;
          z-index: 5;
        }
      `}</style>
    </div>
  );
}
