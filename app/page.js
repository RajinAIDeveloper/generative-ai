import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Eye, MessageSquare, Mic, Table2, Target, Network } from 'lucide-react';

const categories = [
  {
    title: "Multimodal AI",
    description: "Unified systems processing multiple data types simultaneously - text, images, and audio",
    icon: Brain,
    color: "bg-violet-600"
  },
  {
    title: "Computer Vision",
    description: "Advanced image and video processing for object detection, segmentation, and scene understanding",
    icon: Eye,
    color: "bg-cyan-600"
  },
  {
    title: "Natural Language Processing",
    description: "Text understanding, generation, and translation powered by transformers",
    icon: MessageSquare,
    color: "bg-emerald-600"
  },
  {
    title: "Audio Processing",
    description: "Speech recognition, synthesis, and sound analysis using deep learning",
    icon: Mic,
    color: "bg-rose-600"
  },
  {
    title: "Tabular Analysis",
    description: "Machine learning for structured data analysis and prediction",
    icon: Table2,
    color: "bg-amber-600"
  },
  {
    title: "Reinforcement Learning",
    description: "AI agents learning through interaction and reward optimization",
    icon: Target,
    color: "bg-fuchsia-600"
  },
  {
    title: "Graph Machine Learning",
    description: "Neural networks for analyzing relationships and network structures",
    icon: Network,
    color: "bg-blue-600"
  }
];

const FloatingParticle = ({ delay }) => (
  <motion.div
    className="absolute w-1 h-1 bg-white/20 rounded-full"
    initial={{ opacity: 0, scale: 0 }}
    animate={{ 
      opacity: [0, 1, 0],
      scale: [0, 1.5, 0],
      y: [-20, -40],
      x: [-10, 10]
    }}
    transition={{
      duration: 3,
      delay,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  />
);

const BackgroundAnimation = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#030014]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_50%,#1a0857,transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_400px_at_70%_20%,#1a085788,transparent)]" />
      <motion.div
        className="absolute inset-0"
        initial={{ backgroundPosition: '0% 0%' }}
        animate={{ 
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{ 
          duration: 20,
          ease: "linear",
          repeat: Infinity,
        }}
        style={{
          background: `
            radial-gradient(circle at 0% 0%, rgba(67, 24, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 100% 0%, rgba(124, 58, 237, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 100% 100%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 0% 100%, rgba(45, 212, 191, 0.1) 0%, transparent 50%)
          `,
          backgroundSize: '200% 200%',
        }}
      />
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <FloatingParticle key={i} delay={i * 0.1} />
        ))}
      </div>
      <div className="absolute h-full w-full bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:14px_24px]" />
    </div>
  );
};

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
    <h3 className="relative text-xl font-bold mb-2 text-white">{title}</h3>
    <p className="relative text-gray-400">{description}</p>
  </motion.div>
);

const LandingPage = () => {
  return (
    <div className="min-h-screen relative text-white">
      <BackgroundAnimation />
      
      <header className="py-24 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-violet-500 via-purple-500 to-cyan-500">
            WING Generative AI
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Pushing the boundaries of artificial intelligence into uncharted territories
          </p>
        </motion.div>
      </header>

      <main className="max-w-7xl mx-auto px-4 pb-24 relative">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {categories.map((category, index) => (
            <CategoryCard key={category.title} {...category} index={index} />
          ))}
        </motion.div>
      </main>
    </div>
  );
};

export default LandingPage;