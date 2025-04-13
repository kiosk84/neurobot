'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Settings as SettingsIcon, ArrowLeft, Moon, Sun, Laptop, Palette, Volume2, VolumeX, Globe, Lock, Bell } from 'lucide-react';
import Link from 'next/link';
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  const { toast } = useToast();
  const [darkMode, setDarkMode] = useState(true);
  const [animations, setAnimations] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [saveHistory, setSaveHistory] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const handleSaveSettings = () => {
    toast({
      title: "Настройки сохранены",
      description: "Ваши настройки были успешно применены",
      duration: 1000
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="container max-w-2xl mx-auto p-4 pt-8">
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/"
            className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <SettingsIcon className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Настройки</h1>
              <p className="text-sm text-gray-400">Персонализация приложения</p>
            </div>
          </div>
        </div>

        {/* Баннер "В разработке" */}
        <div className="mb-6 p-4 bg-blue-500/20 border border-blue-500/30 rounded-xl text-center">
          <h2 className="text-xl font-bold text-white mb-2">Страница в разработке</h2>
          <p className="text-gray-300">Мы работаем над расширением настроек приложения. Скоро здесь появятся новые возможности!</p>
        </div>

        {/* Настройки интерфейса */}
        <Card className="border-0 bg-gray-800/50 backdrop-blur-sm mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-white">Интерфейс</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gray-700/50">
                    {darkMode ? (
                      <Moon className="w-4 h-4 text-blue-400" />
                    ) : (
                      <Sun className="w-4 h-4 text-yellow-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-200">Темная тема</p>
                    <p className="text-xs text-gray-400">Включить темную тему оформления</p>
                  </div>
                </div>
                <Switch
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gray-700/50">
                    <Palette className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-200">Анимации</p>
                    <p className="text-xs text-gray-400">Включить анимации интерфейса</p>
                  </div>
                </div>
                <Switch
                  checked={animations}
                  onCheckedChange={setAnimations}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Настройки звука */}
        <Card className="border-0 bg-gray-800/50 backdrop-blur-sm mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-white">Звук</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gray-700/50">
                    <Volume2 className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-200">Звуковые эффекты</p>
                    <p className="text-xs text-gray-400">Включить звуковые эффекты</p>
                  </div>
                </div>
                <Switch
                  checked={soundEffects}
                  onCheckedChange={setSoundEffects}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Настройки приватности */}
        <Card className="border-0 bg-gray-800/50 backdrop-blur-sm mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-white">Приватность</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gray-700/50">
                    <Lock className="w-4 h-4 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-200">Сохранение истории</p>
                    <p className="text-xs text-gray-400">Сохранять историю запросов</p>
                  </div>
                </div>
                <Switch
                  checked={saveHistory}
                  onCheckedChange={setSaveHistory}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gray-700/50">
                    <Bell className="w-4 h-4 text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-200">Уведомления</p>
                    <p className="text-xs text-gray-400">Получать уведомления</p>
                  </div>
                </div>
                <Switch
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Планируемые функции */}
        <Card className="border-0 bg-gray-800/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-white">Планируемые функции</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-2">
                <div className="min-w-4 min-h-4 rounded-full bg-blue-500/30 p-1 mt-1">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                </div>
                <div>
                  <span className="font-medium">Персонализация AI</span>
                  <p className="text-sm text-gray-400">Настройка поведения и ответов искусственного интеллекта</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="min-w-4 min-h-4 rounded-full bg-blue-500/30 p-1 mt-1">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                </div>
                <div>
                  <span className="font-medium">Экспорт данных</span>
                  <p className="text-sm text-gray-400">Возможность экспорта истории чатов и настроек</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="min-w-4 min-h-4 rounded-full bg-blue-500/30 p-1 mt-1">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                </div>
                <div>
                  <span className="font-medium">Расширенные настройки приватности</span>
                  <p className="text-sm text-gray-400">Дополнительные опции для контроля ваших данных</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="min-w-4 min-h-4 rounded-full bg-blue-500/30 p-1 mt-1">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                </div>
                <div>
                  <span className="font-medium">Кастомизация интерфейса</span>
                  <p className="text-sm text-gray-400">Возможность настройки цветов и расположения элементов</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        <div className="mt-6">
          <Button
            onClick={handleSaveSettings}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Сохранить настройки
          </Button>
        </div>
      </div>
    </div>
  );
}
