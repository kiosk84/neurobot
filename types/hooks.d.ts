declare module '@/hooks/use-local-storage' {
  export function useLocalStorage<T>(
    key: string, 
    initialValue: T
  ): [T, (value: T) => void];
}
