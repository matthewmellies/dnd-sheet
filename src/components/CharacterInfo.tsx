import React from "react";
import type { Character } from "../types/character";

interface CharacterInfoProps {
  character: Character;
  onUpdate: (updates: Partial<Character>) => void;
}

export const CharacterInfo: React.FC<CharacterInfoProps> = ({
  character,
  onUpdate,
}) => {
  return (
    <div className="character-info">
      <div className="info-row">
        <div className="info-field">
          <label htmlFor="char-name">Character Name</label>
          <input
            id="char-name"
            type="text"
            value={character.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            placeholder="Character Name"
          />
        </div>
      </div>

      <div className="info-row">
        <div className="info-field">
          <label htmlFor="char-class">Class</label>
          <input
            id="char-class"
            type="text"
            value={character.class}
            onChange={(e) => onUpdate({ class: e.target.value })}
            placeholder="Class"
          />
        </div>

        <div className="info-field">
          <label htmlFor="char-level">Level</label>
          <input
            id="char-level"
            type="number"
            value={character.level}
            onChange={(e) => onUpdate({ level: parseInt(e.target.value) || 1 })}
            min="1"
            max="20"
          />
        </div>

        <div className="info-field">
          <label htmlFor="char-race">Race</label>
          <input
            id="char-race"
            type="text"
            value={character.race}
            onChange={(e) => onUpdate({ race: e.target.value })}
            placeholder="Race"
          />
        </div>
      </div>

      <div className="info-row">
        <div className="info-field">
          <label htmlFor="char-background">Background</label>
          <input
            id="char-background"
            type="text"
            value={character.background}
            onChange={(e) => onUpdate({ background: e.target.value })}
            placeholder="Background"
          />
        </div>

        <div className="info-field">
          <label htmlFor="char-alignment">Alignment</label>
          <input
            id="char-alignment"
            type="text"
            value={character.alignment}
            onChange={(e) => onUpdate({ alignment: e.target.value })}
            placeholder="Alignment"
          />
        </div>
      </div>

      <div className="info-row">
        <div className="info-field">
          <label htmlFor="char-xp">Experience Points</label>
          <input
            id="char-xp"
            type="number"
            value={character.experiencePoints}
            onChange={(e) =>
              onUpdate({ experiencePoints: parseInt(e.target.value) || 0 })
            }
            min="0"
          />
        </div>
      </div>
    </div>
  );
};
