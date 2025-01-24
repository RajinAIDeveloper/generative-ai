'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { professions } from '@/data/professions';
import { services } from '@/data/services';
import { Search, X } from 'lucide-react';
import { useParams } from 'next/navigation';

const ServiceCard = ({ title, description, icon: Icon, index, professionColor, link }) => {
    const [showComingSoon, setShowComingSoon] = useState(false);
  
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="relative p-6 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 hover:border-white/20 transition-colors"
      >
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/[0.03] to-transparent" />
        <div className={`relative w-12 h-12 ${professionColor} rounded-lg flex items-center justify-center mb-4`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400 mb-4">{description}</p>
        
        <button
          onClick={() => !link && setShowComingSoon(true)}
          className={`px-4 py-2 rounded-lg ${link ? 'bg-violet-600 hover:bg-violet-700' : 'bg-gray-600 hover:bg-gray-700'} text-white text-sm transition-colors`}
        >
          {link ? 'Try it' : 'Coming Soon'}
        </button>
  
        {showComingSoon && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-xl backdrop-blur-sm"
          >
            <div className="text-center text-white">
              <p className="font-bold mb-2">Coming Soon!</p>
              <button 
                onClick={() => setShowComingSoon(false)}
                className="text-sm underline opacity-80 hover:opacity-100"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    );
  };

export default function ProfessionPage() {
  const [servicesList, setServicesList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const params = useParams();
  const professionSlug = params?.profession;
  
  useEffect(() => {
    const professionTitle = Object.keys(services).find(
      key => key.toLowerCase().replace(/\s+/g, '-') === professionSlug
    );
    
    if (professionTitle && services[professionTitle]) {
      setServicesList(services[professionTitle]);
    }
  }, [professionSlug]);

  const filteredServices = servicesList.filter(service =>
    service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const profession = professions.find(
    p => p.route === `/services/${professionSlug}`
  );

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

      <div className="relative max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-12">
          <div className="flex items-center gap-6 pt-20">
            {profession && (
              <motion.div 
                className={`w-16 h-16 ${profession.color} rounded-2xl flex items-center justify-center
                         shadow-lg shadow-violet-500/20`}
                whileHover={{ scale: 1.05 }}
              >
                <profession.icon className="w-8 h-8 text-white" />
              </motion.div>
            )}
            <div>
              <h1 className="text-5xl font-bold text-white mb-2">
                {profession?.name} Services
              </h1>
              <p className="text-gray-400">
                {servicesList.length} Available Services
              </p>
            </div>
          </div>

          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search services..."
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

        <AnimatePresence mode="wait">
          <motion.div 
            key={searchQuery}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredServices.map((service, index) => (
              <ServiceCard
                key={service.title}
                {...service}
                index={index}
                professionColor={profession?.color}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredServices.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-white/80 text-lg">No services found matching "{searchQuery}"</p>
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
}