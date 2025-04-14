import { NextRequest, NextResponse } from 'next/server';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

if (!OPENROUTER_API_KEY) {
  console.error('Ошибка: Переменная окружения OPENROUTER_API_KEY не установлена.');
}

export async function POST(req: NextRequest) {
  if (!OPENROUTER_API_KEY) {
    return NextResponse.json({ error: 'Ключ API OpenRouter не настроен на сервере.' }, { status: 500 });
  }

  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Необходим массив сообщений.' }, { status: 400 });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-Title": "Neuro Trader Bot"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat-v3-0324:free",
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
        language: "ru"
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`[API /chat] Ошибка от OpenRouter: ${errorData}`);
      return NextResponse.json(
        { error: `Ошибка от OpenRouter API: ${response.statusText}`, details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('[API /chat] Внутренняя ошибка сервера:', error);
    const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера.', details: errorMessage },
      { status: 500 }
    );
  }
}
