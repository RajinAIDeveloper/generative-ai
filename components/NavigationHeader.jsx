'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Eye, MessageSquare, Mic, Table2, Target, Network, ChevronDown, Menu, X } from 'lucide-react';
import { default as Linker } from 'next/link';
import { categories } from '@/data/categories';
import { professions } from '@/data/professions';

export const NavigationHeader = () => {
  const [isModelsOpen, setIsModelsOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => window.innerWidth >= 768 && setIsMobileMenuOpen(false);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMobileToggle = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <nav className="fixed w-full z-50 bg-black/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Linker href="/" className="flex items-center gap-2">
            <Brain className="w-8 h-8 text-violet-400" />
            <span className="font-semibold text-lg text-white">WING AI</span>
          </Linker>

          <div className="hidden md:flex items-center gap-8">
            {/* Models Dropdown */}
            <div className="relative group">
              <button
                className="flex items-center gap-2 text-white py-2 px-3 hover:bg-white/5 rounded-lg"
                onClick={() => setIsModelsOpen(!isModelsOpen)}
              >
                Models
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isModelsOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isModelsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute top-full left-0 mt-1 w-72 bg-black/95 rounded-lg border border-white/10"
                  >
                    {categories.map((category) => (
                      <Linker
                        key={category.title}
                        href={category.route}
                        className="flex items-center gap-3 p-4 text-gray-200 hover:bg-white/10 group"
                      >
                        <div className={`p-2 rounded-lg ${category.color} opacity-80 group-hover:opacity-100`}>
                          <category.icon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{category.title}</div>
                          <div className="text-xs text-gray-400">{category.description}</div>
                        </div>
                      </Linker>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Services Dropdown */}
            <div className="relative group">
              <button
                className="flex items-center gap-2 text-white py-2 px-3 hover:bg-white/5 rounded-lg"
                onClick={() => setIsServicesOpen(!isServicesOpen)}
              >
                Services
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isServicesOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isServicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute top-full left-0 mt-1 w-72 bg-black/95 rounded-lg border border-white/10"
                  >
                    {professions.map((profession) => (
                      <Linker
                        key={profession.name}
                        href={profession.route}
                        className="flex items-center gap-3 p-4 text-gray-200 hover:bg-white/10 group"
                      >
                        <div className={`p-2 rounded-lg ${profession.color} opacity-80 group-hover:opacity-100`}>
                          <profession.icon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{profession.name}</div>
                          <div className="text-xs text-gray-400">{profession.description}</div>
                        </div>
                      </Linker>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <Linker href="/platforms" className="text-white hover:opacity-80">SAAS Platforms</Linker>
            <button className="px-5 py-2 rounded-lg bg-violet-500 text-white font-medium hover:bg-violet-600">
              Get Started
            </button>
          </div>

          <button
            className="md:hidden p-2 text-white"
            onClick={handleMobileToggle}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4"
            >
              {/* Mobile Models */}
              <button
                className="flex items-center justify-between w-full p-4 text-white"
                onClick={() => setIsModelsOpen(!isModelsOpen)}
              >
                Models
                <ChevronDown className={`w-5 h-5 transition-transform ${isModelsOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isModelsOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-2 p-2"
                  >
                    {categories.map((category) => (
                      <Linker
                        key={category.title}
                        href={category.route}
                        className="flex items-center gap-3 p-3 rounded-lg text-gray-200 hover:bg-white/10"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <div className={`p-2 rounded-lg ${category.color} opacity-90`}>
                          <category.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-base font-medium text-white">{category.title}</div>
                          <div className="text-sm text-gray-400">{category.description}</div>
                        </div>
                      </Linker>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Mobile Services */}
              <button
                className="flex items-center justify-between w-full p-4 text-white"
                onClick={() => setIsServicesOpen(!isServicesOpen)}
              >
                Services
                <ChevronDown className={`w-5 h-5 transition-transform ${isServicesOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isServicesOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-2 p-2"
                  >
                    {professions.map((profession) => (
                      <Linker
                        key={profession.name}
                        href={profession.route}
                        className="flex items-center gap-3 p-3 rounded-lg text-gray-200 hover:bg-white/10"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <div className={`p-2 rounded-lg ${profession.color} opacity-90`}>
                          <profession.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-base font-medium text-white">{profession.name}</div>
                          <div className="text-sm text-gray-400">{profession.description}</div>
                        </div>
                      </Linker>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-4 p-4 border-t border-white/10 mt-4">
                <Linker
                  href="/platforms"
                  className="block w-full p-3 text-white hover:bg-white/5 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  SAAS Platforms
                </Linker>
                <button className="w-full p-3 bg-violet-500 text-white rounded-lg hover:bg-violet-600">
                  Get Started
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default NavigationHeader;