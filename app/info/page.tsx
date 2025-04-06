import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Lightbulb, Mail, Heart } from 'lucide-react'; // Добавили Heart

export default function InfoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-200 p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Кнопка Назад */}
        <Link href="/" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-8 group">
          <ArrowLeft className="h-4 w-4 mr-2 transition-transform duration-200 group-hover:-translate-x-1" />
          Назад к чату
        </Link>

        <h1 className="text-4xl font-bold mb-6 text-white text-center">О проекте NEUROBOT</h1>
        
        <section className="mb-8 bg-gray-800/50 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-3 text-blue-300">Что такое NEUROBOT?</h2>
          <p className="text-lg leading-relaxed">
            NEUROBOT - это ваш универсальный ИИ-ассистент, созданный для помощи в решении разнообразных задач. 
            Мы стремимся предоставить удобный и мощный инструмент для общения с передовыми нейросетями, 
            доступный прямо в вашем браузере. На данный момент реализован основной функционал чата и 
            анализ изображений.
          </p>
        </section>

        <section className="mb-8 bg-gray-800/50 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-3 text-purple-300">Планы на будущее</h2>
          <p className="text-lg leading-relaxed mb-4">
            Мы постоянно работаем над улучшением NEUROBOT и планируем добавить новые захватывающие функции. 
            В ближайших планах:
          </p>
          <ul className="list-disc list-inside space-y-2 text-lg">
            <li>
              <span className="font-semibold">SMM Ассистент:</span> Специализированный режим для помощи 
              в создании контент-планов, написании постов и анализе аудитории в социальных сетях.
            </li>
            <li>
              <span className="font-semibold">Расширенные настройки:</span> Возможность выбора моделей ИИ, 
              настройки системных промптов и персонализации интерфейса.
            </li>
            <li>
              <span className="font-semibold">Интеграции:</span> Подключение к другим сервисам и платформам.
            </li>
            <li>
              <span className="font-semibold">Улучшение анализа изображений:</span> Добавление новых возможностей 
              и моделей для работы с картинками.
            </li>
          </ul>
        </section>

        <section className="mb-8 bg-gray-800/50 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-3 text-yellow-300">Поддержите развитие!</h2>
          <p className="text-lg leading-relaxed mb-4">
            Разработка и поддержка такого проекта требует ресурсов: оплата серверов, API нейросетей, 
            время разработчиков. Ваша поддержка позволяет нам не только покрывать расходы, но и 
            ускорять внедрение новых функций, делая NEUROBOT еще лучше для вас.
          </p>
          <div className="text-center">
            {/* Меняем rounded-md на rounded-lg */}
            <Link href="/support" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-yellow-500 transition duration-150 ease-in-out">
              <Heart className="h-5 w-5 mr-2" />
              Поддержать проект
            </Link>
          </div>
        </section>

        <section className="bg-gray-800/50 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-3 text-green-300">Ваши идеи и предложения</h2>
          <p className="text-lg leading-relaxed mb-4">
            Мы ценим ваше мнение! Если у вас есть идеи по улучшению NEUROBOT, предложения по новым функциям 
            или вы заметили ошибку, пожалуйста, дайте нам знать. Ваша обратная связь помогает нам 
            делать проект лучше.
          </p>
          {/* Оборачиваем кнопки в flex-контейнер для выравнивания */}
          <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
            {/* Замените mailto: на ваш реальный email или ссылку на форму обратной связи */}
            {/* Меняем rounded-md на rounded-lg */}
            <a 
              href="mailto:your-email@example.com?subject=Предложение%20по%20NEUROBOT" 
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-teal-500 transition duration-150 ease-in-out w-full sm:w-auto"
            >
              <Lightbulb className="h-5 w-5 mr-2" />
              Предложить идею
            </a>
            {/* Меняем rounded-md на rounded-lg */}
            <a 
              href="mailto:your-email@example.com?subject=Ошибка%20в%20NEUROBOT" 
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-500 text-base font-medium rounded-lg shadow-sm text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-500 transition duration-150 ease-in-out w-full sm:w-auto"
            >
              <Mail className="h-5 w-5 mr-2" />
              Сообщить об ошибке
            </a>
          </div>
        </section>

      </div>
    </div>
  );
}
