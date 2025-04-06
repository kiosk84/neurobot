import { NextRequest, NextResponse } from 'next/server';

const ARTIRBIT_CONCEPT_RESPONSE = "Это концепция ARTIRBIT";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function POST(req: NextRequest) {
  try {
    const { messages, chatType = 'chat' } = await req.json();

    // 1. Валидация входных данных
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Messages array is required',
            code: 'MISSING_MESSAGES'
          }
        },
        { status: 400 }
      );
    }

    // 2. Проверка на "кто тебя создал"
    const lastUserMessage = messages[messages.length - 1];
    if (lastUserMessage?.role === 'user') {
      const userContent = lastUserMessage.content.toLowerCase().trim();
      const creationQueries = ["кто тебя создал", "кто тебя придумал"];
      if (creationQueries.some(query => userContent.includes(query))) {
        // Возвращаем специальный ответ
        return NextResponse.json({
          success: true,
          data: {
            choices: [{ message: { role: 'assistant', content: ARTIRBIT_CONCEPT_RESPONSE } }],
            usage: { total_tokens: 0 } // Примерное использование токенов
          }
        });
      }
    }

    // 3. Подготовка системного сообщения
    const smmSystemPrompt = {
      role: 'system',
      content: 'Ты профессиональный SMM специалист. Отвечай на русском языке.' // Новая подсказка для SMM
    };
    if (!OPENROUTER_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'OpenRouter API not configured',
            code: 'OPENROUTER_NOT_CONFIGURED'
          }
        },
        { status: 501 }
      );
    }

    // 4. Обработка запроса через OpenRouter
    try {
    const processedMessages =
      chatType === 'smm' && messages[0]?.role !== 'system'
        ? [smmSystemPrompt, ...messages] // Используем новую подсказку
        : messages;

      const openRouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": APP_URL,
          "X-Title": "AI Assistant"
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-chat-v3-0324:free",
          messages: processedMessages,
          temperature: 0.7,
          max_tokens: 2000
        })
      });

      if (!openRouterResponse.ok) {
        const errorData = await openRouterResponse.json();
        console.error('OpenRouter API Error:', errorData);
        
        return NextResponse.json(
          {
            success: false,
            error: {
              message: errorData.error?.message || 'OpenRouter API error',
              code: 'OPENROUTER_ERROR',
              details: errorData.error
            }
          },
          { status: openRouterResponse.status }
        );
      }

      const data = await openRouterResponse.json();
      return NextResponse.json({
        success: true,
        data: {
          choices: data.choices,
          usage: data.usage
        }
      });

    } catch (error) {
      console.error('OpenRouter Processing Error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Error processing OpenRouter request',
            code: 'OPENROUTER_PROCESSING_ERROR'
          }
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Internal server error',
          code: 'INTERNAL_SERVER_ERROR'
        }
      },
      { status: 500 }
    );
  }
}
