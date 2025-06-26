import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Ruler, Award } from 'lucide-react';

const ProjectCard = ({ project, isActive }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="relative w-full h-screen">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${project.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Lighter overlay for better text readability while keeping image bright */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Content overlay - bottom right aligned */}
      <div className="absolute bottom-30 left-0 right-30 px-8 z-10 w-full md:w-auto  items-center">
        <motion.div 
          className="text-white text-center md:text-right "
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 30 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {/* Title */}
          <motion.h2 
            className="text-4xl md:text-6xl font-light leading-tight tracking-wide mb-2 "
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {project.title}
          </motion.h2>

          {/* Subtitle - Dynamic category and type BELOW title */}
          <motion.div 
            className="text-xl font-light opacity-80 uppercase tracking-wider "
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <span>{project.category}</span>
            <span className="mx-2">|</span>
            <span>{project.type}</span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectCard;
