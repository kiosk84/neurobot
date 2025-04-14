"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChannelsList } from "@/components/ChannelsList";
import { connectTelegramChannel } from "@/lib/telegram";
import { useState } from "react";

export default function SettingsPage() {
  const [telegramToken, setTelegramToken] = useState("");
  const [channelName, setChannelName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    if (!telegramToken || !channelName) {
      setError("Заполните все поля");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await connectTelegramChannel(telegramToken, channelName);
      setSuccess(true);
      setTelegramToken("");
      setChannelName("");
    } catch (err) {
      setError(err.message || 'Ошибка подключения');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-3xl space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          Канал успешно подключен!
        </div>
      )}
      <h1 className="text-2xl font-bold mb-6">Настройки каналов</h1>
      
      <div className="space-y-6">
        <div className="border p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Telegram канал</h2>
          <div className="space-y-4">
            <Input
              placeholder="Токен бота"
              value={telegramToken}
              onChange={(e) => setTelegramToken(e.target.value)}
            />
            <Input
              placeholder="Название канала (@username)"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
            />
            <Button 
              onClick={handleConnect}
              disabled={loading}
            >
              {loading ? 'Подключение...' : 'Подключить'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
