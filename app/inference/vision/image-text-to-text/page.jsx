'use client'

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Upload } from 'lucide-react';

export default function VisionInferencePage() {
  const [imageBase64, setImageBase64] = useState('');
  const [prompt, setPrompt] = useState('Describe this image in one sentence.');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageBase64) return;
    
    setLoading(true);
    setError('');
    setResult('');
    
    try {
      const response = await fetch('/api/vision/image-text-to-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          imageBase64,
          prompt 
        }),
      });
      
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setResult(data.text);
    } catch (error) {
      console.error('Inference failed:', error);
      setError('Failed to process image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0118] relative">
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-900/20 via-[#0A0118] to-[#0A0118]" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-5xl font-bold text-white mb-8 mt-30 pt-20">Vision Inference</h1>
        
        <Card className="bg-white/10 border-violet-500/20">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-500/20 file:text-white hover:file:bg-violet-500/30"
              />

              {imageBase64 && (
                <img 
                  src={imageBase64}
                  alt="Selected image"
                  className="w-full max-h-96 object-contain rounded-xl"
                />
              )}

              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your prompt..."
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-violet-500/20 
                         text-white placeholder-gray-400 focus:outline-none focus:border-violet-500/50
                         focus:ring-2 focus:ring-violet-500/20"
                rows={3}
              />

              <Button 
                type="submit" 
                disabled={loading || !imageBase64}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white py-6 rounded-xl
                         flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                ) : (
                  <><Upload className="w-5 h-5" /> Process Image</>
                )}
              </Button>
              
              {error && (
                <div className="text-red-500 text-sm">{error}</div>
              )}

              {result && (
                <div className="p-4 bg-white/5 rounded-xl border border-violet-500/20 text-white">
                  {result}
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}