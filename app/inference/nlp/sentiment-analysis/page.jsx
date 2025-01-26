'use client'

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, MessageSquare } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

export default function SentimentPage() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);
    
    try {
      const response = await fetch('/api/nlp/sentiment-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setResult(data[0]);
    } catch (error) {
      console.error('Sentiment analysis failed:', error);
      setError('Failed to analyze sentiment. Please try again.');
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
          <h1 className="text-5xl font-bold text-white mb-4 mt-30 pt-20">Financial Sentiment Analysis</h1>
          <p className="text-gray-400 max-w-2xl">
            Analyze the sentiment of financial text using the FinBERT model.
          </p>
        </div>
        
        <Card className="bg-white/10 border-violet-500/20">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter financial text to analyze..."
                className="min-h-32 bg-white/5 border-violet-500/20 text-white"
              />

              <Button 
                type="submit" 
                disabled={loading || !text.trim()}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white py-6 rounded-xl
                         flex items-center justify-center gap-2 transition-colors duration-200"
              >
                {loading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                ) : (
                  <><MessageSquare className="w-5 h-5" /> Analyze Sentiment</>
                )}
              </Button>
              
              {error && (
                <div className="text-red-500 text-sm bg-red-500/10 p-3 rounded-lg">{error}</div>
              )}

              {result && (
                <div className="space-y-4">
                  <h3 className="text-white text-lg">Analysis Results</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {result.map(({ label, score }, index) => (
                      <div 
                        key={index}
                        className="flex justify-between items-center p-3 bg-white/5 rounded-lg"
                      >
                        <span className="text-violet-400 capitalize">
                          {label}
                        </span>
                        <span className="text-gray-400">
                          {(score * 100).toFixed(1)}%
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