import './globals.css';
import { Inter } from 'next/font/google';
// Убираем импорт AnimatedBackground отсюда

const inter = Inter({ subsets: ['latin'] });

// Используем generateMetadata вместо статического экспорта metadata
export function generateMetadata() {
  return {
    title: 'Neurobot',
    description: 'AI-powered assistant',
  };
}

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
