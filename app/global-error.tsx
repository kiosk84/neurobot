"use client";

import { useEffect } from "react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to your error reporting service
    console.error('Global Error:', error);
  }, [error]);

  return (
    <html lang="ru">
      <body className={inter.className}>
        <div className="flex h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
          <h2 className="mb-4 text-2xl font-bold">Критическая ошибка!</h2>
          <p className="mb-6 max-w-md text-center text-gray-300">
            Произошла критическая ошибка при загрузке приложения. Пожалуйста, обновите страницу.
          </p>
          <button
            onClick={() => reset()}
            className="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
          >
            Обновить страницу
          </button>
        </div>
      </body>
    </html>
  );
}