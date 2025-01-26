// app/api/nlp/feature-extraction/route.js
import { HfInference } from "@huggingface/inference";

export async function POST(request) {
  try {
    const { text } = await request.json();
    
    if (!text) {
      return Response.json({ error: 'Text input is required' }, { status: 400 });
    }

    const client = new HfInference(process.env.HUGGINGFACE_API_KEY);
    
    const output = await client.featureExtraction({
      model: "intfloat/multilingual-e5-large",
      inputs: text,
      provider: "hf-inference"
    });

    return Response.json(output);
  } catch (error) {
    console.error('Feature extraction failed:', error);
    return Response.json(
      { error: 'Failed to process text. Please try again.' },
      { status: 500 }
    );
  }
}