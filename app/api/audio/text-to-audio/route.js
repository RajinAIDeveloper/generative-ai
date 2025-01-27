// app/api/audio/text-to-audio/route.js
import { NextResponse } from 'next/server';

export async function POST(req) {
  if (!process.env.HUGGINGFACE_API_KEY) {
    return NextResponse.json(
      { error: 'HUGGINGFACE_API_KEY is not configured' },
      { status: 500 }
    );
  }

  try {
    const { prompt } = await req.json();
    if (!prompt) {
      return NextResponse.json(
        { error: 'No prompt provided' },
        { status: 400 }
      );
    }

    const response = await fetch(
      "https://api-inference.huggingface.co/models/facebook/musicgen-small",
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to generate audio');
    }

    const audioBlob = await response.blob();
    
    return new Response(audioBlob, {
      headers: {
        'Content-Type': 'audio/wav',
      },
    });
  } catch (error) {
    console.error('Music generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}