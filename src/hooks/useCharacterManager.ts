import { useState, useEffect } from "react";
import type {
  Character,
  CharacterData,
  CharactersStore,
  Note,
} from "../types/character";
import { createNewCharacter } from "../utils/characterHelpers";

const STORAGE_KEY = "dnd-characters-store";
const OLD_CHARACTER_KEY = "dnd-character";
const OLD_NOTES_KEY = "dnd-notes";

export const useCharacterManager = () => {
  const [store, setStore] = useState<CharactersStore>(() => {
    try {
      // Check for new multi-character store
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as CharactersStore;
        // Ensure we have at least one character
        if (parsed.characters.length === 0) {
          const newChar = createNewCharacter();
          return {
            characters: [{ character: newChar, notes: [] }],
            activeCharacterId: newChar.id,
          };
        }
        return parsed;
      }

      // Migration: Check for old single-character storage
      const oldCharacter = localStorage.getItem(OLD_CHARACTER_KEY);
      const oldNotes = localStorage.getItem(OLD_NOTES_KEY);

      if (oldCharacter) {
        console.log("Migrating from old storage format...");
        const character = JSON.parse(oldCharacter) as Character;
        const notes: Note[] = oldNotes ? JSON.parse(oldNotes) : [];

        // Ensure the old character has an id
        if (!character.id) {
          character.id = crypto.randomUUID();
        }

        const migratedStore: CharactersStore = {
          characters: [{ character, notes }],
          activeCharacterId: character.id,
        };

        // Clean up old storage
        localStorage.removeItem(OLD_CHARACTER_KEY);
        localStorage.removeItem(OLD_NOTES_KEY);

        return migratedStore;
      }
    } catch (error) {
      console.error("Error loading characters:", error);
    }

    // Create initial character
    const newChar = createNewCharacter();
    return {
      characters: [{ character: newChar, notes: [] }],
      activeCharacterId: newChar.id,
    };
  });

  // Save to localStorage whenever store changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch (error) {
      console.error("Error saving characters:", error);
    }
  }, [store]);

  const getActiveCharacterData = (): CharacterData | null => {
    if (!store.activeCharacterId) return null;
    return (
      store.characters.find(
        (cd) => cd.character.id === store.activeCharacterId
      ) || null
    );
  };

  const getActiveCharacter = (): Character | null => {
    const data = getActiveCharacterData();
    return data ? data.character : null;
  };

  const getActiveNotes = (): Note[] => {
    const data = getActiveCharacterData();
    return data ? data.notes : [];
  };

  const updateCharacter = (updates: Partial<Character>) => {
    setStore((prev) => ({
      ...prev,
      characters: prev.characters.map((cd) =>
        cd.character.id === prev.activeCharacterId
          ? { ...cd, character: { ...cd.character, ...updates } }
          : cd
      ),
    }));
  };

  const setCharacter = (
    updater: Character | ((prev: Character) => Character)
  ) => {
    setStore((prev) => ({
      ...prev,
      characters: prev.characters.map((cd) => {
        if (cd.character.id === prev.activeCharacterId) {
          const newCharacter =
            typeof updater === "function" ? updater(cd.character) : updater;
          return { ...cd, character: newCharacter };
        }
        return cd;
      }),
    }));
  };

  const updateNotes = (notes: Note[]) => {
    setStore((prev) => ({
      ...prev,
      characters: prev.characters.map((cd) =>
        cd.character.id === prev.activeCharacterId ? { ...cd, notes } : cd
      ),
    }));
  };

  const createCharacter = () => {
    const newChar = createNewCharacter();
    setStore((prev) => ({
      characters: [...prev.characters, { character: newChar, notes: [] }],
      activeCharacterId: newChar.id,
    }));
    return newChar;
  };

  const switchCharacter = (characterId: string) => {
    setStore((prev) => ({
      ...prev,
      activeCharacterId: characterId,
    }));
  };

  const deleteCharacter = (characterId: string) => {
    setStore((prev) => {
      const newCharacters = prev.characters.filter(
        (cd) => cd.character.id !== characterId
      );

      // If we deleted the active character, switch to another one
      let newActiveId = prev.activeCharacterId;
      if (characterId === prev.activeCharacterId) {
        newActiveId =
          newCharacters.length > 0 ? newCharacters[0].character.id : null;
      }

      // If no characters left, create a new one
      if (newCharacters.length === 0) {
        const newChar = createNewCharacter();
        return {
          characters: [{ character: newChar, notes: [] }],
          activeCharacterId: newChar.id,
        };
      }

      return {
        characters: newCharacters,
        activeCharacterId: newActiveId,
      };
    });
  };

  const getAllCharacters = (): Character[] => {
    return store.characters.map((cd) => cd.character);
  };

  return {
    character: getActiveCharacter(),
    notes: getActiveNotes(),
    allCharacters: getAllCharacters(),
    updateCharacter,
    setCharacter,
    updateNotes,
    createCharacter,
    switchCharacter,
    deleteCharacter,
  };
};
