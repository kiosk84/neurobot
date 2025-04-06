"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
      <h2 className="text-xl font-semibold text-gray-700">Что-то пошло не так!</h2>
      <Button
        variant="outline"
        onClick={() => reset()}
      >
        Попробовать снова
      </Button>
    </div>
  );
}