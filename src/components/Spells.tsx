import React, { useState, useEffect, useRef } from "react";
import type { Character, Spell } from "../types/character";
import { useDnDAPI } from "../hooks/useDnDAPI";
import { SpellSlots } from "./SpellSlots";

interface SpellsProps {
  character: Character;
  onUpdate: (updates: Partial<Character>) => void;
}

export const Spells: React.FC<SpellsProps> = ({ character, onUpdate }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [searchResults, setSearchResults] = useState<
    Array<{ index: string; name: string }>
  >([]);
  const [expandedSpells, setExpandedSpells] = useState<Set<string>>(new Set());
  const [showSpellSlots, setShowSpellSlots] = useState(true);
  const api = useDnDAPI();
  const debounceTimerRef = useRef<number | null>(null);

  const toggleExpanded = (spellIndex: string) => {
    setExpandedSpells((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(spellIndex)) {
        newSet.delete(spellIndex);
      } else {
        newSet.add(spellIndex);
      }
      return newSet;
    });
  };

  // Debounced search effect
  useEffect(() => {
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Only search if there's a search term and search is visible
    if (searchTerm.trim() && showSearch) {
      debounceTimerRef.current = setTimeout(async () => {
        const results = await api.searchSpells(searchTerm);
        setSearchResults(results || []);
      }, 500); // 500ms delay
    } else {
      setSearchResults([]);
    }

    // Cleanup on unmount
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchTerm, showSearch]);

  const addSpell = async (spellIndex: string) => {
    const spellDetails = await api.getSpellDetails(spellIndex);
    if (spellDetails) {
      const newSpell: Spell = {
        index: spellDetails.index,
        name: spellDetails.name,
        level: spellDetails.level,
        school: spellDetails.school.name,
        castingTime: spellDetails.casting_time,
        range: spellDetails.range,
        components: spellDetails.components,
        duration: spellDetails.duration,
        description: spellDetails.desc,
        isPrepared: false,
      };

      onUpdate({
        spells: [...character.spells, newSpell],
      });

      setShowSearch(false);
      setSearchTerm("");
      setSearchResults([]);
    }
  };

  const removeSpell = (spellIndex: string) => {
    onUpdate({
      spells: character.spells.filter((spell) => spell.index !== spellIndex),
    });
  };

  const togglePrepared = (spellIndex: string) => {
    onUpdate({
      spells: character.spells.map((spell) =>
        spell.index === spellIndex
          ? { ...spell, isPrepared: !spell.isPrepared }
          : spell
      ),
    });
  };

  const toggleSearch = () => {
    if (showSearch) {
      // Clear search when closing
      setSearchTerm("");
      setSearchResults([]);
    }
    setShowSearch(!showSearch);
  };

  return (
    <div className="spells">
      <div className="spells-header">
        <h2>Spells</h2>
        <button onClick={toggleSearch} className="btn-add">
          {showSearch ? "Cancel" : "+ Add Spell"}
        </button>
      </div>

      <section className="accordion-section">
        <div
          className="accordion-header"
          onClick={() => setShowSpellSlots(!showSpellSlots)}
        >
          <h2>
            <span className="expand-icon">{showSpellSlots ? "▼" : "▶"}</span>
            Spell Slots
          </h2>
        </div>
        {showSpellSlots && (
          <div className="accordion-content">
            <SpellSlots character={character} onUpdate={onUpdate} />
          </div>
        )}
      </section>

      {showSearch && (
        <div className="spell-search">
          <div className="search-input-group">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Start typing to search spells..."
              autoFocus
            />
            {api.loading && (
              <span className="search-loading">Searching...</span>
            )}
          </div>

          {api.error && <div className="error">{api.error}</div>}

          {searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map((result) => (
                <div key={result.index} className="search-result-item">
                  <span>{result.name}</span>
                  <button onClick={() => addSpell(result.index)}>Add</button>
                </div>
              ))}
            </div>
          )}

          {searchTerm.trim() && !api.loading && searchResults.length === 0 && (
            <div className="no-results">No spells found</div>
          )}
        </div>
      )}

      <div className="spells-list">
        {character.spells.length === 0 ? (
          <p className="empty-message">
            No spells added yet. Click "Add Spell" to search and add spells.
          </p>
        ) : (
          <>
            {/* Group spells by level */}
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((level) => {
              const spellsAtLevel = character.spells.filter(
                (spell) => spell.level === level
              );

              if (spellsAtLevel.length === 0) return null;

              return (
                <div key={level} className="spell-level-group">
                  <h3 className="spell-level-header">
                    {level === 0 ? "Cantrips" : `Level ${level} Spells`}
                    <span className="spell-count">
                      ({spellsAtLevel.length})
                    </span>
                  </h3>

                  {spellsAtLevel.map((spell) => {
                    const isExpanded = expandedSpells.has(spell.index);

                    return (
                      <div
                        key={spell.index}
                        className={`spell-card ${
                          spell.isPrepared ? "prepared" : ""
                        } ${isExpanded ? "expanded" : "collapsed"}`}
                      >
                        <div
                          className="spell-header"
                          onClick={() => toggleExpanded(spell.index)}
                        >
                          <div className="spell-title">
                            <span className="expand-icon">
                              {isExpanded ? "▼" : "▶"}
                            </span>
                            <h4>{spell.name}</h4>
                            <span className="spell-school">
                              ({spell.school})
                            </span>
                          </div>
                          <div
                            className="spell-actions"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => togglePrepared(spell.index)}
                              className="btn-prepare"
                              title={spell.isPrepared ? "Unprepare" : "Prepare"}
                            >
                              {spell.isPrepared ? "★" : "☆"}
                            </button>
                            <button
                              onClick={() => removeSpell(spell.index)}
                              className="btn-remove"
                            >
                              ×
                            </button>
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="spell-details">
                            <div className="spell-info">
                              <strong>Casting Time:</strong> {spell.castingTime}
                            </div>
                            <div className="spell-info">
                              <strong>Range:</strong> {spell.range}
                            </div>
                            <div className="spell-info">
                              <strong>Components:</strong>{" "}
                              {spell.components.join(", ")}
                            </div>
                            <div className="spell-info">
                              <strong>Duration:</strong> {spell.duration}
                            </div>
                            <div className="spell-description">
                              {spell.description.map((paragraph, index) => (
                                <p key={index}>{paragraph}</p>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};
