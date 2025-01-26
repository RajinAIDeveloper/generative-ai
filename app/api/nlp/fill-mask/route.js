// app/api/mask/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { text } = await request.json();
    console.log('Received text:', text);
    
    if (!text) {
      console.log('No text provided');
      return NextResponse.json(
        { error: 'No text provided' },
        { status: 400 }
      );
    }

    const fetchWithRetry = async (retries = 5, delay = 1000) => {
      for (let i = 0; i < retries; i++) {
        console.log(`Attempt ${i + 1} of ${retries}`);
        
        const response = await fetch(
          "https://api-inference.huggingface.co/models/google-bert/bert-base-uncased",
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
        console.log('API Response:', result);
        
        if (result.error?.includes('loading')) {
          console.log('Model still loading, retrying...');
          if (i === retries - 1) {
            console.log('Max retries reached while model loading');
            throw new Error(result.error);
          }
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        
        console.log('Successful response:', result);
        return result;
      }
      throw new Error('Max retries reached');
    };

    const result = await fetchWithRetry();
    console.log('Final result:', result);
    return NextResponse.json(result);

  } catch (error) {
    console.error('Full error details:', error);
    return NextResponse.json(
      { error: 'Failed to fill mask' },
      { status: 500 }
    );
  }
}