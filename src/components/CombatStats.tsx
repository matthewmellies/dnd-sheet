import React from "react";
import type { Character } from "../types/character";
import { calculateModifier, formatModifier } from "../utils/characterHelpers";

interface CombatStatsProps {
  character: Character;
  onUpdate: (updates: Partial<Character>) => void;
}

export const CombatStats: React.FC<CombatStatsProps> = ({
  character,
  onUpdate,
}) => {
  const initiativeModifier = calculateModifier(
    character.abilityScores.dexterity
  );

  return (
    <div className="combat-stats">
      <div className="combat-grid">
        <div className="stat-box">
          <label htmlFor="armor-class">Armor Class</label>
          <input
            id="armor-class"
            type="number"
            value={character.armorClass}
            onChange={(e) =>
              onUpdate({ armorClass: parseInt(e.target.value) || 10 })
            }
            min="0"
          />
        </div>

        <div className="stat-box">
          <label>Initiative</label>
          <div className="stat-display">
            {formatModifier(initiativeModifier)}
          </div>
        </div>

        <div className="stat-box">
          <label htmlFor="speed">Speed</label>
          <input
            id="speed"
            type="number"
            value={character.speed}
            onChange={(e) =>
              onUpdate({ speed: parseInt(e.target.value) || 30 })
            }
            min="0"
          />
        </div>

        <div className="stat-box">
          <label>Proficiency Bonus</label>
          <div className="stat-display">
            {formatModifier(character.proficiencyBonus)}
          </div>
        </div>
      </div>

      <div className="hit-points">
        <h3>Hit Points</h3>
        <div className="hp-grid">
          <div className="hp-field">
            <label htmlFor="hp-current">Current HP</label>
            <input
              id="hp-current"
              type="number"
              value={character.hitPoints.current}
              onChange={(e) =>
                onUpdate({
                  hitPoints: {
                    ...character.hitPoints,
                    current: parseInt(e.target.value) || 0,
                  },
                })
              }
              min="0"
              max={character.hitPoints.max}
            />
          </div>

          <div className="hp-field">
            <label htmlFor="hp-max">Max HP</label>
            <input
              id="hp-max"
              type="number"
              value={character.hitPoints.max}
              onChange={(e) =>
                onUpdate({
                  hitPoints: {
                    ...character.hitPoints,
                    max: parseInt(e.target.value) || 1,
                  },
                })
              }
              min="1"
            />
          </div>

          <div className="hp-field">
            <label htmlFor="hp-temp">Temp HP</label>
            <input
              id="hp-temp"
              type="number"
              value={character.hitPoints.temporary}
              onChange={(e) =>
                onUpdate({
                  hitPoints: {
                    ...character.hitPoints,
                    temporary: parseInt(e.target.value) || 0,
                  },
                })
              }
              min="0"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
