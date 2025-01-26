export const runtime = 'edge';

async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function queryWithRetry(buffer, retries = 5, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/mattmdjaga/segformer_b2_clothes",
        {
          headers: {
            Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          },
          method: "POST",
          body: buffer,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.error?.includes('loading')) {
        await wait(delay);
        continue;
      }

      return {
        labels: result.map(item => item.label),
        masks: result.map(item => item.mask),
        scores: result.map(item => item.score)
      };
    } catch (error) {
      if (i === retries - 1) throw error;
      await wait(delay);
    }
  }
  throw new Error('Model still loading after maximum retries');
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image');

    if (!file) {
      return new Response(JSON.stringify({ error: 'Image file is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const buffer = await file.arrayBuffer();
    const result = await queryWithRetry(buffer);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to process image' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}