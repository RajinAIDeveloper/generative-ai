import { NextResponse } from "next/server";

async function query(data) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/facebook/bart-large-mnli",
    {
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    }
  );
  return response.json();
}

export async function POST(req) {
  try {
    const { text, labels } = await req.json();
    
    if (!text || !labels) {
      return NextResponse.json(
        { error: "Text and labels are required" },
        { status: 400 }
      );
    }

    const result = await query({
      inputs: text,
      parameters: { candidate_labels: labels }
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Classification error:", error);
    return NextResponse.json(
      { error: "Failed to classify text" },
      { status: 500 }
    );
  }
}