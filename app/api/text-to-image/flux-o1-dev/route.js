import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req) {
  try {
    const body = await req.json();
    const response = await fetch(
      "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const buffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(buffer);
    const base64String = Buffer.from(uint8Array).toString('base64');

    return NextResponse.json({
      image: `data:image/jpeg;base64,${base64String}`
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: "Failed to generate image" }, { status: 500 });
  }
}