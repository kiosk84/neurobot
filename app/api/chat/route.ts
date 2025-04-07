import { NextRequest, NextResponse } from 'next/server';

const ARTIRBIT_CONCEPT_RESPONSE = "Меня разработала команда ARTIRBIT — инновационной компании, которая специализируется на создании технологичных решений для автоматизации бизнес-процессов и повышения эффективности работы специалистов. Я являюсь результатом многолетних исследований в области искусственного интеллекта и машинного обучения. Моя задача — помогать пользователям решать сложные задачи, предоставляя точные, актуальные и практичные рекомендации.";

const API_KEY = process.env.OPENROUTER_API_KEY;

// Use Vercel's system environment variable for deployment URL, fallback to localhost for local dev
const APP_URL = process.env.VERCEL_BRANCH_URL ? `https://${process.env.VERCEL_BRANCH_URL}` : "http://localhost:3000";


export async function POST(req: NextRequest) {
  try {
    const { messages, chatType = 'chat' } = await req.json();

    // 1. Валидация входных данных
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { success: false, error: { message: 'Messages array is required', code: 'MISSING_MESSAGES' } },
        { status: 400 }
      );
    }

    // 2. Проверка на "кто тебя создал"
    const lastUserMessage = messages[messages.length - 1];
    if (lastUserMessage?.role === 'user') {
      const userContent = lastUserMessage.content.toLowerCase().trim();
      const creationQueries = ["кто тебя создал", "кто тебя придумал"];
      if (creationQueries.some(query => userContent.includes(query))) {
        return NextResponse.json({
          success: true,
          data: { choices: [{ message: { role: 'assistant', content: ARTIRBIT_CONCEPT_RESPONSE } }], usage: { total_tokens: 0 } }
        });
      }
    }

    // 3. Подготовка системного сообщения
    const smmSystemPrompt = {
      role: 'system',
      content: 'Ты профессиональный SMM-специалист с многолетним опытом в создании контента, разработке стратегий продвижения и аналитике социальных сетей. Твоя задача — помогать брендам и предпринимателям достигать их бизнес-целей через эффективные маркетинговые кампании. Отвечай на русском языке, используя четкие и понятные формулировки. Предлагай только проверенные и современные решения, основанные на актуальных трендах и алгоритмах платформ (Instagram, TikTok, ВКонтакте, Telegram, YouTube и др.). Учитывай специфику аудитории и особенности ниши. Если требуется, задавай уточняющие вопросы для максимальной точности ответов.'
    };

    if (!API_KEY) {
      console.error('No OpenRouter API key found in environment variables.');
      return NextResponse.json(
        { success: false, error: { message: 'No OpenRouter API key configured', code: 'OPENROUTER_NOT_CONFIGURED' } },
        { status: 501 }
      );
    }

    // 4. Обработка запроса через OpenRouter
    try {
      const processedMessages =
        chatType === 'smm' && messages[0]?.role !== 'system'
          ? [smmSystemPrompt, ...messages]
          : messages;

      const openRouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": APP_URL,
          "X-Title": "AI Assistant" // Можно добавить имя вашего приложения
        },
        body: JSON.stringify({
          // model: "deepseek/deepseek-chat-v3-0324:free", // Пример модели, можно изменить
           model: "openai/gpt-4o-mini", // Используем другую модель для теста
          messages: processedMessages,
          temperature: 0.7,
          max_tokens: 2000 // Устанавливаем лимит токенов
        })
      });

      if (openRouterResponse.ok) {
        const data = await openRouterResponse.json();
        // Проверяем наличие данных перед возвратом
         if (!data?.choices?.[0]?.message) {
           console.error('Invalid response format from OpenRouter:', data);
           return NextResponse.json(
             { success: false, error: { message: 'Invalid response format from OpenRouter', code: 'OPENROUTER_INVALID_RESPONSE' } },
             { status: 502 } // Bad Gateway, т.к. ответ от upstream некорректный
           );
         }
        return NextResponse.json({
          success: true,
          data: { choices: data.choices, usage: data.usage }
        });
      } else {
        // Другая ошибка API
        const errorData = await openRouterResponse.json().catch(() => ({})); // Пытаемся получить тело ошибки, если не получается - пустой объект
        console.error(`OpenRouter API Error (Status: ${openRouterResponse.status}):`, errorData);
        return NextResponse.json(
          { success: false, error: { message: errorData?.error?.message || `OpenRouter API error (${openRouterResponse.status})`, code: 'OPENROUTER_ERROR', details: errorData?.error } },
          { status: openRouterResponse.status }
        );
      }
    } catch (error) {
      console.error(`OpenRouter Processing Error:`, error);
      // При сетевой ошибке не ясно, виноват ли ключ, поэтому не ротируем, а возвращаем ошибку
      return NextResponse.json(
        { success: false, error: { message: 'Error processing OpenRouter request', code: 'OPENROUTER_PROCESSING_ERROR', details: error instanceof Error ? error.message : String(error) } },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Server Error:', error);
    // Добавляем больше деталей в лог ошибки
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorCode = error instanceof Error && 'code' in error ? error.code : 'UNKNOWN';
    return NextResponse.json(
      { success: false, error: { message: 'Internal server error', code: 'INTERNAL_SERVER_ERROR', details: { message: errorMessage, code: errorCode } } },
      { status: 500 }
    );
  }
}
