import { useState } from "react";

// Custom hook for localStorage operations
export function useLocalStorage<T>(key: string, initialValue: T) {
  // Get from localStorage or use initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  // Save to localStorage whenever value changes
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  };

  return [storedValue, setValue] as const;
}

// Hook for managing multiple characters
export function useCharacterList() {
  const [characters, setCharacters] = useLocalStorage<string[]>(
    "dnd-character-list",
    []
  );

  const addCharacter = (characterId: string) => {
    setCharacters((prev) => [...prev, characterId]);
  };

  const removeCharacter = (characterId: string) => {
    setCharacters((prev) => prev.filter((id) => id !== characterId));
  };

  return { characters, addCharacter, removeCharacter };
}
