'use client'

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Upload } from 'lucide-react';

export default function ImageClassificationPage() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResults([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return;
    
    setLoading(true);
    setError('');
    setResults([]);
    
    try {
      const formData = new FormData();
      formData.append('image', image);

      const response = await fetch('/api/vision/image-classification', {
        method: 'POST',
        body: image
      });
      
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setResults(data);
    } catch (error) {
      console.error('Classification failed:', error);
      setError('Failed to classify image. Please try again.');
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
        <h1 className="text-5xl font-bold text-white mb-8 mt-30 pt-20">Image Classification</h1>
        
        <Card className="bg-white/10 border-violet-500/20">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-white file:mr-4 file:py-2 file:px-4 
                         file:rounded-full file:border-0 file:text-sm file:font-semibold
                         file:bg-violet-500/20 file:text-white hover:file:bg-violet-500/30"
              />

              {preview && (
                <img 
                  src={preview}
                  alt="Selected image"
                  className="w-full max-h-96 object-contain rounded-xl"
                />
              )}

              <Button 
                type="submit" 
                disabled={loading || !image}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white py-6 rounded-xl
                         flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                ) : (
                  <><Upload className="w-5 h-5" /> Classify Image</>
                )}
              </Button>
              
              {error && (
                <div className="text-red-500 text-sm">{error}</div>
              )}

              {results.length > 0 && (
                <div className="space-y-2">
                  {results.map((result, index) => (
                    <div 
                      key={index}
                      className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-violet-500/20"
                    >
                      <span className="text-white">{result.label}</span>
                      <span className="text-violet-400">
                        {(result.score * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}