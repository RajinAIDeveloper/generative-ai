'use client'

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Send, Copy } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

export default function ChatInterface() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);
    setError('');

    // Add user message immediately
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    
    try {
      const response = await fetch('/api/nlp/text-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userMessage,
          context: messages
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok || data.error) {
        throw new Error(data.error || 'Generation failed');
      }

      setMessages(prev => [...prev, { role: 'assistant', content: data.generatedText }]);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-[#0A0118] relative">
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-900/20 via-[#0A0118] to-[#0A0118]" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 py-12">
        <div className="flex flex-col items-center text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4">AI Chat</h1>
          <p className="text-gray-400 max-w-2xl">
            Have a conversation with AI that remembers context
          </p>
        </div>
        
        <Card className="bg-white/10 border-violet-500/20 min-h-[600px] flex flex-col">
          <CardContent className="p-6 flex-1 flex flex-col">
            <div className="flex-1 space-y-4 mb-4 overflow-y-auto">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-violet-600 text-white'
                        : 'bg-white/5 text-white'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCopy(message.content)}
                        className="opacity-0 hover:opacity-100 transition-opacity"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="bg-white/5 border-violet-500/20 text-white"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
                <Button 
                  type="submit" 
                  disabled={loading || !input.trim()}
                  className="bg-violet-600 hover:bg-violet-700 px-6"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </Button>
              </div>
              
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