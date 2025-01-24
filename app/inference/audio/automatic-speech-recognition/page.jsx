'use client'

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Upload, Wand2, X, Loader2, StopCircle } from 'lucide-react';

export default function AudioInferencePage() {
  const [file, setFile] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
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
        stream.getTracks().forEach(track => track.stop());
        
        // Start transcription immediately
        setIsLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('audio', audioFile);

        try {
          const response = await fetch('/api/audio/automatic-speech-recognition', {
            method: 'POST',
            body: formData,
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'Failed to process audio');
          }

          setTranscription(data.text || '');
        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
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
      setTranscription('');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('audio/')) {
      setFile(droppedFile);
      setError('');
      setTranscription('');
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
      const response = await fetch('/api/audio/automatic-speech-recognition', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process audio');
      }

      setTranscription(data.text || '');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

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
        <div className="flex items-center gap-6 pt-20 mb-12">
          <motion.div 
            className="w-16 h-16 bg-violet-600 rounded-2xl flex items-center justify-center
                     shadow-lg shadow-violet-500/20"
            whileHover={{ scale: 1.05 }}
          >
            <Mic className="w-8 h-8 text-white" />
          </motion.div>
          <div>
            <h1 className="text-5xl font-bold text-white mb-2">
              Audio Transcription
            </h1>
            <p className="text-gray-400">
              Convert speech to text using Whisper AI
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative p-6 rounded-xl bg-white/10 backdrop-blur-md border border-white/10"
          >
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/[0.03] to-transparent" />
            
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
                  Transcribe Audio
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
            
            <h3 className="relative text-xl font-bold text-white mb-4">Transcription Result</h3>
            
            <div className="relative min-h-[300px] p-4 rounded-lg bg-black/30 border border-white/10">
              {transcription ? (
                <>
                  <div className="flex gap-2 justify-end mb-4">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(transcription);
                        // Optional: Add toast notification here
                      }}
                      className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm transition-colors flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                      </svg>
                      Copy Text
                    </button>
                    <button
                      onClick={() => {
                        const blob = new Blob([transcription], { type: 'text/plain' });
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'transcription.txt';
                        a.click();
                        window.URL.revokeObjectURL(url);
                      }}
                      className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm transition-colors flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                      Download
                    </button>
                  </div>
                  <p className="text-gray-300 whitespace-pre-wrap">{transcription}</p>
                </>
              ) : (
                <p className="text-gray-500 italic">
                  Transcribed text will appear here...
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
