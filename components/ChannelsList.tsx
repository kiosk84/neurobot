"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getConnectedChannels } from "@/lib/telegram";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

export function ChannelsList() {
  const [channels, setChannels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChannels = async () => {
      try {
        const data = await getConnectedChannels();
        setChannels(data);
      } catch (error) {
        console.error("Error loading channels:", error);
      } finally {
        setLoading(false);
      }
    };
    loadChannels();
  }, []);

  if (loading) return <div className="text-center py-4">Загрузка...</div>;
  if (!channels.length) return <div className="text-center py-4">Нет подключенных каналов</div>;

  return (
    <div className="space-y-2">
      {channels.map((channel) => (
        <div key={channel.id} className="border p-3 rounded-lg flex justify-between items-center">
          <div>
            <h3 className="font-medium">@{channel.channel_name}</h3>
            <p className="text-sm text-gray-500">
              Добавлен: {format(new Date(channel.created_at), 'dd MMMM yyyy', { locale: ru })}
            </p>
          </div>
          <Button variant="destructive" size="sm">
            Отключить
          </Button>
        </div>
      ))}
    </div>
  );
}
