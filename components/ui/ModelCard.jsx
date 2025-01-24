'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const ModelCard = ({ title, description, index, categoryColor }) => {
  const [showAlert, setShowAlert] = useState(false);
  
  const getModelLink = () => {
    const links = {
      'Text-to-Image': '/inference/vision/text-to-image',
      'Automatic Speech Recognition': '/inference/audio/automatic-speech-recognition',
      'Image-Text-to-Text': '/inference/vision/image-text-to-text',
      'Zero-Shot Classification': '/inference/nlp/zero-shot-classification',
      'Summarization': '/inference/nlp/summarization',
      'Image Classification': '/inference/vision/image-classification',
      'Token Classification': '/inference/nlp/token-classification',
      'Sentence Similarity': '/inference/nlp/sentence-similarity',
      // 'Text-to-Speech': '/inference/audio/text-to-speech',
      // 'Speech-to-Text': '/inference/audio/speech-to-text',
      // 'Image Generation': '/inference/vision/image-generation',
      // 'Text Generation': '/inference/text/generation'
    };
    return links[title] || null;
  };

  const handleClick = () => {
    if (!getModelLink()) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  return (
    <div className="relative">
      {showAlert && (
        <div className="absolute -top-16 left-0 right-0 z-50">
          <Alert variant="destructive" className="bg-red-500/10 border-red-500/50 text-red-200">
            <AlertTitle>Under Development</AlertTitle>
            <AlertDescription>This feature is coming soon!</AlertDescription>
          </Alert>
        </div>
      )}
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="group relative p-6 rounded-xl bg-white/[0.07] backdrop-blur-sm border border-violet-500/20 
                  hover:border-violet-500/40 transition-all duration-300"
        onClick={handleClick}
      >
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500/10 via-transparent to-transparent 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative">
          <h3 className="text-xl font-semibold text-white mb-3">
            {title}
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            {description}
          </p>
          
          <div className="mt-6 flex justify-end">
            {getModelLink() ? (
              <Link href={getModelLink()}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-violet-600/20 text-violet-200
                            hover:bg-violet-600/30 transition-colors duration-200 group/button"
                >
                  Try it <ArrowRight className="w-4 h-4 transform group-hover/button:translate-x-0.5 transition-transform" />
                </motion.button>
              </Link>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gray-600/20 text-gray-400
                          cursor-not-allowed transition-colors duration-200"
              >
                Coming Soon <ArrowRight className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ModelCard;