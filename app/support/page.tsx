'use client';
import Image from 'next/image';
import { ArrowLeft, CreditCard, Heart, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SupportPage() {
  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 min-h-screen text-white">
      <motion.div 
        className="max-w-md mx-auto bg-gray-800/80 border border-gray-700 rounded-xl overflow-hidden shadow-xl shadow-blue-900/10 backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-5 bg-gray-900/70 border-b border-gray-700 flex items-center justify-between">
          <motion.button 
            onClick={() => window.history.back()}
            className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-700/50"
            aria-label="Вернуться назад"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft size={20} />
          </motion.button>
          <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 text-center flex-1 flex items-center justify-center gap-2">
            <Heart className="h-5 w-5 text-red-400" fill="#f87171" />
            Поддержать проект
          </h3>
          <div className="w-8"></div>
        </div>

        <div className="p-5 space-y-6">
          <motion.div 
            className="space-y-3 text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-white font-medium">Ваша поддержка помогает нам:</p>
            <ul className="space-y-2">
              {[
                'Развивать и улучшать функционал',
                'Обеспечивать стабильную работу серверов',
                'Создавать новые полезные функции',
                'Поддерживать бесплатный доступ для всех пользователей'
              ].map((item, index) => (
                <motion.li 
                  key={index}
                  className="flex items-start gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Sparkles className="h-4 w-4 text-blue-400 mt-1 flex-shrink-0" />
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
            <p className="pt-2 text-blue-300 font-medium">Любая сумма важна и будет использована для развития проекта!</p>
          </motion.div>
            
          <motion.div 
            className="space-y-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div 
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-900/20 to-blue-800/10 rounded-lg border border-blue-800/30 hover:border-blue-700/50 transition-colors cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="bg-blue-900/30 p-2 rounded-lg">
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
                <p className="text-xs text-blue-300">Мгновенно и без комиссии</p>
              </div>
            </motion.div>

            <motion.div 
              className="bg-gray-900/50 p-5 rounded-lg border border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-500/20 p-2 rounded-full">
                  <CreditCard className="h-5 w-5 text-blue-400" />
                </div>
                <h4 className="font-medium text-white">Реквизиты для перевода</h4>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Банк</p>
                  <p className="font-medium text-white">Озон Банк</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Номер телефона</p>
                  <div className="relative group">
                    <p className="font-mono text-white bg-gray-800 px-3 py-2 rounded-md border border-gray-700 group-hover:border-blue-500/50 transition-colors">
                      +7 (902) 585-04-04
                    </p>
                    <div className="absolute inset-0 bg-blue-500/5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Комментарий к переводу</p>
                  <div className="relative group">
                    <p className="font-mono text-white bg-gray-800 px-3 py-2 rounded-md border border-gray-700 group-hover:border-blue-500/50 transition-colors">
                      Донат
                    </p>
                    <div className="absolute inset-0 bg-blue-500/5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div 
            className="p-4 bg-gray-900/70 border-t border-gray-700 text-center rounded-b-lg mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p className="text-sm text-blue-300 flex items-center justify-center gap-2">
              <Heart className="h-3 w-3" fill="#93c5fd" />
              Благодарим за участие в развитии проекта!
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
