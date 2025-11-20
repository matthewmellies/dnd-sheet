import React from "react";
import type { Character, AbilityScores } from "../types/character";
import {
  calculateModifier,
  formatModifier,
  getSavingThrowModifier,
} from "../utils/characterHelpers";

interface AbilityScoresProps {
  character: Character;
  onUpdate: (updates: Partial<Character>) => void;
}

export const AbilityScoresComponent: React.FC<AbilityScoresProps> = ({
  character,
  onUpdate,
}) => {
  const updateAbilityScore = (ability: keyof AbilityScores, value: number) => {
    onUpdate({
      abilityScores: {
        ...character.abilityScores,
        [ability]: value,
      },
    });
  };

  const toggleSavingThrow = (ability: keyof AbilityScores) => {
    onUpdate({
      savingThrows: {
        ...character.savingThrows,
        [ability]: !character.savingThrows[ability],
      },
    });
  };

  const abilities: Array<{ key: keyof AbilityScores; label: string }> = [
    { key: "strength", label: "STR" },
    { key: "dexterity", label: "DEX" },
    { key: "constitution", label: "CON" },
    { key: "intelligence", label: "INT" },
    { key: "wisdom", label: "WIS" },
    { key: "charisma", label: "CHA" },
  ];

  return (
    <div className="ability-scores">
      <div className="abilities-grid">
        {abilities.map(({ key, label }) => {
          const score = character.abilityScores[key];
          const modifier = calculateModifier(score);
          const savingThrow = getSavingThrowModifier(character, key);

          return (
            <div key={key} className="ability-card">
              <div className="ability-label">{label}</div>
              <div className="ability-modifier">{formatModifier(modifier)}</div>
              <input
                type="number"
                className="ability-score"
                value={score}
                onChange={(e) =>
                  updateAbilityScore(key, parseInt(e.target.value) || 10)
                }
                min="1"
                max="30"
              />
              <div className="saving-throw">
                <label>
                  <input
                    type="checkbox"
                    checked={character.savingThrows[key]}
                    onChange={() => toggleSavingThrow(key)}
                  />
                  <span className="save-modifier">
                    {formatModifier(savingThrow)}
                  </span>
                  <span className="save-label">Save</span>
                </label>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
