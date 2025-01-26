// app/api/nlp/translation/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  if (!process.env.OPENROUTER_API_KEY) {
    return NextResponse.json(
      { error: 'OpenRouter API key not configured' },
      { status: 500 }
    );
  }

  try {
    const { text, targetLang } = await request.json();
    
    if (!text || !targetLang) {
      return NextResponse.json(
        { error: 'Text and target language are required' },
        { status: 400 }
      );
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": process.env.NEXT_PUBLIC_URL || "http://localhost:3000",
          "X-Title": "Translation App",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-thinking-exp:free",
          messages: [
            {
              role: "user",
              content: `Translate the following text to ${targetLang}: "${text}"`
            }
          ]
        })
      }
    );

    if (response.status === 401) {
      return NextResponse.json(
        { error: 'Invalid API key. Please check your OpenRouter API key configuration.' },
        { status: 401 }
      );
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API responded with status ${response.status}`);
    }

    const result = await response.json();
    
    if (!result.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from translation service');
    }

    return NextResponse.json({
      translatedText: result.choices[0].message.content
    });

  } catch (error) {
    console.error('Translation error:', error.message);
    return NextResponse.json(
      { error: error.message || 'Translation failed' },
      { status: 500 }
    );
  }
}