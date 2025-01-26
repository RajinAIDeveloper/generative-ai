'use client'

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Scan } from 'lucide-react';

export default function ImageSegmentationPage() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [hoveredLabel, setHoveredLabel] = useState(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
      setError('');
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
      const response = await fetch('/api/vision/image-segmentation', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('API Response:', data);
      
      if (data.error) throw new Error(data.error);
      setResult(data);
      
      if (data.masks && data.labels) {
        console.log('Number of masks:', data.masks.length);
        console.log('Labels:', data.labels);
        data.masks.forEach((mask, i) => {
          console.log(`Mask ${i} (${data.labels[i]}) dimensions:`, mask.length);
        });
      }
    } catch (error) {
      console.error('Image segmentation failed:', error);
      setError('Failed to segment image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!result || !canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;

    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;
    
    console.log('Canvas dimensions:', canvas.width, canvas.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (hoveredLabel !== null && result.masks && result.labels) {
      const maskIndex = result.labels.indexOf(hoveredLabel);
      console.log('Rendering mask for:', hoveredLabel, 'index:', maskIndex);
      
      if (maskIndex !== -1 && result.masks[maskIndex]) {
        const mask = result.masks[maskIndex];
        console.log('Mask dimensions:', mask.length, 'Canvas pixels:', canvas.width * canvas.height);
        
        const imageData = ctx.createImageData(canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < mask.length; i++) {
          const pixelIndex = i * 4;
          if (mask[i]) {
            data[pixelIndex] = 255;     // R
            data[pixelIndex + 1] = 0;   // G
            data[pixelIndex + 2] = 0;   // B
            data[pixelIndex + 3] = 128; // A
          }
        }
        
        ctx.putImageData(imageData, 0, 0);
      }
    }
  }, [hoveredLabel, result]);

  return (
    <div className="min-h-screen bg-[#0A0118] relative">
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-900/20 via-[#0A0118] to-[#0A0118]" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 py-12">
        <div className="flex flex-col items-center text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 mt-30 pt-20">Image Segmentation</h1>
          <p className="text-gray-400 max-w-2xl">
            Segment different elements in images using advanced computer vision.
            Upload an image to detect and classify different objects and regions.
          </p>
        </div>

        <Card className="bg-white/10 border-violet-500/20">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm text-gray-300">Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-violet-500/20 
                           text-white focus:outline-none focus:border-violet-500/50
                           focus:ring-2 focus:ring-violet-500/20"
                />
              </div>

              {preview && (
                <div className="mt-4 relative">
                  <img
                    ref={imageRef}
                    src={preview}
                    alt="Preview"
                    className="max-h-96 mx-auto rounded-lg"
                  />
                  <canvas
                    ref={canvasRef}
                    className="absolute top-0 left-0 w-full h-full pointer-events-none"
                  />
                </div>
              )}

              <Button 
                type="submit" 
                disabled={loading || !image}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white py-6 rounded-xl
                         flex items-center justify-center gap-2 transition-colors duration-200"
              >
                {loading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                ) : (
                  <><Scan className="w-5 h-5" /> Segment Image</>
                )}
              </Button>

              {error && (
                <div className="text-red-500 text-sm bg-red-500/10 p-3 rounded-lg">{error}</div>
              )}

              {result && result.labels && (
                <div className="mt-6 space-y-4">
                  <h3 className="text-white text-lg">Detected Objects</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.labels.map((label, index) => (
                      <div
                        key={index}
                        onMouseEnter={() => setHoveredLabel(label)}
                        onMouseLeave={() => setHoveredLabel(null)}
                        className="px-3 py-1 bg-violet-500/20 rounded-full text-violet-200 
                                 hover:bg-violet-500/40 cursor-pointer transition-colors"
                      >
                        {label}
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