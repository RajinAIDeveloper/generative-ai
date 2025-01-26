// app/vision/image-caption/page.js
'use client'

import { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Camera, Upload } from 'lucide-react';

export default function ImageCaptionPage() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [caption, setCaption] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
      setCaption('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return;

    setLoading(true);
    setError('');
    setCaption('');
    
    const formData = new FormData();
    formData.append('image', image);
    
    try {
      const response = await fetch('/api/vision/image-caption', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setCaption(data[0].generated_text);
    } catch (error) {
      console.error('Caption generation failed:', error);
      setError('Failed to generate caption. Please try again.');
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
        <div className="flex flex-col items-center text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 mt-30 pt-20">Image Captioning</h1>
          <p className="text-gray-400 max-w-2xl">
            Upload an image to generate a descriptive caption using the BLIP model.
          </p>
        </div>
        
        <Card className="bg-white/10 border-violet-500/20">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div 
                className="border-2 border-dashed border-violet-500/20 rounded-xl p-6
                         hover:border-violet-500/40 transition-colors duration-200
                         flex flex-col items-center justify-center cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
                
                {preview ? (
                  <div className="relative w-full flex justify-center">
                    <img 
                      src={preview} 
                      alt="Preview" 
                      className="max-h-96 rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-violet-500 mb-4" />
                    <p className="text-gray-400">Click or drag image here</p>
                  </div>
                )}
              </div>

              <Button 
                type="submit" 
                disabled={loading || !image}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white py-6 rounded-xl
                         flex items-center justify-center gap-2 transition-colors duration-200"
              >
                {loading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                ) : (
                  <><Camera className="w-5 h-5" /> Generate Caption</>
                )}
              </Button>
              
              {error && (
                <div className="text-red-500 text-sm bg-red-500/10 p-3 rounded-lg">{error}</div>
              )}

              {caption && (
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="text-violet-400 text-lg">{caption}</p>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}