import { NextRequest, NextResponse } from 'next/server';

const ARTIRBIT_CONCEPT_RESPONSE = "Меня разработала команда ARTIRBIT — инновационной компании, которая специализируется на создании технологичных решений для автоматизации бизнес-процессов и повышения эффективности работы специалистов. Я являюсь результатом многолетних исследований в области искусственного интеллекта и машинного обучения. Моя задача — помогать пользователям решать сложные задачи, предоставляя точные, актуальные и практичные рекомендации.";

// Получаем все ключи из переменных окружения
const API_KEYS = [
  process.env.OPENROUTER_API_KEY_1,
  process.env.OPENROUTER_API_KEY_2,
  process.env.OPENROUTER_API_KEY_3,
  process.env.OPENROUTER_API_KEY_4,
].filter(key => !!key) as string[]; // Фильтруем пустые и указываем тип

// Простой механизм для хранения индекса текущего ключа (в памяти)
// В реальном приложении может потребоваться более надежное хранилище
let currentKeyIndex = 0;

// Use Vercel's system environment variable for deployment URL, fallback to localhost for local dev
const APP_URL = process.env.VERCEL_BRANCH_URL ? `https://${process.env.VERCEL_BRANCH_URL}` : "http://localhost:3000";

// Функция для получения текущего активного ключа
function getCurrentApiKey(): string | null {
  if (API_KEYS.length === 0) {
    return null;
  }
  // Убедимся, что индекс всегда в пределах массива
  currentKeyIndex = currentKeyIndex % API_KEYS.length;
  return API_KEYS[currentKeyIndex];
}

// Функция для переключения на следующий ключ
function rotateApiKey() {
  if (API_KEYS.length > 0) {
    currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
    console.log(`Rotated to API key index: ${currentKeyIndex}`);
  }
}

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

    if (API_KEYS.length === 0) {
      console.error('No OpenRouter API keys found in environment variables.');
      return NextResponse.json(
        { success: false, error: { message: 'No OpenRouter API keys configured', code: 'OPENROUTER_NOT_CONFIGURED' } },
        { status: 501 }
      );
    }

    // 4. Обработка запроса через OpenRouter с ротацией ключей
    let attempts = 0;
    const maxAttempts = API_KEYS.length; // Попытаться использовать каждый ключ один раз

    while (attempts < maxAttempts) {
      const currentApiKey = getCurrentApiKey();
      if (!currentApiKey) {
         console.error('Failed to get current API key. API_KEYS:', API_KEYS, 'Index:', currentKeyIndex);
         return NextResponse.json(
           { success: false, error: { message: 'Failed to get current API key', code: 'KEY_ROTATION_ERROR' } },
           { status: 500 }
         );
      }

      console.log(`Attempting request with API key index: ${currentKeyIndex}`);

      try {
        const processedMessages =
          chatType === 'smm' && messages[0]?.role !== 'system'
            ? [smmSystemPrompt, ...messages]
            : messages;

        const openRouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: 'POST',
          headers: {
            "Authorization": `Bearer ${currentApiKey}`, // Используем текущий ключ
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
          // Проверяем статус ошибки
          if (openRouterResponse.status === 429) { // Предполагаем, что 429 - это ошибка лимита
            console.warn(`API key index ${currentKeyIndex} hit rate limit (status 429). Rotating key.`);
            rotateApiKey();
            attempts++;
            if (attempts >= maxAttempts) {
              console.error('All API keys hit rate limit.');
              return NextResponse.json(
                { success: false, error: { message: 'All API keys are rate limited', code: 'ALL_KEYS_RATE_LIMITED' } },
                { status: 429 }
              );
            }
            // Продолжаем цикл для следующей попытки с новым ключом
            continue;
          } else {
            // Другая ошибка API
            const errorData = await openRouterResponse.json().catch(() => ({})); // Пытаемся получить тело ошибки, если не получается - пустой объект
            console.error(`OpenRouter API Error (Key Index: ${currentKeyIndex}, Status: ${openRouterResponse.status}):`, errorData);
            return NextResponse.json(
              { success: false, error: { message: errorData?.error?.message || `OpenRouter API error (${openRouterResponse.status})`, code: 'OPENROUTER_ERROR', details: errorData?.error } },
              { status: openRouterResponse.status }
            );
          }
        }
      } catch (error) {
        console.error(`OpenRouter Processing Error (Key Index: ${currentKeyIndex}):`, error);
        // При сетевой ошибке не ясно, виноват ли ключ, поэтому не ротируем, а возвращаем ошибку
        return NextResponse.json(
          { success: false, error: { message: 'Error processing OpenRouter request', code: 'OPENROUTER_PROCESSING_ERROR', details: error instanceof Error ? error.message : String(error) } },
          { status: 500 }
        );
      }
    }
    // Если цикл завершился без успешного ответа (маловероятно, если есть хотя бы один рабочий ключ)
     console.error('Failed to process request after trying all API keys.');
     return NextResponse.json(
       { success: false, error: { message: 'Failed to process request after multiple key attempts', code: 'KEY_ROTATION_FAILED' } },
       { status: 500 }
     );

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
