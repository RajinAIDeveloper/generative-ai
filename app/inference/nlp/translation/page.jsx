'use client'

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Languages, Copy, Download } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const languages = [
  "Afrikaans", "Albanian", "Amharic", "Arabic", "Armenian", "Azerbaijani",
  "Basque", "Belarusian", "Bengali", "Bosnian", "Bulgarian", "Catalan",
  "Chinese (Simplified)", "Chinese (Traditional)", "Croatian", "Czech",
  "Danish", "Dutch", "English", "Estonian", "Finnish", "French", "Galician",
  "Georgian", "German", "Greek", "Gujarati", "Hebrew", "Hindi", "Hungarian",
  "Icelandic", "Indonesian", "Italian", "Japanese", "Kannada", "Kazakh",
  "Korean", "Latvian", "Lithuanian", "Macedonian", "Malay", "Malayalam",
  "Marathi", "Mongolian", "Norwegian", "Persian", "Polish", "Portuguese",
  "Romanian", "Russian", "Serbian", "Slovak", "Slovenian", "Spanish",
  "Swahili", "Swedish", "Tamil", "Telugu", "Thai", "Turkish", "Ukrainian",
  "Urdu", "Vietnamese", "Welsh"
];

export default function TranslationPage() {
  const [sourceText, setSourceText] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handleTranslate = async (e) => {
    e.preventDefault();
    if (!sourceText.trim() || !targetLanguage) return;

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/nlp/translation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: sourceText, targetLang: targetLanguage }),
      });
      
      const data = await response.json();
      
      if (!response.ok || data.error) {
        throw new Error(data.error || 'Translation request failed');
      }
      setResult(data.translatedText);
    } catch (error) {
      console.error('Translation failed:', error);
      setError('Failed to translate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
  };

  const handleDownload = () => {
    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'translation.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#0A0118] relative">
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-900/20 via-[#0A0118] to-[#0A0118]" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 py-12">
        <div className="flex flex-col items-center text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 mt-30 pt-20">Language Translation</h1>
          <p className="text-gray-400 max-w-2xl">
            Translate text into multiple languages powered by AI
          </p>
        </div>
        
        <Card className="bg-white/10 border-violet-500/20">
          <CardContent className="p-6">
            <form onSubmit={handleTranslate} className="space-y-6">
              <div className="space-y-4">
                <Textarea
                  value={sourceText}
                  onChange={(e) => setSourceText(e.target.value)}
                  placeholder="Enter text to translate..."
                  className="min-h-32 bg-white/5 border-violet-500/20 text-white"
                />

                <Select 
                  value={targetLanguage} 
                  onValueChange={setTargetLanguage}
                >
                  <SelectTrigger className="bg-white/5 border-violet-500/20 text-white">
                    <SelectValue placeholder="Select target language" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-violet-500/20">
                    {languages.map((lang) => (
                      <SelectItem 
                        key={lang} 
                        value={lang}
                        className="text-white hover:bg-violet-500/20"
                      >
                        {lang}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {result && (
                  <div className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-lg text-white">
                      {result}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        onClick={handleCopy}
                        className="bg-violet-600 hover:bg-violet-700"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                      <Button
                        type="button"
                        onClick={handleDownload}
                        className="bg-violet-600 hover:bg-violet-700"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <Button 
                type="submit" 
                disabled={loading || !sourceText.trim() || !targetLanguage}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white py-6 rounded-xl
                         flex items-center justify-center gap-2 transition-colors duration-200"
              >
                {loading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Translating...</>
                ) : (
                  <><Languages className="w-5 h-5" /> Translate</>
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