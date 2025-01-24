'use client'
import React from 'react';
import { motion } from 'framer-motion';



const CategoryCard = ({ title, description, icon: Icon, color, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
      }}
      className="relative p-6 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 hover:border-white/20 transition-colors"
    >
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/[0.03] to-transparent" />
      <div className={`relative w-12 h-12 ${color} rounded-lg flex items-center justify-center mb-4`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="flex justify-between items-start mb-2">
        <h3 className="relative text-xl font-bold text-white">{title}</h3>
      </div>
      <p className="relative text-gray-400">{description}</p>
    </motion.div>
  );

  export default CategoryCard;