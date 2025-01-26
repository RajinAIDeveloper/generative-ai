'use client'

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Camera, Upload } from 'lucide-react';


export default function ObjectDetectionPage() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const originalImageRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
        originalImageRef.current = reader.result;
      };
      reader.readAsDataURL(file);
      setResult(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return;

    setLoading(true);
    setError('');
    setResult(null);
    
    const formData = new FormData();
    formData.append('image', image);
    
    try {
      const response = await fetch('/api/vision/object-detection', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      console.log('API Response:', data);
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (error) {
      console.error('Object detection failed:', error);
      setError('Failed to detect objects. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (result && preview) {
      const img = new Image();
      img.src = originalImageRef.current;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        
        ctx.drawImage(img, 0, 0);
        
        result.forEach(({ box, score, label }) => {
          // Get coordinates from box object
          const { xmin, ymin, xmax, ymax } = box;
          
          // Draw box
          ctx.strokeStyle = '#4c1d95';
          ctx.lineWidth = Math.max(2, img.width / 200);
          ctx.strokeRect(xmin, ymin, xmax - xmin, ymax - ymin);
          
          // Draw label
          const text = `${label} ${(score * 100).toFixed(1)}%`;
          ctx.font = 'bold 16px Arial';
          const textWidth = ctx.measureText(text).width;
          
          ctx.fillStyle = '#4c1d95';
          ctx.fillRect(xmin, ymin - 25, textWidth + 10, 25);
          
          ctx.fillStyle = 'white';
          ctx.fillText(text, xmin + 5, ymin - 7);
        });
        
        setPreview(canvas.toDataURL());
      };
    }
  }, [result]);

  return (
    <div className="min-h-screen bg-[#0A0118] relative">
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-900/20 via-[#0A0118] to-[#0A0118]" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 py-12">
        <div className="flex flex-col items-center text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 mt-30 pt-20">Object Detection</h1>
          <p className="text-gray-400 max-w-2xl">
            Upload an image to detect and locate objects using the DETR ResNet-50 model.
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
                  <><Camera className="w-5 h-5" /> Detect Objects</>
                )}
              </Button>
              
              {error && (
                <div className="text-red-500 text-sm bg-red-500/10 p-3 rounded-lg">{error}</div>
              )}

              {result && (
                <div className="space-y-4">
                  <h3 className="text-white text-lg">Detected Objects</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {result.map((detection, index) => (
                      <div 
                        key={index}
                        className="flex justify-between items-center p-3 bg-white/5 rounded-lg"
                      >
                        <span className="text-violet-400">
                          {detection.label}
                        </span>
                        <span className="text-gray-400">
                          {(detection.score * 100).toFixed(1)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}