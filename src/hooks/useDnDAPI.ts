import { useState } from "react";
import type {
  APISpell,
  APIEquipment,
  APIListResponse,
  APIClass,
  APIRace,
} from "../types/character";

const API_BASE_URL = "https://www.dnd5eapi.co/api/2014";

// Generic fetch hook for D&D 5e API
export function useDnDAPI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFromAPI = async <T>(endpoint: string): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      setLoading(false);
      return data as T;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      setLoading(false);
      return null;
    }
  };

  // Specific API methods
  const getSpells = async (classIndex?: string) => {
    const endpoint = classIndex ? `/classes/${classIndex}/spells` : "/spells";
    return fetchFromAPI<APIListResponse>(endpoint);
  };

  const getSpellDetails = async (spellIndex: string) => {
    return fetchFromAPI<APISpell>(`/spells/${spellIndex}`);
  };

  const getEquipment = async () => {
    return fetchFromAPI<APIListResponse>("/equipment");
  };

  const getEquipmentDetails = async (equipmentIndex: string) => {
    return fetchFromAPI<APIEquipment>(`/equipment/${equipmentIndex}`);
  };

  const getClasses = async () => {
    return fetchFromAPI<APIListResponse>("/classes");
  };

  const getClassDetails = async (classIndex: string) => {
    return fetchFromAPI<APIClass>(`/classes/${classIndex}`);
  };

  const getRaces = async () => {
    return fetchFromAPI<APIListResponse>("/races");
  };

  const getRaceDetails = async (raceIndex: string) => {
    return fetchFromAPI<APIRace>(`/races/${raceIndex}`);
  };

  const searchSpells = async (name: string) => {
    const spells = await getSpells();
    if (!spells) return [];

    return spells.results.filter((spell) =>
      spell.name.toLowerCase().includes(name.toLowerCase())
    );
  };

  return {
    loading,
    error,
    getSpells,
    getSpellDetails,
    getEquipment,
    getEquipmentDetails,
    getClasses,
    getClassDetails,
    getRaces,
    getRaceDetails,
    searchSpells,
  };
}
