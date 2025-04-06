import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
// Убираем импорт AnimatedBackground отсюда

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Neurobot',
  description: 'AI-powered assistant',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      {/* Убираем relative и AnimatedBackground отсюда */}
      <body className={inter.className}> 
        {children} 
      </body>
    </html>
  );
}
