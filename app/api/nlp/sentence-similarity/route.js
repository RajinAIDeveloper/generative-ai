import { NextResponse } from "next/server";

export const runtime = 'edge';

async function query(data) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2",
    {
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        inputs: {
          source_sentence: data.inputs.source_sentence,
          sentences: data.inputs.sentences
        }
      }),
    }
  );
  
  return response.json();
}

export async function POST(req) {
  try {
    const { sourceSentence, comparisonSentences } = await req.json();
    
    if (!sourceSentence || !comparisonSentences?.length) {
      return NextResponse.json(
        { error: "Source sentence and comparison sentences are required" }, 
        { status: 400 }
      );
    }
    
    const data = {
      inputs: {
        source_sentence: sourceSentence,
        sentences: comparisonSentences
      }
    };

    const result = await query(data);
    return NextResponse.json(result);
    
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to process sentences" },
      { status: 500 }
    );
  }
}