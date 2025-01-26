'use client'

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Type } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

export default function TextGenerationPage() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setError('');
    setResult('');
    
    try {
      const response = await fetch('/api/nlp/text-to-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setResult(data[0].generated_text);
    } catch (error) {
      console.error('Text generation failed:', error);
      setError('Failed to generate text. Please try again.');
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
          <h1 className="text-5xl font-bold text-white mb-4 mt-30 pt-20">Text Generation</h1>
          <p className="text-gray-400 max-w-2xl">
            Generate text continuations using the M2M100 model.
          </p>
        </div>
        
        <Card className="bg-white/10 border-violet-500/20">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter text prompt..."
                  className="min-h-32 bg-white/5 border-violet-500/20 text-white"
                />

                {result && (
                  <div className="bg-white/5 p-4 rounded-lg">
                    <p className="text-violet-400 text-lg">{result}</p>
                  </div>
                )}
              </div>

              <Button 
                type="submit" 
                disabled={loading || !text.trim()}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white py-6 rounded-xl
                         flex items-center justify-center gap-2 transition-colors duration-200"
              >
                {loading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                ) : (
                  <><Type className="w-5 h-5" /> Generate Text</>
                )}
              </Button>
              
              {error && (
                <div className="text-red-500 text-sm bg-red-500/10 p-3 rounded-lg">{error}</div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}