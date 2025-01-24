'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { default as Linker } from 'next/link';
import { categories } from '@/data/categories';
import CategoryCard from '@/components/CategoryCard';
import ProfessionsGrid from '@/components/ProfessionsGrid';

const LandingPage = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  return (
    <div>
      <header className="pt-32 pb-16 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <h1 className="text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-500 via-purple-500 to-cyan-500">
            WING Generative AI
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Pushing the boundaries of artificial intelligence into uncharted territories
          </p>
          <div className="flex justify-center gap-4 mt-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition-colors"
            >
              Get Started
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 rounded-lg border border-violet-600/50 text-violet-400 hover:border-violet-600 transition-colors"
            >
              View Documentation
            </motion.button>
          </div>
          
        </motion.div>
      </header>

      <main className="max-w-7xl mx-auto px-4 pb-24 relative">
        <p className="text-gray-400 p-2">
            8 Active Models
          </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <Linker 
              key={category.title} 
              href={category.route}
              className="block"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <CategoryCard 
                {...category} 
                index={index} 
                isHovered={hoveredIndex === index}
              />
            </Linker>
          ))}
          
        </div>
        <ProfessionsGrid/>
      </main>
    </div>
  );
};

export default LandingPage;