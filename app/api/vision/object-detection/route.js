
export const runtime = 'edge';

async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  async function queryWithRetry(buffer, retries = 5, delay = 2000) {
    for (let i = 0; i < retries; i++) {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/facebook/detr-resnet-50",
        {
          headers: {
            Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          },
          method: "POST",
          body: buffer,
        }
      );
  
      const result = await response.json();
  
      if (result.error?.includes('loading')) {
        await wait(delay);
        continue;
      }
  
      return result;
    }
    throw new Error('Model still loading after maximum retries');
  }
  
  export async function POST(request) {
    try {
      const formData = await request.formData();
      const file = formData.get('image');
      
      if (!file) {
        return Response.json({ error: 'Image file is required' }, { status: 400 });
      }
  
      const buffer = Buffer.from(await file.arrayBuffer());
      const result = await queryWithRetry(buffer);
      
      return Response.json(result);
    } catch (error) {
      console.error('Object detection failed:', error);
      return Response.json(
        { error: error.message || 'Failed to process image. Please try again.' },
        { status: 500 }
      );
    }
  }