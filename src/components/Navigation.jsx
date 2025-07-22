import React, { useState, useEffect, useRef } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import { navigationItems } from '../data/projects';
import gsap from 'gsap';

const Navigation = ({ textColor = 'white', noActiveState = false, horizontal = false, small = false, forceBlackNoActive = false }) => {
  const [activeItem, setActiveItem] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const itemRefs = useRef({});
  const bgRef = useRef(null);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { // md breakpoint from Tailwind
        setMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Assign refs to all items
  const setItemRef = (el, name) => {
    if (el) itemRefs.current[name] = el;
  };

  // Update active item based on current route - only if noActiveState is false and not forceBlackNoActive
  useEffect(() => {
    if (noActiveState || forceBlackNoActive) {
      setActiveItem(''); // No active state
      return; 
    }
    const currentPath = location.pathname;
    if (currentPath === '/') {
      setActiveItem('home');
    } else if (currentPath === '/projects') {
      setActiveItem('projects');
    } else if (currentPath === '/about') {
      setActiveItem('about');
    } else if (currentPath === '/contact') {
      setActiveItem('contact');
    } else {
      setActiveItem(''); // For project detail pages or other routes
    }
  }, [location.pathname, noActiveState, forceBlackNoActive]);

  // Animate background to active item
  useEffect(() => {
    const bg = bgRef.current;

    const updateBgPosition = () => {
      if (!activeItem || noActiveState || forceBlackNoActive) {
        if (bg) {
          gsap.to(bg, { opacity: 0, duration: 0.3, pointerEvents: 'none' });
        }
        return;
      }
      const node = itemRefs.current[activeItem];
      if (node && bg) {
        const parentNode = node.parentNode?.parentNode;
        if (!parentNode) return;

        const rect = node.getBoundingClientRect();
        const parentRect = parentNode.getBoundingClientRect();

        gsap.to(bg, {
          top: rect.top - parentRect.top,
          left: rect.left - parentRect.left,
          width: rect.width,
          height: rect.height,
          borderRadius: 9999,
          opacity: 1,
          duration: 0.4,
          ease: 'power2.out',
          pointerEvents: 'none',
        });
      }
    };

    updateBgPosition();

    window.addEventListener('resize', updateBgPosition);

    return () => {
      window.removeEventListener('resize', updateBgPosition);
    };
  }, [activeItem, noActiveState, forceBlackNoActive, horizontal, small]);

  // Dynamic color classes based on textColor prop - all text same color
  const getTextClasses = () => {
    if (forceBlackNoActive || textColor === 'black') {
      return 'text-black hover:text-black/80';
    }
    return 'text-white hover:text-white/80';
  };

  return (
    <nav className={`z-50 bg-transparent relative justify-center items-center`} style={{ position: 'relative' }}>
      {/* Hamburger for mobile */}
      <div className="md:hidden flex items-center justify-end w-full">
        <button
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          className="!p-3 rounded-full bg-white/20 backdrop-blur-lg shadow-lg relative"
          style={{ zIndex: 10000, overflow: 'hidden', width: 48, height: 48, pointerEvents: 'auto' }}
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <FaBars
              size={28}
              color={textColor === 'black' ? 'black' : 'white'}
              style={{
                transition: 'transform 0.4s cubic-bezier(.68,-0.55,.27,1.55), opacity 0.3s',
                transform: mobileOpen ? 'rotate(90deg) scale(0.7)' : 'rotate(0deg) scale(1)',
                opacity: mobileOpen ? 0 : 1,
                position: 'absolute',
                pointerEvents: 'none',
              }}
            />
            <FaTimes
              size={32}
              color={textColor === 'black' ? 'black' : 'white'}
              style={{
                transition: 'transform 0.4s cubic-bezier(.68,-0.55,.27,1.55), opacity 0.3s',
                transform: mobileOpen ? 'rotate(0deg) scale(1)' : 'rotate(-90deg) scale(0.7)',
                opacity: mobileOpen ? 1 : 0,
                position: 'absolute',
                pointerEvents: 'none',
              }}
            />
          </span>
        </button>
      </div>
      {/* Desktop navigation - only visible on md and up */}
      <div
        className={
          `hidden md:flex ` + (
            horizontal
              ? `flex-row gap-1 md:gap-2 lg:gap-3 xl:gap-4 ${small ? 'gap-2' : ''}`
              : `flex-col space-y-6 ${small ? 'space-y-3' : ''}`
          )
        }
        style={{ position: 'relative', justifyContent: 'center', alignItems: 'center' }}
      >
        {/* Animated background */}
        <div
          ref={bgRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 0,
            background: 'black',
            borderRadius: '9999px',
            pointerEvents: 'none',
            opacity: 0,
            width: 0,
            height: 0,
            transition: 'opacity 0.3s',
          }}
        />
        {navigationItems.map((item) => {
          // ...existing code...
          const isActive = !noActiveState && !forceBlackNoActive && activeItem === item.name;
          const fontSize = small ? '16px' : '22px';
          const paddingLeft = horizontal ? '' : small ? '!pl-3' : '!pl-6';
          const commonClasses = ` group block font-light tracking-widest uppercase transition-all duration-300 cursor-pointer relative ${paddingLeft} focus:outline-none ${getTextClasses()} ${horizontal ? 'pl-0' : ''}`;
          const linkContent = (
            <span
              className="relative inline-block"
              style={{
                fontVariant: 'small-caps',
                fontSize: fontSize,
                position: 'relative',
                zIndex: 1,
                color: isActive ? 'white' : (forceBlackNoActive ? (textColor === 'white' ? 'white' : 'black') : undefined),
                lineHeight: '2.2em',
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                background: 'transparent',
                display: 'inline-block',
              }}
            >
              {item.name.charAt(0).toUpperCase()}
              <span style={{ fontSize: small ? '0.62em' : '0.72em', fontVariant: 'normal' }}>
                {item.name.slice(1).toLowerCase()}
              </span>
            </span>
          );
          return (
            <div key={item.name} className="relative" style={{ zIndex: 1 }}>
              {item.href.startsWith('#') ? (
                <a
                  ref={el => setItemRef(el, item.name)}
                  href={item.href}
                  onClick={e => {
                    e.preventDefault();
                    if (!forceBlackNoActive) setActiveItem(item.name);
                    const element = document.querySelector(item.href);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className={commonClasses}
                  style={{ fontSize }}
                >
                  {linkContent}
                </a>
              ) : (
                <div
                  ref={el => setItemRef(el, item.name)}
                  className={commonClasses}
                  style={{ fontSize }}
                >
                  <Link
                    to={item.href}
                    onClick={() => !noActiveState && !forceBlackNoActive && setActiveItem(item.name)}
                    className="block w-full h-full"
                  >
                    {linkContent}
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center w-screen h-screen"
          style={{
            background: 'rgba(255, 255, 255, 0.9)',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(10px) saturate(180%)',
            WebkitBackdropFilter: 'blur(10px) saturate(180%)',
            borderRadius: '0',
            border: '1px solid rgba(255, 255, 255, 0.7)',
            minHeight: '100vh',
            minWidth: '100vw',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
          }}
        >
          {/* ...removed extra cross button... */}
          <div className="flex flex-col items-center justify-center w-full h-full gap-10">
            {navigationItems.map((item) => {
              const isActive = !noActiveState && !forceBlackNoActive && activeItem === item.name;
              const fontSize = '26px';
              const linkContent = (
                <span
                  className="relative inline-block"
                  style={{
                    fontVariant: 'small-caps',
                    fontSize: fontSize,
                    position: 'relative',
                    zIndex: 1,
                    color: 'black', // Always black for mobile menu
                    lineHeight: '1.5em',
                    padding: '0.5rem 0', // Vertical padding for spacing
                    background: 'transparent',
                    display: 'inline-block',
                  }}
                >
                  {item.name.charAt(0).toUpperCase()}
                  <span style={{ fontSize: '0.72em', fontVariant: 'normal' }}>
                    {item.name.slice(1).toLowerCase()}
                  </span>
                </span>
              );

              const mobileLinkClassName = `group block font-light tracking-widest uppercase transition-all duration-300 cursor-pointer relative focus:outline-none text-black hover:text-black/80 text-center ${isActive ? 'border-b-2 border-black' : 'border-b-2 border-transparent'}`;

              return item.href.startsWith('#') ? (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={e => {
                    e.preventDefault();
                    setMobileOpen(false);
                    if (!forceBlackNoActive) setActiveItem(item.name);
                    const element = document.querySelector(item.href);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className={mobileLinkClassName}
                  style={{ fontSize }}
                >
                  {linkContent}
                </a>
              ) : (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => {
                    setMobileOpen(false);
                    !noActiveState && !forceBlackNoActive && setActiveItem(item.name);
                  }}
                  className={mobileLinkClassName}
                  style={{ fontSize }}
                >
                  {linkContent}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
