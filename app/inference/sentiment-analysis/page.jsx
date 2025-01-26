'use client'

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, MessageSquare } from 'lucide-react';

export default function SentimentAnalysisPage() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setError('');
    setResults(null);
    
    try {
      const response = await fetch('/api/nlp/sentiment-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze text');
      }

      const data = await response.json();
      setResults(Array.isArray(data) ? data : [data]);
      
    } catch (error) {
      console.error('Sentiment analysis failed:', error);
      setError(error.message || 'Failed to process text');
    } finally {
      setLoading(false);
    }
  };

  const renderResults = () => {
    if (!results?.length) return null;

    return (
      <div className="space-y-4">
        {results.map((result, index) => (
          <div 
            key={index}
            className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-violet-500/20"
          >
            <span className="text-violet-200">{result.label}</span>
            <span className="text-violet-200">
              {(result.score * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0A0118] relative">
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-900/20 via-[#0A0118] to-[#0A0118]" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-5xl font-bold text-white mb-8 mt-30 pt-20">
          Sentiment Analysis
        </h1>
        
        <Card className="bg-white/10 border-violet-500/20">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text to analyze sentiment..."
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-violet-500/20 
                         text-white placeholder-gray-400 focus:outline-none focus:border-violet-500/50
                         focus:ring-2 focus:ring-violet-500/20"
                rows={4}
              />

              <Button 
                type="submit" 
                disabled={loading || !text.trim()}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white py-6 rounded-xl
                         flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                ) : (
                  <><MessageSquare className="w-5 h-5" /> Analyze Sentiment</>
                )}
              </Button>
              
              {error && (
                <div className="text-red-500 text-sm mt-2">{error}</div>
              )}

              {results && (
                <div className="mt-6">
                  {renderResults()}
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}