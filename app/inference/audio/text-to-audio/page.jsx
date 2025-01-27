// app/inference/audio/music-generation/page.jsx
'use client'

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Music, Wand2, Loader2, Play, Pause, Download } from 'lucide-react';

export default function MusicGenerationPage() {
  const [prompt, setPrompt] = useState('liquid drum and bass, atmospheric synths, airy sounds');
  const [audioUrl, setAudioUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const handleSubmit = async () => {
    console.log('Button clicked');  // Add this line to debug
    if (!prompt) {
      setError('Please enter a description for the music');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/audio/text-to-audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.blob();
      
      if (!response.ok) {
        throw new Error('Failed to generate music');
      }

      const url = URL.createObjectURL(data);
      setAudioUrl(url);
      setIsPlaying(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = 'generated-music.wav';
    a.click();
  };

  return (
    <div className="min-h-screen bg-[#0A0118] relative">
      <div className="fixed inset-0 z-0">
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
        <div className="flex items-center gap-6 pt-20 mb-12">
          <motion.div 
            className="w-16 h-16 bg-violet-600 rounded-2xl flex items-center justify-center
                     shadow-lg shadow-violet-500/20"
            whileHover={{ scale: 1.05 }}
          >
            <Music className="w-8 h-8 text-white" />
          </motion.div>
          <div>
            <h1 className="text-5xl font-bold text-white mb-2">
              Music Generation
            </h1>
            <p className="text-gray-400">
              Generate music using Facebook's MusicGen AI
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative p-6 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 z-10"
          >
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/[0.03] to-transparent" />
            
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-white mb-4">Describe Your Music</h3>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter a description of the music you want to generate (e.g., 'liquid drum and bass, atmospheric synths, airy sounds')"
                className="w-full h-32 p-4 rounded-lg bg-[#1A1625] border border-[#2A2635] text-white 
                         placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#7B3FE4]"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                handleSubmit();
              }}
              disabled={isLoading}
              className="mt-6 w-full px-6 py-3 rounded-lg bg-[#7C3AED] text-white font-medium
                     hover:bg-[#6D2AE8] active:bg-[#5D1AD8] transition-all flex items-center justify-center gap-2 relative z-10
                     disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  Generate Music
                </>
              )}
            </button>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 p-4 rounded-lg bg-red-500/20 border border-red-500/30 text-red-200"
              >
                {error}
              </motion.div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative p-6 rounded-xl bg-white/10 backdrop-blur-md border border-white/10"
          >
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/[0.03] to-transparent" />
            
            <h3 className="relative text-xl font-bold text-white mb-4">Generated Music</h3>
            
            <div className="relative min-h-[300px] p-4 rounded-lg bg-black/30 border border-white/10">
              {audioUrl ? (
                <div className="space-y-4">
                  <audio ref={audioRef} src={audioUrl} className="hidden" onEnded={() => setIsPlaying(false)} />
                  
                  <div className="flex justify-center">
                    <button
                      onClick={togglePlayback}
                      className="p-4 rounded-full bg-violet-600 hover:bg-violet-700 text-white transition-colors"
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6" />
                      ) : (
                        <Play className="w-6 h-6" />
                      )}
                    </button>
                  </div>

                  <div className="flex justify-center">
                    <button
                      onClick={handleDownload}
                      className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white 
                               text-sm transition-colors flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download Audio
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 italic text-center">
                  Generated audio will appear here...
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}