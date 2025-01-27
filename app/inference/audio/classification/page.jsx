'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Music2, 
  Upload, 
  Wand2, 
  Loader2, 
  VolumeX,
  Volume2,
  Mic,
  StopCircle 
} from 'lucide-react';

const AudioClassificationPage = () => {
  const [file, setFile] = useState(null);
  const [classifications, setClassifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
        const audioFile = new File([audioBlob], 'recording.wav', { type: 'audio/wav' });
        setFile(audioFile);
        if (audioRef.current) {
          URL.revokeObjectURL(audioRef.current.src);
        }
        audioRef.current.src = URL.createObjectURL(audioFile);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setError('');
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      setError('Microphone access denied or not available');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
      setRecordingTime(0);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
      setClassifications([]);
      
      if (audioRef.current) {
        URL.revokeObjectURL(audioRef.current.src);
      }
      audioRef.current.src = URL.createObjectURL(selectedFile);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('audio/')) {
      setFile(droppedFile);
      setError('');
      setClassifications([]);
      
      if (audioRef.current) {
        URL.revokeObjectURL(audioRef.current.src);
      }
      audioRef.current.src = URL.createObjectURL(droppedFile);
    } else {
      setError('Please upload an audio file');
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setError('Please select an audio file or record audio');
      return;
    }

    setIsLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('audio', file);

    try {
      const response = await fetch('/api/audio/classification', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process audio');
      }

      setClassifications(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="min-h-screen bg-[#0A0118] relative">
      <div className="fixed inset-0 -z-10">
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

      <div className="relative max-w-7xl mx-auto px-4 py-12 z-10">
        <div className="flex items-center gap-6 pt-20 mb-12">
          <motion.div 
            className="w-16 h-16 bg-violet-600 rounded-2xl flex items-center justify-center
                     shadow-lg shadow-violet-500/20"
            whileHover={{ scale: 1.05 }}
          >
            <Music2 className="w-8 h-8 text-white" />
          </motion.div>
          <div>
            <h1 className="text-5xl font-bold text-white mb-2">
              Audio Classification
            </h1>
            <p className="text-gray-400">
              Analyze and classify audio content using AI
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative p-6 rounded-xl bg-white/10 backdrop-blur-md border border-white/10"
          >
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/[0.03] to-transparent -z-10" />
            
            {/* Recording section */}
            <div className="relative mb-8">
              <h3 className="text-xl font-bold text-white mb-4">Record Audio</h3>
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-colors ${
                    isRecording
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-violet-600 hover:bg-violet-700'
                  } text-white`}
                >
                  {isRecording ? (
                    <>
                      <StopCircle className="w-5 h-5" />
                      Stop Recording ({formatTime(recordingTime)})
                    </>
                  ) : (
                    <>
                      <Mic className="w-5 h-5" />
                      Start Recording
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Audio preview section */}
            <div className="relative mb-8">
              <h3 className="text-xl font-bold text-white mb-4">Audio Preview</h3>
              <div className="flex items-center justify-center gap-4">
                <audio ref={audioRef} onEnded={() => setIsPlaying(false)} className="hidden" />
                <button
                  onClick={togglePlay}
                  disabled={!file}
                  className="px-6 py-3 rounded-lg flex items-center gap-2 bg-violet-600 hover:bg-violet-700 
                           disabled:bg-violet-600/50 text-white transition-colors"
                >
                  {isPlaying ? (
                    <>
                      <VolumeX className="w-5 h-5" />
                      Stop Playback
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-5 h-5" />
                      Play Audio
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* File upload section */}
            <div className="relative">
              <h3 className="text-xl font-bold text-white mb-4">Or Upload Audio</h3>
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="p-8 border-2 border-dashed border-violet-500/30 rounded-lg text-center"
              >
                <Upload className="w-12 h-12 text-violet-500 mx-auto mb-4" />
                <p className="text-white mb-2">Drag and drop your audio file here</p>
                <p className="text-gray-400 text-sm mb-4">or</p>
                <label className="px-6 py-2 rounded-lg bg-violet-600 text-white cursor-pointer hover:bg-violet-700 transition-colors">
                  Choose File
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                {file && (
                  <div className="mt-4 text-gray-300">
                    Selected: {file.name}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading || !file || isRecording}
              className="mt-6 w-full px-6 py-3 rounded-lg bg-violet-600 text-white disabled:bg-violet-600/50 
                     hover:bg-violet-700 transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  Classify Audio
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
            
            <h3 className="relative text-xl font-bold text-white mb-4">Classification Results</h3>
            
            <div className="relative min-h-[300px] p-4 rounded-lg bg-black/30 border border-white/10">
              {classifications.length > 0 ? (
                <div className="space-y-4">
                  {classifications.map((result, index) => (
                    <div key={index} className="relative">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-gray-300">{result.label}</span>
                        <span className="text-gray-400">{(result.score * 100).toFixed(1)}%</span>
                      </div>
                      <div className="h-2 bg-black/50 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${result.score * 100}%` }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="h-full bg-violet-500 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">
                  Classification results will appear here...
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AudioClassificationPage;