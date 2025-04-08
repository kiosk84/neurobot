import { NextRequest, NextResponse } from 'next/server';

type Message = {
  role: 'system' | 'user' | 'assistant';
  content: string | Array<{ type: string; text?: string; image_url?: { url: string } }>;
};

interface RequestBody {
  messages: Message[];
  chatType?: 'smm' | 'chat';
}

export async function POST(req: NextRequest) {
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
  const API_URL = "https://openrouter.ai/api/v1/chat/completions";

  if (!OPENROUTER_API_KEY) {
    return NextResponse.json(
      { success: false, error: 'OpenRouter API key not configured' },
      { status: 500 }
    );
  }

  try {
    const { messages, chatType }: RequestBody = await req.json();

    const systemMessage = chatType === 'smm' 
      ? {
          role: 'system',
          content: 'Ты профессиональный SMM-специалист с многолетним опытом в создании контента, разработке стратегий продвижения и аналитике социальных сетей. Твоя задача — помогать брендам и предпринимателям достигать их бизнес-целей через эффективные маркетинговые кампании. Отвечай на русском языке, используя четкие и понятные формулировки. Предлагай только проверенные и современные решения, основанные на актуальных трендах и алгоритмах платформ (Instagram, TikTok, ВКонтакте, Telegram, YouTube и др.). Учитывай специфику аудитории и особенности каждой платформы.'
        }
      : {
          role: 'system',
          content: 'Ты дружелюбный и полезный ассистент. Отвечай на русском языке, используя понятные формулировки. Будь лаконичным, но информативным. Если не знаешь точного ответа, так и скажи. Старайся быть полезным и предлагать конструктивные решения.'
        };

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-Title": "NEUROBOT",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "meta-llama/llama-4-scout:free",
        messages: [systemMessage, ...messages]
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'API request failed');
    }

    const data = await response.json();
    // Wrap successful response
    return NextResponse.json({ success: true, data: data });

  } catch (error) {
    console.error('API Error:', error);
    // Wrap error response
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
