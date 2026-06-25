import { useCallback, useEffect, useState } from "react";
import { loadJSON, saveJSON } from "@/lib/storage";

export function useLocalState<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback);
  const [loadedKey, setLoadedKey] = useState<string | null>(null);

  useEffect(() => {
    setValue(loadJSON<T>(key, fallback));
    setLoadedKey(key);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (loadedKey !== key) return;
    saveJSON(key, value);
  }, [key, loadedKey, value]);

  const reset = useCallback(() => setValue(fallback), [fallback]);

  return [value, setValue, reset] as const;
}
