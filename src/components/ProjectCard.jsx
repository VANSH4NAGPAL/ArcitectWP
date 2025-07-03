import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Ruler, Award } from 'lucide-react';

const ProjectCard = ({ project, isActive }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Use cimg for cover, fallback to mainImage if needed
  const imageUrl = project.cimg || project.mainImage || project.image;

  return (
    <div className="relative w-full max-w-xs mx-auto rounded-lg overflow-hidden shadow-lg bg-white">
      {/* Cover Image */}
      <img
        src={imageUrl}
        alt={project.title}
        className="w-full h-64 object-cover transition-opacity duration-500"
        style={{ opacity: imageLoaded ? 1 : 0.5, background: "#eee" }}
        onLoad={() => setImageLoaded(true)}
      />
      {/* Content overlay */}
      <div className="!p-4">
        <motion.h2
          className="text-xl font-semibold mb-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isActive ? 1 : 0.8, y: isActive ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {project.title}
        </motion.h2>
        <motion.div
          className="text-sm text-gray-600 uppercase tracking-wider"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isActive ? 1 : 0.8, y: isActive ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <span>{project.category}</span>
          <span className="mx-2">|</span>
          <span>{project.type}</span>
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectCard;
