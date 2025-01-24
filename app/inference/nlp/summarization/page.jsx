'use client'

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, FileText } from 'lucide-react';

export default function SummarizationPage() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult('');
    
    try {
      const response = await fetch('/api/nlp/summarization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setResult(Array.isArray(data) ? data[0].summary_text : data.summary_text);
    } catch (error) {
      console.error('Summarization failed:', error);
      setError('Failed to summarize text. Please try again.');
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
        <h1 className="text-5xl font-bold text-white mb-8 mt-30 pt-20">Text Summarization</h1>
        
        <Card className="bg-white/10 border-violet-500/20">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text to summarize..."
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-violet-500/20 
                         text-white placeholder-gray-400 focus:outline-none focus:border-violet-500/50
                         focus:ring-2 focus:ring-violet-500/20"
                rows={8}
              />

              <Button 
                type="submit" 
                disabled={loading || !text}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white py-6 rounded-xl
                         flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                ) : (
                  <><FileText className="w-5 h-5" /> Summarize Text</>
                )}
              </Button>
              
              {error && (
                <div className="text-red-500 text-sm">{error}</div>
              )}

              {result && (
                <div className="p-4 bg-white/5 rounded-xl border border-violet-500/20">
                  <h2 className="text-violet-400 text-sm mb-2">Summary:</h2>
                  <div className="text-white">{result}</div>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}