import { useEffect, useState, useMemo, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useNavigate } from 'react-router-dom';
import { collection, onSnapshot } from "firebase/firestore";
import { db } from '../firebase';
import '../App.css';
function Projects() {
  const [allProjects, setAllProjects] = useState([]);
  const [activeCategories, setActiveCategories] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const gridRef = useRef(null);
  const navigate = useNavigate();

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

  // Projects to show (pagination)
  const visibleProjects = useMemo(() => {
    return filteredProjects.slice(0, visibleCount);
  }, [filteredProjects, visibleCount]);

  // Filter handlers
  const   handleCategoryClick = (category) => {
    const newCategories = activeCategories.includes(category) 
      ? activeCategories.filter(cat => cat !== category)
      : [category];
    setActiveCategories(newCategories);
  };

  // GSAP animation for project cards
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (!gridRef.current) return;
    gsap.utils.toArray('.project-card').forEach((card, i) => {
      gsap.fromTo(card, {
        opacity: 0,
        y: 40,
      }, {
        opacity: 1,
        y: 0,
        duration: 0.3,
        delay: i * 0.06,
        scrollTrigger: {
          trigger: card,
          start: 'top 95%',
          toggleActions: 'play none none none',
        },
      });
    });
  }, [visibleProjects]);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (!gridRef.current) return;
      const { bottom } = gridRef.current.getBoundingClientRect();
      if (bottom <= window.innerHeight + 100 && visibleCount < filteredProjects.length) {
        setVisibleCount((prev) => Math.min(prev + 6, filteredProjects.length));
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visibleCount, filteredProjects.length]);

  // Reset visibleCount on filter change
  useEffect(() => {
    setVisibleCount(6);
  }, [filteredProjects]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Category Filter Bar - Top Left */}
      <div className="!p-6 !pt-8 !pb-2 flex flex-wrap gap-2 items-start justify-start !ml-7">
        {allCategories.map((category) => {
          const isActive = activeCategories.includes(category);
          return (
            <button
              key={category}
              className={`relative flex items-center !px-4 !py-2 cursor-pointer  tracking-widest text-2xl font-semibold transition-colors lowercase
                ${isActive ? 'text-black ' : 'text-gray-500 '}`}
              onClick={() => handleCategoryClick(category)}
              style={{ cursor: 'pointer' }}
            >
              <span>{category}</span>
            </button>
          );
        })}
      </div>

      {/* Projects Grid */}
      <div className="flex-1 w-full !px-6 !pb-8">
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-8 !p-10">
          {visibleProjects.map((item, idx) => (
            <div
              key={item.docId}
              className="project-card bg-white  shadow-md overflow-hidden cursor-pointer flex flex-col hover:shadow-xl transition-shadow relative group"
              onClick={() => navigate(`/project/${item.docId}`)}
              style={{ minHeight: '18rem' }}
            >
              {item.cimg ? (
                <div className="relative w-full h-136 group/imagecard">
                  <img 
                    src={item.cimg} 
                    alt={item.title || 'Project image'}
                    className="w-full h-136 object-cover transition duration-300"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  {/* Overlay for darkening on hover */}
                  <div className="absolute top-0 left-0 w-full h-full bg-black opacity-0 group-hover/imagecard:opacity-70 transition-opacity duration-1000 pointer-events-none"></div>
                  <div
                    className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center opacity-0 group-hover/imagecard:opacity-100 transition-opacity duration-300"
                  >
                    <div className="text-white text-3xl font-bold text-center px-2 tracking-[1em]" style={{textShadow:'0 12px 8px #0008'}}>{item.title}</div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-56 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Projects;