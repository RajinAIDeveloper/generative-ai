// app/api/audio/classification/route.js
import { NextResponse } from 'next/server';

const MAX_RETRIES = 3;
const INITIAL_TIMEOUT = 30000; // 30 seconds
const RETRY_DELAY = 5000; // 5 seconds

async function queryWithRetry(buffer, attempt = 1) {
  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/MIT/ast-finetuned-audioset-10-10-0.4593",
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: buffer,
        timeout: INITIAL_TIMEOUT,
      }
    );

    const responseText = await response.text();
    let error;
    
    try {
      const data = JSON.parse(responseText);
      if (data.error) {
        error = data.error;
      } else if (!response.ok) {
        error = `HTTP error ${response.status}`;
      } else {
        return data;
      }
    } catch {
      error = responseText || `HTTP error ${response.status}`;
    }

    if (error) {
      if (attempt < MAX_RETRIES && (
        error.includes("Service Unavailable") ||
        error.includes("Model too busy") ||
        error.includes("Internal Server Error")
      )) {
        console.log(`Attempt ${attempt} failed: ${error}. Retrying...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * attempt));
        return queryWithRetry(buffer, attempt + 1);
      }
      throw new Error(error);
    }

    return null;
  } catch (error) {
    if (attempt < MAX_RETRIES) {
      console.log(`Attempt ${attempt} failed: ${error.message}. Retrying...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * attempt));
      return queryWithRetry(buffer, attempt + 1);
    }
    throw error;
  }
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio');

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await audioFile.arrayBuffer());
    const result = await queryWithRetry(buffer);
    
    if (!result) {
      throw new Error('Failed to get classification result');
    }

    // Sort results by score in descending order
    const sortedResults = result.sort((a, b) => b.score - a.score);

    return NextResponse.json(sortedResults);
  } catch (error) {
    console.error('Error processing audio:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}