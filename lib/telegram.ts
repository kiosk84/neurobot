import { supabase } from './supabase';
import type { TelegramChannel } from './supabase';

export const connectTelegramChannel = async (
  token: string,
  channelName: string
): Promise<TelegramChannel> => {
  try {
    const response = await fetch('/api/telegram', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, channelName }),
    });

    if (!response.ok) {
      throw new Error('Ошибка подключения канала');
    }

    const data = await response.json();
    return data.channel;
  } catch (error) {
    console.error('Ошибка подключения Telegram:', error);
    throw error;
  }
};

export const getConnectedChannels = async (): Promise<TelegramChannel[]> => {
  try {
    const response = await fetch('/api/telegram');
    if (!response.ok) {
      throw new Error('Ошибка загрузки каналов');
    }
    const data = await response.json();
    return data.channels;
  } catch (error) {
    console.error('Ошибка получения каналов:', error);
    return [];
  }
};
