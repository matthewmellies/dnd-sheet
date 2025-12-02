import React, { useState, useEffect, useRef } from "react";

interface Monster {
  index: string;
  name: string;
  size: string;
  type: string;
  alignment: string;
  armor_class: Array<{ type: string; value: number }>;
  hit_points: number;
  hit_dice: string;
  speed: { [key: string]: string };
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  proficiencies?: Array<{ proficiency: { name: string }; value: number }>;
  damage_vulnerabilities?: string[];
  damage_resistances?: string[];
  damage_immunities?: string[];
  condition_immunities?: Array<{ name: string }>;
  senses?: { [key: string]: string };
  languages?: string;
  challenge_rating: number;
  xp?: number;
  special_abilities?: Array<{ name: string; desc: string }>;
  actions?: Array<{
    name: string;
    desc: string;
    attack_bonus?: number;
    damage?: Array<{ damage_dice: string; damage_type: { name: string } }>;
  }>;
  legendary_actions?: Array<{ name: string; desc: string }>;
}

interface MonsterSearchResult {
  index: string;
  name: string;
  url: string;
}

export const MonsterLookup: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<MonsterSearchResult[]>([]);
  const [selectedMonster, setSelectedMonster] = useState<Monster | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedCR, setExpandedCR] = useState<Set<string>>(new Set());
  const [allMonsters, setAllMonsters] = useState<Monster[]>([]);
  const [loadingAll, setLoadingAll] = useState(false);
  const debounceTimerRef = useRef<number | null>(null);

  const calculateModifier = (score: number): string => {
    const mod = Math.floor((score - 10) / 2);
    return mod >= 0 ? `+${mod}` : `${mod}`;
  };

  // Debounced search
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (searchTerm.trim()) {
      debounceTimerRef.current = setTimeout(async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch("https://www.dnd5eapi.co/api/monsters");
          const data = await response.json();
          const filtered = data.results.filter((monster: MonsterSearchResult) =>
            monster.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
          setSearchResults(filtered);
        } catch (err) {
          setError("Failed to search monsters");
          console.error(err);
        } finally {
          setLoading(false);
        }
      }, 500);
    } else {
      setSearchResults([]);
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchTerm]);

  const loadMonsterDetails = async (monsterIndex: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://www.dnd5eapi.co/api/monsters/${monsterIndex}`
      );
      const data = await response.json();
      setSelectedMonster(data);
      setSearchTerm("");
      setSearchResults([]);
    } catch (err) {
      setError("Failed to load monster details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadAllMonsters = async () => {
    setLoadingAll(true);
    setError(null);
    try {
      const response = await fetch("https://www.dnd5eapi.co/api/monsters");
      const data = await response.json();

      // Load monsters in batches to avoid overwhelming the API
      const batchSize = 20;
      const monsters: Monster[] = [];

      for (let i = 0; i < data.results.length; i += batchSize) {
        const batch = data.results.slice(i, i + batchSize);
        const batchPromises = batch.map((monster: MonsterSearchResult) =>
          fetch(`https://www.dnd5eapi.co/api/monsters/${monster.index}`)
            .then((res) => res.json())
            .catch((err) => {
              console.error(`Failed to load ${monster.name}:`, err);
              return null;
            })
        );

        const batchResults = await Promise.all(batchPromises);
        monsters.push(...batchResults.filter((m): m is Monster => m !== null));

        // Small delay between batches to be nice to the API
        if (i + batchSize < data.results.length) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }

      setAllMonsters(monsters);
    } catch (err) {
      setError("Failed to load monsters");
      console.error(err);
    } finally {
      setLoadingAll(false);
    }
  };

  const toggleCR = (crRange: string) => {
    setExpandedCR((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(crRange)) {
        newSet.delete(crRange);
      } else {
        newSet.add(crRange);
      }
      return newSet;
    });
  };

  const getCRRanges = () => {
    const ranges = ["0-1"];
    for (let i = 1; i <= 30; i++) {
      ranges.push(`${i}-${i + 1}`);
    }
    return ranges;
  };

  const getMonstersByCRRange = (range: string): Monster[] => {
    if (range === "0-1") {
      return allMonsters.filter((m) => m.challenge_rating < 1);
    }
    const [min, max] = range.split("-").map(Number);
    return allMonsters.filter(
      (m) => m.challenge_rating >= min && m.challenge_rating < max
    );
  };

  return (
    <div className="monster-lookup">
      <h1>Monster Lookup</h1>

      <div className="monster-search">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for monsters..."
          className="monster-search-input"
          autoFocus
        />
        {loading && <span className="search-loading">Searching...</span>}
      </div>

      {error && <div className="error">{error}</div>}

      {allMonsters.length === 0 && !loadingAll && (
        <button onClick={loadAllMonsters} className="btn-load-all">
          Browse All Monsters by CR
        </button>
      )}

      {loadingAll && (
        <div className="loading-message">Loading all monsters...</div>
      )}

      {searchResults.length > 0 && (
        <div className="monster-search-results">
          {searchResults.map((result) => (
            <button
              key={result.index}
              className="monster-result-item"
              onClick={() => loadMonsterDetails(result.index)}
            >
              {result.name}
            </button>
          ))}
        </div>
      )}

      {searchTerm.trim() && !loading && searchResults.length === 0 && (
        <div className="no-results">No monsters found</div>
      )}

      {allMonsters.length > 0 && !selectedMonster && (
        <div className="monsters-by-cr">
          <h2>Monsters by Challenge Rating</h2>
          {getCRRanges().map((range) => {
            const monstersInRange = getMonstersByCRRange(range);
            if (monstersInRange.length === 0) return null;

            const isExpanded = expandedCR.has(range);
            const label =
              range === "0-1" ? "CR 0-1 (Less than 1)" : `CR ${range}`;

            return (
              <div key={range} className="cr-group">
                <div className="cr-header" onClick={() => toggleCR(range)}>
                  <h3>
                    <span className="expand-icon">
                      {isExpanded ? "▼" : "▶"}
                    </span>
                    {label}
                    <span className="monster-count">
                      ({monstersInRange.length})
                    </span>
                  </h3>
                </div>
                {isExpanded && (
                  <div className="cr-content">
                    {monstersInRange.map((monster) => (
                      <button
                        key={monster.index}
                        className="monster-cr-item"
                        onClick={() => setSelectedMonster(monster)}
                      >
                        <span className="monster-name">{monster.name}</span>
                        <span className="monster-cr">
                          CR {monster.challenge_rating}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {selectedMonster && (
        <div className="monster-details">
          <div className="monster-header">
            <h2>{selectedMonster.name}</h2>
            <button
              onClick={() => setSelectedMonster(null)}
              className="btn-close-monster"
            >
              ✕
            </button>
          </div>

          <div className="monster-info">
            <p className="monster-type">
              {selectedMonster.size} {selectedMonster.type},{" "}
              {selectedMonster.alignment}
            </p>
          </div>

          <div className="monster-stats-section">
            <div className="monster-stat">
              <strong>Armor Class</strong>
              <span>
                {selectedMonster.armor_class[0]?.value || "N/A"}
                {selectedMonster.armor_class[0]?.type &&
                  ` (${selectedMonster.armor_class[0].type})`}
              </span>
            </div>
            <div className="monster-stat">
              <strong>Hit Points</strong>
              <span>
                {selectedMonster.hit_points} ({selectedMonster.hit_dice})
              </span>
            </div>
            <div className="monster-stat">
              <strong>Speed</strong>
              <span>
                {Object.entries(selectedMonster.speed)
                  .map(([key, value]) => `${key} ${value}`)
                  .join(", ")}
              </span>
            </div>
          </div>

          <div className="monster-abilities">
            <div className="ability-score">
              <strong>STR</strong>
              <span>
                {selectedMonster.strength} (
                {calculateModifier(selectedMonster.strength)})
              </span>
            </div>
            <div className="ability-score">
              <strong>DEX</strong>
              <span>
                {selectedMonster.dexterity} (
                {calculateModifier(selectedMonster.dexterity)})
              </span>
            </div>
            <div className="ability-score">
              <strong>CON</strong>
              <span>
                {selectedMonster.constitution} (
                {calculateModifier(selectedMonster.constitution)})
              </span>
            </div>
            <div className="ability-score">
              <strong>INT</strong>
              <span>
                {selectedMonster.intelligence} (
                {calculateModifier(selectedMonster.intelligence)})
              </span>
            </div>
            <div className="ability-score">
              <strong>WIS</strong>
              <span>
                {selectedMonster.wisdom} (
                {calculateModifier(selectedMonster.wisdom)})
              </span>
            </div>
            <div className="ability-score">
              <strong>CHA</strong>
              <span>
                {selectedMonster.charisma} (
                {calculateModifier(selectedMonster.charisma)})
              </span>
            </div>
          </div>

          {selectedMonster.proficiencies &&
            selectedMonster.proficiencies.length > 0 && (
              <div className="monster-section">
                <strong>Skills</strong>
                <p>
                  {selectedMonster.proficiencies
                    .map(
                      (prof) =>
                        `${prof.proficiency.name.replace("Skill: ", "")} ${
                          prof.value >= 0 ? "+" : ""
                        }${prof.value}`
                    )
                    .join(", ")}
                </p>
              </div>
            )}

          {selectedMonster.damage_resistances &&
            selectedMonster.damage_resistances.length > 0 && (
              <div className="monster-section">
                <strong>Damage Resistances</strong>
                <p>{selectedMonster.damage_resistances.join(", ")}</p>
              </div>
            )}

          {selectedMonster.damage_immunities &&
            selectedMonster.damage_immunities.length > 0 && (
              <div className="monster-section">
                <strong>Damage Immunities</strong>
                <p>{selectedMonster.damage_immunities.join(", ")}</p>
              </div>
            )}

          {selectedMonster.condition_immunities &&
            selectedMonster.condition_immunities.length > 0 && (
              <div className="monster-section">
                <strong>Condition Immunities</strong>
                <p>
                  {selectedMonster.condition_immunities
                    .map((ci) => ci.name)
                    .join(", ")}
                </p>
              </div>
            )}

          {selectedMonster.senses && (
            <div className="monster-section">
              <strong>Senses</strong>
              <p>
                {Object.entries(selectedMonster.senses)
                  .map(([key, value]) => `${key} ${value}`)
                  .join(", ")}
              </p>
            </div>
          )}

          {selectedMonster.languages && (
            <div className="monster-section">
              <strong>Languages</strong>
              <p>{selectedMonster.languages}</p>
            </div>
          )}

          <div className="monster-section">
            <strong>Challenge</strong>
            <p>
              {selectedMonster.challenge_rating} (
              {selectedMonster.xp?.toLocaleString()} XP)
            </p>
          </div>

          {selectedMonster.special_abilities &&
            selectedMonster.special_abilities.length > 0 && (
              <div className="monster-section">
                <h3>Special Abilities</h3>
                {selectedMonster.special_abilities.map((ability, index) => (
                  <div key={index} className="monster-ability">
                    <strong>{ability.name}.</strong> {ability.desc}
                  </div>
                ))}
              </div>
            )}

          {selectedMonster.actions && selectedMonster.actions.length > 0 && (
            <div className="monster-section">
              <h3>Actions</h3>
              {selectedMonster.actions.map((action, index) => (
                <div key={index} className="monster-ability">
                  <strong>{action.name}.</strong> {action.desc}
                </div>
              ))}
            </div>
          )}

          {selectedMonster.legendary_actions &&
            selectedMonster.legendary_actions.length > 0 && (
              <div className="monster-section">
                <h3>Legendary Actions</h3>
                {selectedMonster.legendary_actions.map((action, index) => (
                  <div key={index} className="monster-ability">
                    <strong>{action.name}.</strong> {action.desc}
                  </div>
                ))}
              </div>
            )}
        </div>
      )}
    </div>
  );
};
