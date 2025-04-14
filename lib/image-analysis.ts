/**
 * Отправляет данные изображения (URL или base64) на серверный API-маршрут для анализа через OpenRouter.
 * @param imageData Объект, содержащий либо `imageUrl` (строка), либо `imageData` (строка base64).
 * @param prompt Необязательный текстовый промпт для модели анализа изображений.
 * @returns Промис, который разрешается результатом анализа от API.
 * @throws Ошибка, если запрос к API не удался или входные данные некорректны.
 */
interface AnalyzeImageData {
  imageUrl?: string;
  imageData?: string; // base64 строка без префикса data:image/...;base64,
}

export async function analyzeImage(
  { imageUrl, imageData }: AnalyzeImageData,
  prompt?: string
): Promise<any> {
  if (!imageUrl && !imageData) {
    throw new Error("Необходимо предоставить либо imageUrl, либо imageData.");
  }
  if (imageUrl && imageData) {
    throw new Error("Предоставьте только imageUrl или imageData, не оба.");
  }

  const bodyPayload = imageUrl ? { imageUrl, prompt } : { imageData, prompt };
  const logIdentifier = imageUrl ? `URL: ${imageUrl}` : 'Base64 Data';

  try {
    console.log(`[analyzeImage] Отправка запроса на /api/analyze-image с ${logIdentifier}`);
    const response = await fetch('/api/analyze-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyPayload), // Передаем соответствующий payload
    });

    console.log(`[analyzeImage] Статус ответа от /api/analyze-image: ${response.status}`);

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`[analyzeImage] Ошибка от API /analyze-image:`, errorData);
      throw new Error(errorData.error || `Ошибка API: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`[analyzeImage] Успешный ответ от /api/analyze-image.`);
    return data; // Возвращаем полный ответ от OpenRouter API

  } catch (error) {
    console.error('[analyzeImage] Ошибка при вызове API анализа изображения:', error);
    // Перебрасываем ошибку для обработки в вызывающем коде
    throw error;
  }
}
