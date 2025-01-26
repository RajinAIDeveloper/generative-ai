'use client'

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Send, Upload } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function QAPage() {
  // Table QA state
  const [tableData, setTableData] = useState('');
  const [tableQuestion, setTableQuestion] = useState('');
  const [tableAnswer, setTableAnswer] = useState('');
  const [tableLoading, setTableLoading] = useState(false);
  const [tableError, setTableError] = useState('');

  // PDF QA state
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfQuestion, setPdfQuestion] = useState('');
  const [pdfAnswer, setPdfAnswer] = useState('');
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState('');

  const handleTableSubmit = async (e) => {
    e.preventDefault();
    setTableLoading(true);
    setTableError('');
    
    try {
      const response = await fetch('/api/nlp/table-qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          table: tableData,
          question: tableQuestion 
        }),
      });
      
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setTableAnswer(data.answer);
    } catch (error) {
      setTableError(error.message);
    } finally {
      setTableLoading(false);
    }
  };

  const handlePdfSubmit = async (e) => {
    e.preventDefault();
    if (!pdfFile) return;
    setPdfLoading(true);
    setPdfError('');

    const formData = new FormData();
    formData.append('pdf', pdfFile);
    formData.append('question', pdfQuestion);
    
    try {
      const response = await fetch('/api/nlp/pdf-qa', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setPdfAnswer(data.answer);
    } catch (error) {
      setPdfError(error.message);
    } finally {
      setPdfLoading(false);
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
            Ask questions about tables or PDF documents
          </p>
        </div>

        <Tabs defaultValue="table" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="table">Table QA</TabsTrigger>
            <TabsTrigger value="pdf">PDF QA</TabsTrigger>
          </TabsList>

          <TabsContent value="table">
            <Card className="bg-white/10 border-violet-500/20">
              <CardContent className="p-6">
                <form onSubmit={handleTableSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <Textarea
                      value={tableData}
                      onChange={(e) => setTableData(e.target.value)}
                      placeholder="Paste your table data in JSON format..."
                      className="min-h-32 bg-white/5 border-violet-500/20 text-white font-mono"
                    />
                    
                    <Textarea
                      value={tableQuestion}
                      onChange={(e) => setTableQuestion(e.target.value)}
                      placeholder="Ask a question about the table..."
                      className="bg-white/5 border-violet-500/20 text-white"
                    />

                    {tableAnswer && (
                      <div className="p-4 bg-white/5 rounded-lg text-white">
                        {tableAnswer}
                      </div>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    disabled={tableLoading || !tableData.trim() || !tableQuestion.trim()}
                    className="w-full bg-violet-600 hover:bg-violet-700 text-white py-6 rounded-xl
                             flex items-center justify-center gap-2"
                  >
                    {tableLoading ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                    ) : (
                      <><Send className="w-5 h-5" /> Ask Question</>
                    )}
                  </Button>
                  
                  {tableError && (
                    <div className="text-red-500 text-sm bg-red-500/10 p-3 rounded-lg">
                      {tableError}
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pdf">
            <Card className="bg-white/10 border-violet-500/20">
              <CardContent className="p-6">
                <form onSubmit={handlePdfSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-center w-full">
                      <label className="w-full flex flex-col items-center px-4 py-6 bg-white/5 text-white rounded-lg border-2 border-dashed border-violet-500/20 cursor-pointer hover:bg-white/10">
                        <Upload className="w-8 h-8 mb-2" />
                        <span className="text-sm">
                          {pdfFile ? pdfFile.name : "Upload PDF"}
                        </span>
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf"
                          onChange={(e) => setPdfFile(e.target.files[0])}
                        />
                      </label>
                    </div>
                    
                    <Textarea
                      value={pdfQuestion}
                      onChange={(e) => setPdfQuestion(e.target.value)}
                      placeholder="Ask a question about the PDF..."
                      className="bg-white/5 border-violet-500/20 text-white"
                    />

                    {pdfAnswer && (
                      <div className="p-4 bg-white/5 rounded-lg text-white">
                        {pdfAnswer}
                      </div>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    disabled={pdfLoading || !pdfFile || !pdfQuestion.trim()}
                    className="w-full bg-violet-600 hover:bg-violet-700 text-white py-6 rounded-xl
                             flex items-center justify-center gap-2"
                  >
                    {pdfLoading ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                    ) : (
                      <><Send className="w-5 h-5" /> Ask Question</>
                    )}
                  </Button>
                  
                  {pdfError && (
                    <div className="text-red-500 text-sm bg-red-500/10 p-3 rounded-lg">
                      {pdfError}
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}