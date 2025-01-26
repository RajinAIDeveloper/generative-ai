// app/api/nlp/pdf-qa/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const pdfFile = formData.get('pdf');
    const question = formData.get('question');

    if (!pdfFile || !question) {
      return NextResponse.json(
        { error: 'PDF file and question are required' },
        { status: 400 }
      );
    }

    // Convert PDF to base64
    const bytes = await pdfFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": process.env.NEXT_PUBLIC_URL || "http://localhost:3000",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-thinking-exp:free",
          messages: [
            {
              role: "user",
              content: `Here's a PDF document in base64 format: ${base64}\n\nPlease answer this question about the document: ${question}`
            }
          ]
        })
      }
    );

    const result = await response.json();
    
    if (result.error) {
      throw new Error(result.error.message || 'Failed to process PDF');
    }

    return NextResponse.json({
      answer: result.choices[0].message.content
    });

  } catch (error) {
    console.error('PDF QA error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process question' },
      { status: 500 }
    );
  }
}

