'use client';

import { useEffect, ChangeEvent, FormEvent } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useUserStore } from "@/store/useUserStore";
import { User, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AccountPage() {
  const { toast } = useToast();
  const { profile, updateProfile } = useUserStore();

  useEffect(() => {
    if (!profile) {
      updateProfile({
        name: '',
        email: '',
      });
    }
  }, [profile, updateProfile]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateProfile({
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    toast({
      title: "Профиль обновлен",
      description: "Ваши данные были успешно сохранены",
      duration: 1000
    });
  };

  if (!profile) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-500 border-t-blue-500"></div>
      </div>
    );
  }

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
              <User className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Личный кабинет</h1>
              <p className="text-sm text-gray-400">Управление профилем</p>
            </div>
          </div>
        </div>

        {/* Баннер "В разработке" */}
        <div className="mb-6 p-4 bg-blue-500/20 border border-blue-500/30 rounded-xl text-center">
          <h2 className="text-xl font-bold text-white mb-2">Страница в разработке</h2>
          <p className="text-gray-300">Мы работаем над улучшением личного кабинета. Скоро здесь появятся новые функции!</p>
        </div>

        <Card className="border-0 bg-gray-800/50 backdrop-blur-sm mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-white">Личные данные</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-200">
                  Имя
                </label>
                <Input
                  id="name"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  placeholder="Введите ваше имя"
                  className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-200">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={handleChange}
                  placeholder="Введите ваш email"
                  className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Сохранить изменения
              </Button>
            </form>
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
                  <span className="font-medium">Управление подпиской</span>
                  <p className="text-sm text-gray-400">Подключение и управление платными тарифами</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="min-w-4 min-h-4 rounded-full bg-blue-500/30 p-1 mt-1">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                </div>
                <div>
                  <span className="font-medium">История запросов</span>
                  <p className="text-sm text-gray-400">Просмотр и управление историей всех запросов</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="min-w-4 min-h-4 rounded-full bg-blue-500/30 p-1 mt-1">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                </div>
                <div>
                  <span className="font-medium">Настройки приватности</span>
                  <p className="text-sm text-gray-400">Управление настройками конфиденциальности и данных</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="min-w-4 min-h-4 rounded-full bg-blue-500/30 p-1 mt-1">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                </div>
                <div>
                  <span className="font-medium">Интеграции</span>
                  <p className="text-sm text-gray-400">Подключение внешних сервисов и инструментов</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}