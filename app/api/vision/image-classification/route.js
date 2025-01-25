import { NextResponse } from "next/server";

export const runtime = 'edge';

async function query(imageData) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/facebook/detr-resnet-50",
    {
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: imageData,
    }
  );
  return response.json();
}

export async function POST(req) {
  try {
    const data = await req.arrayBuffer();
    if (!data) {
      return NextResponse.json({ error: "Image data required" }, { status: 400 });
    }

    const result = await query(data);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Classification error:", error);
    return NextResponse.json(
      { error: "Failed to classify image" },
      { status: 500 }
    );
  }
}