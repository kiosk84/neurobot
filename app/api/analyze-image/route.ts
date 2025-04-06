import { NextRequest, NextResponse } from 'next/server';

// Убедитесь, что переменная окружения установлена
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'; // Используйте переменную окружения или значение по умолчанию
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'My Next.js App'; // Используйте переменную окружения или значение по умолчанию

if (!OPENROUTER_API_KEY) {
  console.error('Ошибка: Переменная окружения OPENROUTER_API_KEY не установлена.');
  // В реальном приложении здесь лучше вернуть ошибку 500
}

export async function POST(req: NextRequest) {
  if (!OPENROUTER_API_KEY) {
    return NextResponse.json({ error: 'Ключ API OpenRouter не настроен на сервере.' }, { status: 500 });
  }

  try {
    // Ожидаем imageData (base64 строка) или imageUrl
    // Добавляем указание на язык в дефолтный промпт
    const { imageData, imageUrl, prompt = "What is in this image? Answer in Russian." } = await req.json();

    if (!imageData && !imageUrl) {
      return NextResponse.json({ error: 'Необходим параметр imageData (base64 строка) или imageUrl (строка).' }, { status: 400 });
    }
    if (imageData && typeof imageData !== 'string') {
       return NextResponse.json({ error: 'Параметр imageData должен быть строкой base64.' }, { status: 400 });
    }
     if (imageUrl && typeof imageUrl !== 'string') {
       return NextResponse.json({ error: 'Параметр imageUrl должен быть строкой.' }, { status: 400 });
    }

    // Формируем URL изображения для OpenRouter
    // Если есть imageData, используем data URI scheme
    const imageContentUrl = imageData ? `data:image/jpeg;base64,${imageData}` : imageUrl; // Предполагаем jpeg, можно сделать умнее

    console.log(`[API /analyze-image] Получен запрос для анализа изображения.`); // Не логируем base64

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": SITE_URL, // Необязательно. URL сайта для рейтинга на openrouter.ai.
        "X-Title": SITE_NAME, // Необязательно. Название сайта для рейтинга на openrouter.ai.
      },
      body: JSON.stringify({
        // Используем модель, поддерживающую vision (VL)
        "model": "qwen/qwen2.5-vl-72b-instruct:free", // Или другая подходящая модель
        "messages": [
          {
            "role": "user",
            "content": [
              {
                "type": "text",
                "text": prompt // Используем полученный или дефолтный промпт
              },
              {
                "type": "image_url",
                "image_url": {
                  "url": imageContentUrl // Передаем URL или data URI
                }
              }
            ]
          }
        ],
        // Можно добавить другие параметры, например, max_tokens
        // "max_tokens": 100
      })
    });

    console.log(`[API /analyze-image] Статус ответа от OpenRouter: ${response.status}`);

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`[API /analyze-image] Ошибка от OpenRouter: ${errorData}`);
      return NextResponse.json({ error: `Ошибка от OpenRouter API: ${response.statusText}`, details: errorData }, { status: response.status });
    }

    const data = await response.json();
    console.log(`[API /analyze-image] Ответ от OpenRouter получен успешно.`);

    // Возвращаем результат анализа клиенту
    return NextResponse.json(data);

  } catch (error) {
    console.error('[API /analyze-image] Внутренняя ошибка сервера:', error);
    const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
    return NextResponse.json({ error: 'Внутренняя ошибка сервера.', details: errorMessage }, { status: 500 });
  }
}
