import { useState, useEffect } from "react";
import { calculateProficiencyBonus } from "./utils/characterHelpers";
import { useCharacterManager } from "./hooks/useCharacterManager";
import { CharacterInfo } from "./components/CharacterInfo";
import { AbilityScoresComponent } from "./components/AbilityScores";
import { Skills } from "./components/Skills";
import { CombatStats } from "./components/CombatStats";
import { Spells } from "./components/Spells";
import { EquipmentComponent } from "./components/Equipment";
import { DiceRoller } from "./components/DiceRoller";
import { MonsterLookup } from "./components/MonsterLookup";
import { SpellAbilityLookup } from "./components/SpellAbilityLookup";
import { CritFumble } from "./components/CritFumble";
import { WildMagic } from "./components/WildMagic";
import { Notes } from "./components/Notes";
import { CharacterSelector } from "./components/CharacterSelector";
import "./App.css";

function App() {
  const {
    character,
    notes,
    allCharacters,
    updateCharacter,
    setCharacter,
    updateNotes,
    createCharacter,
    switchCharacter,
    deleteCharacter,
  } = useCharacterManager();

  const [activeView, setActiveView] = useState<
    | "character"
    | "dice"
    | "monsters"
    | "spells-lookup"
    | "crit-fumble"
    | "wild-magic"
    | "notes"
  >("character");
  const [menuOpen, setMenuOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<"stats" | "spells" | "equipment">(
    "stats"
  );

  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["combat", "abilities", "skills"])
  );

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  // Update proficiency bonus when level changes
  useEffect(() => {
    if (character && character.level) {
      const newProficiency = calculateProficiencyBonus(character.level);
      if (newProficiency !== character.proficiencyBonus) {
        setCharacter((prev) => ({
          ...prev,
          proficiencyBonus: newProficiency,
        }));
      }
    }
  }, [character?.level]); // Only depend on level

  return (
    <div className="app">
      <header className="app-header">
        <button
          className="hamburger-menu"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <h1>5E Shit</h1>

        {activeView === "character" && (
          <CharacterSelector
            characters={allCharacters}
            activeCharacter={character}
            onSwitch={switchCharacter}
            onCreate={createCharacter}
            onDelete={deleteCharacter}
          />
        )}
      </header>

      {menuOpen && (
        <>
          <div className="menu-overlay" onClick={() => setMenuOpen(false)} />
          <nav className="side-menu">
            <button
              className="menu-close"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              ✕
            </button>
            <button
              className={`menu-item ${
                activeView === "character" ? "active" : ""
              }`}
              onClick={() => {
                setActiveView("character");
                setMenuOpen(false);
              }}
            >
              Character Sheet
            </button>
            <button
              className={`menu-item ${activeView === "dice" ? "active" : ""}`}
              onClick={() => {
                setActiveView("dice");
                setMenuOpen(false);
              }}
            >
              Dice Roller
            </button>
            <button
              className={`menu-item ${
                activeView === "monsters" ? "active" : ""
              }`}
              onClick={() => {
                setActiveView("monsters");
                setMenuOpen(false);
              }}
            >
              Monster Lookup
            </button>
            <button
              className={`menu-item ${
                activeView === "spells-lookup" ? "active" : ""
              }`}
              onClick={() => {
                setActiveView("spells-lookup");
                setMenuOpen(false);
              }}
            >
              Spell Lookup
            </button>
            <button
              className={`menu-item ${
                activeView === "crit-fumble" ? "active" : ""
              }`}
              onClick={() => {
                setActiveView("crit-fumble");
                setMenuOpen(false);
              }}
            >
              Crit/Fumble
            </button>
            <button
              className={`menu-item ${
                activeView === "wild-magic" ? "active" : ""
              }`}
              onClick={() => {
                setActiveView("wild-magic");
                setMenuOpen(false);
              }}
            >
              Wild Magic
            </button>
            <button
              className={`menu-item ${activeView === "notes" ? "active" : ""}`}
              onClick={() => {
                setActiveView("notes");
                setMenuOpen(false);
              }}
            >
              Notes
            </button>
          </nav>
        </>
      )}

      <main className="app-main">
        {activeView === "character" ? (
          character ? (
            <>
              <CharacterInfo character={character} onUpdate={updateCharacter} />

              <nav className="tab-nav">
                <button
                  className={activeTab === "stats" ? "active" : ""}
                  onClick={() => setActiveTab("stats")}
                >
                  Stats & Skills
                </button>
                <button
                  className={activeTab === "spells" ? "active" : ""}
                  onClick={() => setActiveTab("spells")}
                >
                  Spells
                </button>
                <button
                  className={activeTab === "equipment" ? "active" : ""}
                  onClick={() => setActiveTab("equipment")}
                >
                  Equipment
                </button>
              </nav>

              <div className="tab-content">
                {activeTab === "stats" && (
                  <>
                    <section className="accordion-section">
                      <div
                        className="accordion-header"
                        onClick={() => toggleSection("combat")}
                      >
                        <h2>
                          <span className="expand-icon">
                            {expandedSections.has("combat") ? "▼" : "▶"}
                          </span>
                          Combat Stats
                        </h2>
                      </div>
                      {expandedSections.has("combat") && (
                        <div className="accordion-content">
                          <CombatStats
                            character={character}
                            onUpdate={updateCharacter}
                          />
                        </div>
                      )}
                    </section>

                    <section className="accordion-section">
                      <div
                        className="accordion-header"
                        onClick={() => toggleSection("abilities")}
                      >
                        <h2>
                          <span className="expand-icon">
                            {expandedSections.has("abilities") ? "▼" : "▶"}
                          </span>
                          Ability Scores
                        </h2>
                      </div>
                      {expandedSections.has("abilities") && (
                        <div className="accordion-content">
                          <AbilityScoresComponent
                            character={character}
                            onUpdate={updateCharacter}
                          />
                        </div>
                      )}
                    </section>

                    <section className="accordion-section">
                      <div
                        className="accordion-header"
                        onClick={() => toggleSection("skills")}
                      >
                        <h2>
                          <span className="expand-icon">
                            {expandedSections.has("skills") ? "▼" : "▶"}
                          </span>
                          Skills
                        </h2>
                      </div>
                      {expandedSections.has("skills") && (
                        <div className="accordion-content">
                          <Skills
                            character={character}
                            onUpdate={updateCharacter}
                          />
                        </div>
                      )}
                    </section>
                  </>
                )}

                {activeTab === "spells" && (
                  <Spells character={character} onUpdate={updateCharacter} />
                )}

                {activeTab === "equipment" && (
                  <EquipmentComponent
                    character={character}
                    onUpdate={updateCharacter}
                  />
                )}
              </div>
            </>
          ) : (
            <div>Loading character...</div>
          )
        ) : activeView === "dice" ? (
          <DiceRoller />
        ) : activeView === "monsters" ? (
          <MonsterLookup />
        ) : activeView === "spells-lookup" ? (
          <SpellAbilityLookup />
        ) : activeView === "crit-fumble" ? (
          <CritFumble />
        ) : activeView === "wild-magic" ? (
          <WildMagic />
        ) : (
          <Notes notes={notes} onUpdateNotes={updateNotes} />
        )}
      </main>

      <footer className="app-footer">
        <p>
          Data powered by{" "}
          <a
            href="https://www.dnd5eapi.co/"
            target="_blank"
            rel="noopener noreferrer"
          >
            D&D 5e API
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
