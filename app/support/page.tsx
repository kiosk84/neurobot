'use client';
import Image from 'next/image';

export default function SupportPage() {
  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 bg-gray-900 min-h-screen text-white">
      <div className="max-w-md mx-auto bg-gray-800 border border-gray-700 rounded-xl overflow-hidden space-y-0">
        <div className="p-5 bg-gray-900/50 border-b border-gray-700 flex items-center justify-between">
          <button 
            onClick={() => window.history.back()}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Вернуться назад"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <h3 className="text-xl font-bold text-white text-center flex-1">
            ❤️ Поддержать проект
          </h3>
          <div className="w-6"></div>
        </div>

        <div className="p-5 space-y-4">
          <div className="space-y-3 text-gray-300">
            <p>Ваша поддержка помогает нам:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Развивать и улучшать функционал</li>
              <li>Обеспечивать стабильную работу серверов</li>
              <li>Создавать новые полезные функции</li>
              <li>Поддерживать бесплатный доступ для всех пользователей</li>
            </ul>
            <p className="pt-2">Любая сумма важна и будет использована для развития проекта!</p>
          </div>
            
          <div className="p-5">
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-900/30 rounded-lg">
                <div className="bg-blue-900/20 p-2 rounded-lg">
                <Image 
                    src="https://logotic.me/system/assets/uploads/vector-files/sbp-icon-1669939801-logotic-brand.svg?width=&height=100" 
                    alt="SBP Icon" 
                    width={32}
                    height={32}
                    className="h-8 w-auto"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white">Система Быстрых Платежей</p>
                  <p className="text-xs text-gray-400">Мгновенно и без комиссии</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-900/50 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-blue-500/10 p-2 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="4" width="20" height="16" rx="2"/>
                        <path d="M2 10h20M7 14h.01M11 14h.01"/>
                      </svg>
                    </div>
                    <h4 className="font-medium text-white">Реквизиты для перевода</h4>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Банк</p>
                      <p className="font-medium">Озон Банк</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Номер телефона</p>
                      <p className="font-mono text-white bg-gray-800 px-3 py-1.5 rounded-md inline-block">+7 (902) 585-04-04</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Комментарий к переводу</p>
                      <p className="font-mono text-white bg-gray-800 px-3 py-1.5 rounded-md inline-block">Донат</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-900/50 border-t border-gray-700 text-center">
            <p className="text-sm text-gray-400">
              Благодарим за участие в развитии проекта!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
