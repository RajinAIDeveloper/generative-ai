'use client'

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Tag } from 'lucide-react';

export default function ZeroShotClassificationPage() {
  const [text, setText] = useState('');
  const [labels, setLabels] = useState('refund, legal, faq');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    
    try {
      const labelArray = labels.split(',').map(label => label.trim());
      
      const response = await fetch('/api/nlp/zero-shot-classification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text,
          labels: labelArray
        }),
      });
      
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (error) {
      console.error('Classification failed:', error);
      setError('Failed to classify text. Please try again.');
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
        <h1 className="text-5xl font-bold text-white mb-8 mt-30 pt-20">Zero-shot Classification</h1>
        
        <Card className="bg-white/10 border-violet-500/20">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text to classify..."
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-violet-500/20 
                         text-white placeholder-gray-400 focus:outline-none focus:border-violet-500/50
                         focus:ring-2 focus:ring-violet-500/20"
                rows={4}
              />

              <div>
                <label className="block text-white text-sm mb-2">Labels (comma-separated)</label>
                <input
                  type="text"
                  value={labels}
                  onChange={(e) => setLabels(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-violet-500/20 
                           text-white placeholder-gray-400 focus:outline-none focus:border-violet-500/50
                           focus:ring-2 focus:ring-violet-500/20"
                />
              </div>

              <Button 
                type="submit" 
                disabled={loading || !text || !labels}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white py-6 rounded-xl
                         flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                ) : (
                  <><Tag className="w-5 h-5" /> Classify Text</>
                )}
              </Button>
              
              {error && (
                <div className="text-red-500 text-sm">{error}</div>
              )}

              {result && (
                <div className="space-y-4">
                  {result.labels && result.labels.map((label, index) => (
                    <div 
                      key={label}
                      className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-violet-500/20"
                    >
                      <span className="text-white">{label}</span>
                      <span className="text-violet-400">
                        {(result.scores[index] * 100).toFixed(1)}%
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