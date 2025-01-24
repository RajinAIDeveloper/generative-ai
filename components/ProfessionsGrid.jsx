'use client'
import React from 'react';
import { motion } from 'framer-motion';
import { professions } from '@/data/professions';


const ProfessionCard = ({ name, icon: Icon, color, description, route, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    whileHover={{ 
      scale: 1.05,
      boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
    }}
    onClick={() => window.location.href = route}
    className="relative p-6 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 hover:border-white/20 transition-colors cursor-pointer"
  >
    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/[0.03] to-transparent" />
    <div className={`relative w-12 h-12 ${color} rounded-lg flex items-center justify-center mb-4`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div className="flex justify-between items-start mb-2">
      <h3 className="relative text-xl font-bold text-white">{name}</h3>
    </div>
    <p className="relative text-gray-400">{description}</p>
  </motion.div>
);

const ProfessionsGrid = () => (
  <section className="py-24">
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-16"
    >
      <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-cyan-400">
        AI Solutions by Profession
      </h2>
      <p className="text-gray-400 mt-4">
        Specialized AI services tailored to your professional needs
      </p>
    </motion.div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {professions.map((profession, index) => (
        <ProfessionCard key={profession.name} {...profession} index={index} />
      ))}
    </div>
  </section>
);

export default ProfessionsGrid;