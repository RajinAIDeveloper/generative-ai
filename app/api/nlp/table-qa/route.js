import { NextResponse } from 'next/server';

export async function POST(request) {
  if (!process.env.HUGGINGFACE_API_KEY) {
    return NextResponse.json(
      { error: 'Hugging Face API key not configured' },
      { status: 500 }
    );
  }

  try {
    const { table, question } = await request.json();
    
    if (!table || !question) {
      return NextResponse.json(
        { error: 'Table data and question are required' },
        { status: 400 }
      );
    }

    const parsedTable = typeof table === 'string' ? JSON.parse(table) : table;

    const response = await fetch(
      "https://api-inference.huggingface.co/models/google/tapas-large-finetuned-wtq",
      {
        headers: {
          "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: {
            query: question,
            table: parsedTable
          }
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const result = await response.json();
    return NextResponse.json({ answer: result.answer });

  } catch (error) {
    console.error('Table QA error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process question' },
      { status: 500 }
    );
  }
}