'use client'

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, GitCompare } from 'lucide-react';

export default function SentenceSimilarityPage() {
  const [sourceSentence, setSourceSentence] = useState('');
  const [comparisonSentences, setComparisonSentences] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sourceSentence.trim() || !comparisonSentences.trim()) return;

    setLoading(true);
    setError('');
    setResults(null);
    
    try {
      const sentences = comparisonSentences
        .split('\n')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const response = await fetch('/api/nlp/sentence-similarity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          sourceSentence, 
          comparisonSentences: sentences 
        }),
      });
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setResults(data);
      
    } catch (error) {
      setError(error.message || 'Failed to process sentences');
    } finally {
      setLoading(false);
    }
  };

  const renderResults = () => {
    if (!results) return null;

    const sentences = comparisonSentences
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    return (
      <div className="space-y-4">
        {results.map((similarity, index) => (
          <div 
            key={index}
            className="p-4 bg-white/5 rounded-xl border border-violet-500/20"
          >
            <div className="text-violet-200">{sentences[index]}</div>
            <div className="mt-2 text-2xl font-bold text-white">
              {(similarity * 100).toFixed(1)}% Similar
            </div>
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
          Sentence Similarity Analysis
        </h1>
        
        <Card className="bg-white/10 border-violet-500/20">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-white mb-2">Source Sentence</label>
                <textarea
                  value={sourceSentence}
                  onChange={(e) => setSourceSentence(e.target.value)}
                  placeholder="Enter the source sentence..."
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-violet-500/20 
                           text-white placeholder-gray-400 focus:outline-none focus:border-violet-500/50
                           focus:ring-2 focus:ring-violet-500/20"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-white mb-2">Comparison Sentences</label>
                <textarea
                  value={comparisonSentences}
                  onChange={(e) => setComparisonSentences(e.target.value)}
                  placeholder="Enter comparison sentences (one per line)..."
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-violet-500/20 
                           text-white placeholder-gray-400 focus:outline-none focus:border-violet-500/50
                           focus:ring-2 focus:ring-violet-500/20"
                  rows={4}
                />
              </div>

              <Button 
                type="submit" 
                disabled={loading || !sourceSentence.trim() || !comparisonSentences.trim()}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white py-6 rounded-xl
                         flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                ) : (
                  <><GitCompare className="w-5 h-5" /> Compare Sentences</>
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