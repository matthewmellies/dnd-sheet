import React from "react";
import type { Character } from "../types/character";
import { getSkillModifier, formatModifier } from "../utils/characterHelpers";

interface SkillsProps {
  character: Character;
  onUpdate: (updates: Partial<Character>) => void;
}

export const Skills: React.FC<SkillsProps> = ({ character, onUpdate }) => {
  const toggleSkill = (skill: keyof Character["skills"]) => {
    onUpdate({
      skills: {
        ...character.skills,
        [skill]: !character.skills[skill],
      },
    });
  };

  const skillsList: Array<{
    key: keyof Character["skills"];
    label: string;
    ability: keyof Character["abilityScores"];
  }> = [
    { key: "acrobatics", label: "Acrobatics", ability: "dexterity" },
    { key: "animalHandling", label: "Animal Handling", ability: "wisdom" },
    { key: "arcana", label: "Arcana", ability: "intelligence" },
    { key: "athletics", label: "Athletics", ability: "strength" },
    { key: "deception", label: "Deception", ability: "charisma" },
    { key: "history", label: "History", ability: "intelligence" },
    { key: "insight", label: "Insight", ability: "wisdom" },
    { key: "intimidation", label: "Intimidation", ability: "charisma" },
    { key: "investigation", label: "Investigation", ability: "intelligence" },
    { key: "medicine", label: "Medicine", ability: "wisdom" },
    { key: "nature", label: "Nature", ability: "intelligence" },
    { key: "perception", label: "Perception", ability: "wisdom" },
    { key: "performance", label: "Performance", ability: "charisma" },
    { key: "persuasion", label: "Persuasion", ability: "charisma" },
    { key: "religion", label: "Religion", ability: "intelligence" },
    { key: "sleightOfHand", label: "Sleight of Hand", ability: "dexterity" },
    { key: "stealth", label: "Stealth", ability: "dexterity" },
    { key: "survival", label: "Survival", ability: "wisdom" },
  ];

  return (
    <div className="skills">
      <div className="skills-list">
        {skillsList.map(({ key, label, ability }) => {
          const modifier = getSkillModifier(character, key, ability);
          const isProficient = character.skills[key];

          return (
            <div
              key={key}
              className={`skill-item ${isProficient ? "proficient" : ""}`}
            >
              <label>
                <input
                  type="checkbox"
                  checked={isProficient}
                  onChange={() => toggleSkill(key)}
                />
                <span className="skill-modifier">
                  {formatModifier(modifier)}
                </span>
                <span className="skill-name">{label}</span>
                <span className="skill-ability">
                  ({ability.slice(0, 3).toUpperCase()})
                </span>
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};
