'use client'

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Tag } from 'lucide-react';

export default function TokenClassificationPage() {
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
      const response = await fetch('/api/nlp/token-classification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      
      const data = await response.json();
      console.log('Frontend received:', data); // Debug log

      if (data.error) {
        throw new Error(data.error);
      }

      setResults(data);
      
    } catch (error) {
      console.error('NER failed:', error);
      setError(error.message || 'Failed to process text');
    } finally {
      setLoading(false);
    }
  };

  const renderHighlightedText = () => {
    if (!results?.length || !text) return null;
  
    return (
      <div className="p-4">
        {results.map((entity, entityIndex) => (
          <span
            key={entityIndex}
            className={entity.entity_group ? "px-1 mx-1 rounded bg-violet-500/20 text-violet-200" : ""}
            title={entity.entity_group}
          >
            {text.slice(entity.start, entity.end)}
          </span>
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
        <h1 className="text-5xl font-bold text-white mb-8 mt-30 pt-20">Medical Named Entity Recognition</h1>
        
        <Card className="bg-white/10 border-violet-500/20">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter medical text to analyze..."
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
                  <><Tag className="w-5 h-5" /> Analyze Text</>
                )}
              </Button>
              
              {error && (
                <div className="text-red-500 text-sm mt-2">{error}</div>
              )}

              {results && results.length > 0 && (
                <div className="mt-6 p-4 bg-white/5 rounded-xl border border-violet-500/20 text-white">
                  {renderHighlightedText()}
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                  {Array.from(new Set(results.map(r => r.entity_group))).map((group) => (
  <div 
    key={group}
    className="px-3 py-1 bg-violet-500/20 rounded-lg border border-violet-500/40 text-violet-200 text-sm"
  >
    {group}
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