'use client'

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Search } from 'lucide-react';

export default function QuestionAnsweringPage() {
  const [question, setQuestion] = useState('What is my name?');
  const [context, setContext] = useState('My name is Clara and I live in Berkeley.');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    
    try {
      const response = await fetch('/api/nlp/question-answering', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, context }),
      });
      
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (error) {
      console.error('Question answering failed:', error);
      setError('Failed to process question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(
        `Answer: ${result.answer}\nConfidence: ${Math.round(result.score * 100)}%\nLocation: Index ${result.start} to ${result.end}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0118] relative">
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-900/20 via-[#0A0118] to-[#0A0118]" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 py-12">
        <div className="flex flex-col items-center text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 mt-30 pt-20">Question Answering</h1>
          <p className="text-gray-400 max-w-2xl">
            Extract answers from context using the RoBERTa model.
            Provides precise answers to questions based on the given context.
          </p>
        </div>
        
        <Card className="bg-white/10 border-violet-500/20">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm text-gray-300">Context</label>
                <textarea
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="Enter the context text..."
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-violet-500/20 
                           text-white placeholder-gray-400 focus:outline-none focus:border-violet-500/50
                           focus:ring-2 focus:ring-violet-500/20 min-h-32"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-300">Question</label>
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Enter your question..."
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-violet-500/20 
                           text-white placeholder-gray-400 focus:outline-none focus:border-violet-500/50
                           focus:ring-2 focus:ring-violet-500/20"
                />
              </div>

              <Button 
                type="submit" 
                disabled={loading || !question || !context}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white py-6 rounded-xl
                         flex items-center justify-center gap-2 transition-colors duration-200"
              >
                {loading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                ) : (
                  <><Search className="w-5 h-5" /> Get Answer</>
                )}
              </Button>
              
              {error && (
                <div className="text-red-500 text-sm bg-red-500/10 p-3 rounded-lg">{error}</div>
              )}

              {result && (
                <div className="mt-6 space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-white text-lg">Answer</h3>
                    <Button
                      onClick={copyToClipboard}
                      variant="ghost"
                      className="text-violet-400 hover:text-violet-300"
                    >
                      {copied ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                  <div className="bg-white/5 rounded-xl border border-violet-500/20 p-4 space-y-4">
                    <div className="text-2xl text-violet-400 font-semibold">
                      {result.answer}
                    </div>
                    <div className="flex flex-col gap-2 text-sm text-gray-400">
                      <div>Confidence: {Math.round(result.score * 100)}%</div>
                      <div>Located at index: {result.start} to {result.end}</div>
                    </div>
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