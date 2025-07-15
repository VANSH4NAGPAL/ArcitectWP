import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { navigationItems } from '../data/projects';

const Navigation = ({ textColor = 'white', noActiveState = false, horizontal = false }) => {
  const [activeItem, setActiveItem] = useState('');
  const location = useLocation();

  // Update active item based on current route - only if noActiveState is false
  useEffect(() => {
    if (noActiveState) {
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
  }, [location.pathname, noActiveState]);

  const handleNavClick = (item) => {
    if (!noActiveState) {
      setActiveItem(item.name);
    }

    if (item.href.startsWith('#')) {
      const element = document.querySelector(item.href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Dynamic color classes based on textColor prop - all text same color
  const getTextClasses = () => {
    if (textColor === 'black') {
      return 'text-black hover:text-black/80';
    }
    return 'text-white hover:text-white/80';
  };

  const getIndicatorClasses = () => {
    return textColor === 'black' ? 'bg-black' : 'bg-white';
  };

  const getHoverIndicatorClasses = () => {
    return textColor === 'black' ? 'bg-black' : 'bg-white';
  };

  return (
    <motion.nav 
      className={`z-50 ${horizontal ? 'w-auto' : ''}`}
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      <div className={
        horizontal
          ? "flex flex-row gap-1 md:gap-2 lg:gap-3 xl:gap-4 " // Use gap utilities for horizontal spacing
          : "flex flex-col space-y-6"
      }>
        {navigationItems.map((item, index) => {
          const isActive = !noActiveState && activeItem === item.name;

          const commonClasses = ` group block font-light tracking-widest uppercase transition-all duration-300 cursor-pointer relative !pl-6 focus:outline-none ${getTextClasses()} ${horizontal ? 'pl-0' : ''}`;

          const linkContent = (
            <span className="relative inline-block">
              {/* Active line - only show if not noActiveState */}
              {isActive && (
                <motion.div
                  className={`absolute left-0 right-0 -bottom-1 h-0.5 ${getIndicatorClasses()}`}
                  layoutId="activeIndicator"
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  style={{ transformOrigin: 'left' }}
                />
              )}

              {/* Hover line */}
              {!isActive && (
                <motion.div
                  className={`absolute left-0 right-0 -bottom-1 h-0.5 ${getHoverIndicatorClasses()} pointer-events-none`}
                  initial={{ scaleX: 0, opacity: 0 }}
                  whileHover={{ scaleX: 1, opacity: 1 }}
                  animate={{ scaleX: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  style={{ transformOrigin: 'left' }}
                />
              )}

              <span style={{ fontVariant: 'small-caps', fontSize: '1em', fontFamily: 'inherit' }}>
                {item.name.charAt(0).toUpperCase()}
                <span style={{ fontSize: '0.72em', fontVariant: 'normal' }}>
                  {item.name.slice(1).toLowerCase()}
                </span>
              </span>
            </span>
          );

          return (
            <motion.div
              key={item.name}
              className="relative"
              initial={{ opacity: 0, x: horizontal ? 0 : -20, y: horizontal ? -20 : 0 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
            >
              {item.href.startsWith('#') ? (
                <motion.a
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item);
                  }}
                  className={commonClasses}
                  style={{ fontSize: '22px', fontFamily: '"Nunito Sans", sans-serif' }}
                  whileTap={{ scale: 0.95 }}
                >
                  {linkContent}
                </motion.a>
              ) : (
                <motion.div
                  className={commonClasses}
                  style={{ fontSize: '22px', fontFamily: '"Nunito Sans", sans-serif' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={item.href}
                    onClick={() => !noActiveState && setActiveItem(item.name)}
                    className="block w-full h-full"
                  >
                    {linkContent}
                  </Link>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.nav>
  );
};

export default Navigation;
