'use client'

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { categories, models } from '@/data/model';
import ModelCard from '@/components/ui/ModelCard';
import { Search, X } from 'lucide-react';
import { useParams } from 'next/navigation';

const ModelsPage = () => {
  const [modelsList, setModelsList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const params = useParams();
  const categorySlug = params?.category;
  
  useEffect(() => {
    const categoryTitle = Object.keys(categories).find(
      key => categories[key].route === `/models/${categorySlug}`
    );
    
    if (categoryTitle && models[categoryTitle]) {
      setModelsList(models[categoryTitle]);
    }
  }, [categorySlug]);

  const filteredModels = modelsList.filter(model =>
    model.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categoryTitle = Object.keys(categories).find(
    key => categories[key].route === `/models/${categorySlug}`
  );
  const CategoryIcon = categoryTitle ? categories[categoryTitle].icon : null;
  const categoryColor = categoryTitle ? categories[categoryTitle].color : '';

  return (
    <div className="min-h-screen bg-[#0A0118] relative">
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-900/20 via-[#0A0118] to-[#0A0118]" />
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            backgroundImage: [
              'radial-gradient(circle 800px at 0% 0%, rgba(147, 51, 234, 0.15), transparent)',
              'radial-gradient(circle 800px at 100% 0%, rgba(168, 85, 247, 0.15), transparent)',
              'radial-gradient(circle 800px at 100% 100%, rgba(192, 132, 252, 0.15), transparent)',
              'radial-gradient(circle 800px at 0% 100%, rgba(147, 51, 234, 0.15), transparent)'
            ]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-12">
          <div className="flex items-center gap-6">
            {CategoryIcon && (
              <motion.div 
                className={`w-16 h-16 ${categoryColor} rounded-2xl flex items-center justify-center
                           shadow-lg shadow-violet-500/20`}
                whileHover={{ scale: 1.05 }}
              >
                <CategoryIcon className="w-8 h-8 text-white" />
              </motion.div>
            )}
            <div>
              <h1 className="text-5xl font-bold text-white mb-2">
                {categoryTitle}
              </h1>
              <p className="text-gray-400">
                {modelsList.length} Types of Model
              </p>
            </div>
          </div>

          <div className="relative w-full md:w-96">
            <div className="relative">
              <input
                type="text"
                placeholder="Search models..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-5 py-3 rounded-xl bg-white/10 border border-violet-500/20 
                         text-white placeholder-gray-400 focus:outline-none focus:border-violet-500/50
                         focus:ring-2 focus:ring-violet-500/20"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                )}
                <Search className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={searchQuery}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredModels.map((model, index) => (
              <ModelCard
                key={model.title}
                title={model.title}
                description={model.description}
                index={index}
                categoryColor={categoryColor}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredModels.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-white/80 text-lg">No models found matching "{searchQuery}"</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="mt-4 px-6 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700 
                       transition-colors duration-200"
            >
              Clear search
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ModelsPage;