'use client'
import React from 'react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export const FloatingParticle = ({ delay }) => {
    const randomX = Math.random() * 100;
    const randomDuration = 15 + Math.random() * 10;
    
    return (
      <motion.div
        className="absolute h-1 w-1 rounded-full bg-white opacity-30"
        initial={{ 
          x: `${randomX}%`,
          y: '110%',
          scale: 0.5
        }}
        animate={{
          y: '-10%',
          scale: [0.5, 1, 0.5],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: randomDuration,
          repeat: Infinity,
          delay,
          ease: "linear"
        }}
      />
    );
  };

  
  export const BackgroundAnimation = () => {
    // Create deterministic positions based on index
    const particles = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: `${(i % 10) * 10}%`,
      delay: i * 0.02
    }));
  
    return (
      <div className="fixed inset-0 -z-10 h-full w-full bg-black">
        <div className="absolute inset-0 overflow-hidden">
          {particles.map(({ id, x, delay }) => (
            <motion.div
              key={id}
              initial={{ opacity: 0.1, scale: 0.5, y: '110%', x }}
              animate={{ 
                opacity: [0.1, 0.3, 0.1],
                y: ['110%', '-10%'],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                delay,
                ease: 'linear'
              }}
              className="absolute bottom-0 h-1 w-1 rounded-full bg-violet-500/50"
            />
          ))}
        </div>
      </div>
    );
  };