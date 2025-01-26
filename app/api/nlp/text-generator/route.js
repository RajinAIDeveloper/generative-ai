// app/api/nlp/text-generator/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  if (!process.env.OPENROUTER_API_KEY) {
    return NextResponse.json(
      { error: 'OpenRouter API key not configured' },
      { status: 500 }
    );
  }

  try {
    const { prompt, context = [] } = await request.json();
    
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Format conversation history for the API
    const messages = [
      ...context.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      { role: "user", content: prompt }
    ];

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": process.env.NEXT_PUBLIC_URL || "http://localhost:3000",
          "X-Title": "AI Chat",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-thinking-exp:free",
          messages
        })
      }
    );

    if (response.status === 401) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      );
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API error: ${response.status}`);
    }

    const result = await response.json();
    
    if (!result.choices?.[0]?.message?.content) {
      console.error('Invalid API response:', result);
      throw new Error('Invalid response format from API');
    }

    return NextResponse.json({
      generatedText: result.choices[0].message.content
    });

  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Text generation failed' },
      { status: 500 }
    );
  }
}