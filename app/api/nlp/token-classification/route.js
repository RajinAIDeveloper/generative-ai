import { NextResponse } from "next/server";

async function query(text) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/blaze999/Medical-NER",
    {
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ inputs: text }),
    }
  );
  
  const result = await response.json();
  
  if (result.error) {
    throw new Error(result.error);
  }
  
  return result;
}

export async function POST(req) {
  try {
    const { text } = await req.json();
    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }
    
    const result = await query(text);
    console.log('API Response:', result); // Debug log
    return NextResponse.json(result);
    
  } catch (error) {
    console.error("NER error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process text" },
      { status: 500 }
    );
  }
}