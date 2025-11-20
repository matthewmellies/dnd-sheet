import type { Character } from "../types/character";

export const calculateModifier = (score: number): number => {
  return Math.floor((score - 10) / 2);
};

export const formatModifier = (modifier: number): string => {
  return modifier >= 0 ? `+${modifier}` : `${modifier}`;
};

export const calculateProficiencyBonus = (level: number): number => {
  return Math.ceil(level / 4) + 1;
};

export const getSkillModifier = (
  character: Character,
  skill: keyof Character["skills"],
  abilityScore: keyof Character["abilityScores"]
): number => {
  const baseModifier = calculateModifier(character.abilityScores[abilityScore]);
  const proficiency = character.skills[skill] ? character.proficiencyBonus : 0;
  return baseModifier + proficiency;
};

export const getSavingThrowModifier = (
  character: Character,
  ability: keyof Character["abilityScores"]
): number => {
  const baseModifier = calculateModifier(character.abilityScores[ability]);
  const proficiency = character.savingThrows[ability]
    ? character.proficiencyBonus
    : 0;
  return baseModifier + proficiency;
};

export const createNewCharacter = (): Character => {
  return {
    id: crypto.randomUUID(),
    name: "New Character",
    class: "Fighter",
    level: 1,
    race: "Human",
    background: "Folk Hero",
    alignment: "Neutral Good",
    experiencePoints: 0,
    abilityScores: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
    },
    proficiencyBonus: 2,
    skills: {
      acrobatics: false,
      animalHandling: false,
      arcana: false,
      athletics: false,
      deception: false,
      history: false,
      insight: false,
      intimidation: false,
      investigation: false,
      medicine: false,
      nature: false,
      perception: false,
      performance: false,
      persuasion: false,
      religion: false,
      sleightOfHand: false,
      stealth: false,
      survival: false,
    },
    savingThrows: {
      strength: false,
      dexterity: false,
      constitution: false,
      intelligence: false,
      wisdom: false,
      charisma: false,
    },
    hitPoints: {
      current: 10,
      max: 10,
      temporary: 0,
    },
    armorClass: 10,
    speed: 30,
    initiative: 0,
    spells: [],
    spellSlots: {
      level1: { max: 0, used: 0 },
      level2: { max: 0, used: 0 },
      level3: { max: 0, used: 0 },
      level4: { max: 0, used: 0 },
      level5: { max: 0, used: 0 },
      level6: { max: 0, used: 0 },
      level7: { max: 0, used: 0 },
      level8: { max: 0, used: 0 },
      level9: { max: 0, used: 0 },
    },
    equipment: [],
    features: [],
    notes: "",
  };
};
