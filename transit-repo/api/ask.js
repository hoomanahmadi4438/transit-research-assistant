// Vercel Serverless Function
// This runs on the server, NOT in the browser — so the API key stays secret.
// It receives { systemPrompt, question } from the frontend and forwards
// the request to Anthropic, then returns just the answer text.

export default async function handler(req, res) {
  // Allow the frontend to call this endpoint
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests are allowed.' });
  }

  const { systemPrompt, question } = req.body || {};

  if (!question || !systemPrompt) {
    return res.status(400).json({ error: 'Missing "question" or "systemPrompt" in request body.' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server misconfiguration: ANTHROPIC_API_KEY is not set.' });
  }

  try {
    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: 'user', content: question }],
      }),
    });

    const data = await anthropicResponse.json();

    if (!anthropicResponse.ok) {
      return res.status(anthropicResponse.status).json({ error: data.error?.message || 'Anthropic API error' });
    }

    const text = (data.content || [])
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('\n')
      .trim();

    return res.status(200).json({ answer: text });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
