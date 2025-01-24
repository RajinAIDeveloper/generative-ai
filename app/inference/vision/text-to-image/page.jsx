'use client'

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Image as ImageIcon, Download, Maximize2 } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

export default function TextToImagePage() {
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('flux');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setImage(null); // Clear previous image
    
    try {
      const endpoint = model === 'flux' 
        ? '/api/text-to-image/flux-o1-dev'
        : '/api/text-to-image/stable-diffusion';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputs: prompt }),
      });
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
  
      setImage(data.image);
    } catch (error) {
      console.error('Generation failed:', error);
      setError('Failed to generate image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!image) return;
    const a = document.createElement('a');
    a.href = image;
    a.download = `${prompt.slice(0, 30)}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-[#0A0118] relative">
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-900/20 via-[#0A0118] to-[#0A0118]" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-5xl font-bold text-white mb-8 mt-30 pt-20">Text to Image</h1>
        
        <Card className="bg-white/10 border-violet-500/20">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setModel('flux')}
                  className={`flex-1 p-4 rounded-xl border ${
                    model === 'flux' 
                      ? 'border-violet-500 bg-violet-500/20' 
                      : 'border-violet-500/20 hover:bg-white/5'
                  } text-white transition-colors`}
                >
                  FLUX.1
                </button>
                <button
                  type="button"
                  onClick={() => setModel('stable')}
                  className={`flex-1 p-4 rounded-xl border ${
                    model === 'stable' 
                      ? 'border-violet-500 bg-violet-500/20' 
                      : 'border-violet-500/20 hover:bg-white/5'
                  } text-white transition-colors`}
                >
                  Stable Diffusion XL
                </button>
              </div>

              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your image description..."
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-violet-500/20 
                         text-white placeholder-gray-400 focus:outline-none focus:border-violet-500/50
                         focus:ring-2 focus:ring-violet-500/20"
                rows={4}
              />

              <Button 
                type="submit" 
                disabled={loading || !prompt}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white py-6 rounded-xl
                         flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Generating...</>
                ) : (
                  <><ImageIcon className="w-5 h-5" /> Generate Image</>
                )}
              </Button>
              
              {error && (
                <div className="text-red-500 text-sm">{error}</div>
              )}
            </form>

            {image && (
              <div className="mt-8 space-y-4">
                <div className="relative group">
                  <img 
                    src={image} 
                    alt="Generated image"
                    className="w-full rounded-xl shadow-lg"
                  />
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="icon" variant="secondary" className="bg-black/50 hover:bg-black/70">
                          <Maximize2 className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-screen-lg">
                        <img src={image} alt="Generated image" className="w-full" />
                      </DialogContent>
                    </Dialog>
                    <Button 
                      size="icon" 
                      variant="secondary"
                      className="bg-black/50 hover:bg-black/70"
                      onClick={handleDownload}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}