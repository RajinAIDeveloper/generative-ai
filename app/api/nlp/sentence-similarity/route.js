import { NextResponse } from "next/server";

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function query(data, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/Snowflake/snowflake-arctic-embed-l-v2.0",
        {
          headers: {
            Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(data),
        }
      );
      
      const result = await response.json();
      
      if (result.error?.includes("loading")) {
        console.log("Model loading, retrying...");
        await new Promise(resolve => setTimeout(resolve, 2000));
        continue;
      }
      
      return result;
    } catch (error) {
      if (i === retries - 1) throw error;
      console.log(`Attempt ${i + 1} failed, retrying...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  throw new Error("Model failed to load after retries");
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

    console.log("Sending request:", data);
    const result = await query(data);
    console.log("Received response:", result);
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error("Similarity error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process sentences" },
      { status: 500 }
    );
  }
}