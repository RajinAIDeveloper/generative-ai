'use client'

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, TextCursor } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

export default function MaskPage() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setError('');
    setResults([]);
    
    try {
      const response = await fetch('/api/nlp/fill-mask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      
      const data = await response.json();
      
      if (data.error?.includes('loading')) {
        setError('Model is loading, please try again in a few seconds');
        return;
      }
      
      if (data.error) throw new Error(data.error);
      setResults(Array.isArray(data) ? data : [data]);
    } catch (error) {
      console.error('Mask filling failed:', error);
      setError('Failed to fill mask. Please try again.');
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
          <h1 className="text-5xl font-bold text-white mb-4 mt-30 pt-20">BERT Mask Filling</h1>
          <p className="text-gray-400 max-w-2xl">
            Fill in masked tokens using BERT. Use [MASK] to indicate the token to be filled.
          </p>
        </div>
        
        <Card className="bg-white/10 border-violet-500/20">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter text with [MASK] token..."
                  className="min-h-32 bg-white/5 border-violet-500/20 text-white"
                />

                {results.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-white text-lg">Predicted Tokens</h3>
                    <div className="grid grid-cols-1 gap-2">
                      {results.map((result, index) => (
                        <div 
                          key={index}
                          className="flex justify-between items-center p-3 bg-white/5 rounded-lg"
                        >
                          <span className="text-violet-400">
                            {result.token_str}
                          </span>
                          <div className="flex items-center gap-4">
                            <span className="text-gray-400">
                              {result.sequence}
                            </span>
                            <span className="text-gray-400">
                              {(result.score * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
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
                  <><TextCursor className="w-5 h-5" /> Fill Mask</>
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