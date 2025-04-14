export async function getChatCompletion(params: {
  model: string;
  messages: any[];
}): Promise<string> {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      'X-Title': 'Neurobot'
    },
    body: JSON.stringify({
      model: params.model,
      messages: params.messages
    })
  });

  if (!response.ok) {
    throw new Error(`OpenRouter error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
