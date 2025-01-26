// app/api/nlp/question-answering/route.js
import { HfInference } from "@huggingface/inference";

export async function POST(request) {
  try {
    const { question, context } = await request.json();
    
    if (!question || !context) {
      return Response.json(
        { error: 'Both question and context are required' },
        { status: 400 }
      );
    }

    const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
    
    const result = await hf.questionAnswering({
      model: "deepset/roberta-base-squad2",
      inputs: {
        question,
        context
      },
      provider: "hf-inference",
    });

    return Response.json(result);
  } catch (error) {
    console.error('Question answering failed:', error);
    return Response.json(
      { error: 'Failed to process question answering request' },
      { status: 500 }
    );
  }
}