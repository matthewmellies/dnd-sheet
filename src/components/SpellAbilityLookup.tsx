import React, { useState, useEffect, useRef } from "react";

interface Spell {
  index: string;
  name: string;
  level: number;
  school: { name: string; index: string };
  casting_time: string;
  range: string;
  components: string[];
  duration: string;
  concentration: boolean;
  ritual: boolean;
  desc: string[];
  higher_level?: string[];
  material?: string;
  attack_type?: string;
  damage?: {
    damage_type?: { name: string };
    damage_at_slot_level?: { [key: string]: string };
    damage_at_character_level?: { [key: string]: string };
  };
  dc?: {
    dc_type: { name: string };
    dc_success: string;
  };
  area_of_effect?: {
    type: string;
    size: number;
  };
  classes: Array<{ name: string }>;
}

interface SearchResult {
  index: string;
  name: string;
  url: string;
}

export const SpellAbilityLookup: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedSpell, setSelectedSpell] = useState<Spell | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allSpells, setAllSpells] = useState<SearchResult[]>([]);
  const [showAllSpells, setShowAllSpells] = useState(false);
  const [expandedLevels, setExpandedLevels] = useState<Set<number>>(new Set());
  const debounceTimerRef = useRef<number | null>(null);

  // Load all spells on mount
  useEffect(() => {
    const loadAllSpells = async () => {
      try {
        const response = await fetch("https://www.dnd5eapi.co/api/spells");
        const data = await response.json();
        setAllSpells(data.results);
      } catch (err) {
        console.error("Failed to load all spells:", err);
      }
    };
    loadAllSpells();
  }, []);

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
          const response = await fetch("https://www.dnd5eapi.co/api/spells");
          const data = await response.json();
          const filtered = data.results.filter((spell: SearchResult) =>
            spell.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
          setSearchResults(filtered);
        } catch (err) {
          setError("Failed to search spells");
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

  const loadSpellDetails = async (spellIndex: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://www.dnd5eapi.co/api/spells/${spellIndex}`
      );
      const data = await response.json();
      setSelectedSpell(data);
      setSearchTerm("");
      setSearchResults([]);
    } catch (err) {
      setError("Failed to load spell details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getSpellLevelText = (level: number): string => {
    if (level === 0) return "Cantrip";
    const suffix =
      level === 1 ? "st" : level === 2 ? "nd" : level === 3 ? "rd" : "th";
    return `${level}${suffix}-level`;
  };

  const [spellsByLevel, setSpellsByLevel] = useState<{
    [key: number]: SearchResult[];
  }>({});
  const [loadingLevels, setLoadingLevels] = useState(false);

  // Load spell levels when All Spells section is opened
  useEffect(() => {
    if (showAllSpells && Object.keys(spellsByLevel).length === 0) {
      const loadSpellLevels = async () => {
        setLoadingLevels(true);
        try {
          const organized: { [key: number]: SearchResult[] } = {};

          // Query spells by level (0-9)
          const levelPromises = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(
            async (level) => {
              try {
                const response = await fetch(
                  `https://www.dnd5eapi.co/api/spells?level=${level}`
                );
                const data = await response.json();
                return { level, spells: data.results || [] };
              } catch {
                return { level, spells: [] };
              }
            }
          );

          const results = await Promise.all(levelPromises);

          results.forEach(({ level, spells }) => {
            organized[level] = spells.sort((a: SearchResult, b: SearchResult) =>
              a.name.localeCompare(b.name)
            );
          });

          setSpellsByLevel(organized);
        } catch (err) {
          console.error("Failed to organize spells by level:", err);
        } finally {
          setLoadingLevels(false);
        }
      };

      loadSpellLevels();
    }
  }, [showAllSpells, spellsByLevel]);

  const toggleLevel = (level: number) => {
    setExpandedLevels((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(level)) {
        newSet.delete(level);
      } else {
        newSet.add(level);
      }
      return newSet;
    });
  };

  return (
    <div className="spell-ability-lookup">
      <h1>Spell & Ability Lookup</h1>

      <div className="spell-lookup-search">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for spells..."
          className="spell-lookup-search-input"
          autoFocus
        />
        {loading && <span className="search-loading">Searching...</span>}
      </div>

      {error && <div className="error">{error}</div>}

      {searchResults.length > 0 && (
        <div className="spell-lookup-search-results">
          {searchResults.map((result) => (
            <button
              key={result.index}
              className="spell-lookup-result-item"
              onClick={() => loadSpellDetails(result.index)}
            >
              {result.name}
            </button>
          ))}
        </div>
      )}

      {searchTerm.trim() && !loading && searchResults.length === 0 && (
        <div className="no-results">No spells found</div>
      )}

      {!selectedSpell && (
        <section className="accordion-section">
          <div
            className="accordion-header"
            onClick={() => setShowAllSpells(!showAllSpells)}
          >
            <h2>
              <span className="expand-icon">{showAllSpells ? "▼" : "▶"}</span>
              All Spells
            </h2>
          </div>
          {showAllSpells && (
            <div className="accordion-content all-spells-container">
              {loadingLevels ? (
                <div
                  style={{
                    padding: "2rem",
                    textAlign: "center",
                    color: "var(--text-secondary)",
                  }}
                >
                  Loading spells...
                </div>
              ) : (
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((level) => {
                  const spells = spellsByLevel[level] || [];
                  if (spells.length === 0) return null;

                  return (
                    <div key={level} className="spell-level-group">
                      <div
                        className="spell-level-header"
                        onClick={() => toggleLevel(level)}
                      >
                        <h3>
                          <span className="expand-icon-small">
                            {expandedLevels.has(level) ? "▼" : "▶"}
                          </span>
                          {level === 0 ? "Cantrips" : `Level ${level}`} (
                          {spells.length})
                        </h3>
                      </div>
                      {expandedLevels.has(level) && (
                        <div className="spell-list">
                          {spells.map((spell) => (
                            <button
                              key={spell.index}
                              className="spell-list-item"
                              onClick={() => loadSpellDetails(spell.index)}
                            >
                              {spell.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </section>
      )}

      {selectedSpell && (
        <div className="spell-details">
          <div className="spell-header">
            <div>
              <h2>{selectedSpell.name}</h2>
              <p className="spell-level-school">
                {getSpellLevelText(selectedSpell.level)}{" "}
                {selectedSpell.school.name}
                {selectedSpell.ritual && " (ritual)"}
              </p>
            </div>
            <button
              onClick={() => setSelectedSpell(null)}
              className="btn-close-spell"
            >
              ✕
            </button>
          </div>

          <div className="spell-stats-grid">
            <div className="spell-stat">
              <strong>Casting Time</strong>
              <span>{selectedSpell.casting_time}</span>
            </div>
            <div className="spell-stat">
              <strong>Range</strong>
              <span>{selectedSpell.range}</span>
            </div>
            <div className="spell-stat">
              <strong>Components</strong>
              <span>
                {selectedSpell.components.join(", ")}
                {selectedSpell.material && ` (${selectedSpell.material})`}
              </span>
            </div>
            <div className="spell-stat">
              <strong>Duration</strong>
              <span>
                {selectedSpell.concentration && "Concentration, "}
                {selectedSpell.duration}
              </span>
            </div>
          </div>

          <div className="spell-description">
            {selectedSpell.desc.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {selectedSpell.higher_level &&
            selectedSpell.higher_level.length > 0 && (
              <div className="spell-higher-level">
                <strong>At Higher Levels. </strong>
                {selectedSpell.higher_level.join(" ")}
              </div>
            )}

          {selectedSpell.damage && (
            <div className="spell-section">
              <strong>Damage</strong>
              {selectedSpell.damage.damage_type && (
                <p>Type: {selectedSpell.damage.damage_type.name}</p>
              )}
              {selectedSpell.damage.damage_at_slot_level && (
                <div className="damage-table">
                  <strong>Damage at Spell Slot Level:</strong>
                  <ul>
                    {Object.entries(
                      selectedSpell.damage.damage_at_slot_level
                    ).map(([level, damage]) => (
                      <li key={level}>
                        Level {level}: {damage}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {selectedSpell.damage.damage_at_character_level && (
                <div className="damage-table">
                  <strong>Damage at Character Level:</strong>
                  <ul>
                    {Object.entries(
                      selectedSpell.damage.damage_at_character_level
                    ).map(([level, damage]) => (
                      <li key={level}>
                        Level {level}: {damage}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {selectedSpell.dc && (
            <div className="spell-section">
              <strong>Saving Throw</strong>
              <p>
                {selectedSpell.dc.dc_type.name} save (
                {selectedSpell.dc.dc_success})
              </p>
            </div>
          )}

          {selectedSpell.area_of_effect && (
            <div className="spell-section">
              <strong>Area of Effect</strong>
              <p>
                {selectedSpell.area_of_effect.size}-foot{" "}
                {selectedSpell.area_of_effect.type}
              </p>
            </div>
          )}

          {selectedSpell.attack_type && (
            <div className="spell-section">
              <strong>Attack Type</strong>
              <p>{selectedSpell.attack_type}</p>
            </div>
          )}

          <div className="spell-section">
            <strong>Classes</strong>
            <p>{selectedSpell.classes.map((c) => c.name).join(", ")}</p>
          </div>
        </div>
      )}
    </div>
  );
};
