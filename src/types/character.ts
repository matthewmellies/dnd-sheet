// Character and D&D 5e API Type Definitions

export interface Character {
  id: string;
  name: string;
  class: string;
  level: number;
  race: string;
  background: string;
  alignment: string;
  experiencePoints: number;
  abilityScores: AbilityScores;
  proficiencyBonus: number;
  skills: Skills;
  savingThrows: SavingThrows;
  hitPoints: HitPoints;
  armorClass: number;
  speed: number;
  initiative: number;
  spells: Spell[];
  spellSlots: SpellSlots;
  equipment: Equipment[];
  features: string[];
  notes: string;
}

export interface SpellSlots {
  level1: { max: number; used: number };
  level2: { max: number; used: number };
  level3: { max: number; used: number };
  level4: { max: number; used: number };
  level5: { max: number; used: number };
  level6: { max: number; used: number };
  level7: { max: number; used: number };
  level8: { max: number; used: number };
  level9: { max: number; used: number };
}

export interface AbilityScores {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface Skills {
  acrobatics: boolean;
  animalHandling: boolean;
  arcana: boolean;
  athletics: boolean;
  deception: boolean;
  history: boolean;
  insight: boolean;
  intimidation: boolean;
  investigation: boolean;
  medicine: boolean;
  nature: boolean;
  perception: boolean;
  performance: boolean;
  persuasion: boolean;
  religion: boolean;
  sleightOfHand: boolean;
  stealth: boolean;
  survival: boolean;
}

export interface SavingThrows {
  strength: boolean;
  dexterity: boolean;
  constitution: boolean;
  intelligence: boolean;
  wisdom: boolean;
  charisma: boolean;
}

export interface HitPoints {
  current: number;
  max: number;
  temporary: number;
}

export interface Spell {
  index: string;
  name: string;
  level: number;
  school: string;
  castingTime: string;
  range: string;
  components: string[];
  duration: string;
  description: string[];
  ritual?: boolean;
  isPrepared?: boolean;
}

export interface Equipment {
  index: string;
  name: string;
  equipmentCategory: string;
  quantity: number;
  weight?: number;
}

// API Response Types
export interface APISpell {
  index: string;
  name: string;
  level: number;
  school: {
    name: string;
    index: string;
  };
  casting_time: string;
  range: string;
  components: string[];
  duration: string;
  desc: string[];
  higher_level?: string[];
  classes: Array<{
    index: string;
    name: string;
  }>;
}

export interface APIEquipment {
  index: string;
  name: string;
  equipment_category: {
    index: string;
    name: string;
  };
  weight?: number;
  cost?: {
    quantity: number;
    unit: string;
  };
}

export interface APIListResponse {
  count: number;
  results: Array<{
    index: string;
    name: string;
    url: string;
  }>;
}

export interface APIClass {
  index: string;
  name: string;
  hit_die: number;
  proficiencies: Array<{
    index: string;
    name: string;
  }>;
  saving_throws: Array<{
    index: string;
    name: string;
  }>;
  spellcasting?: {
    spellcasting_ability: {
      name: string;
    };
  };
}

export interface APIRace {
  index: string;
  name: string;
  speed: number;
  ability_bonuses: Array<{
    ability_score: {
      index: string;
      name: string;
    };
    bonus: number;
  }>;
  size: string;
  languages: Array<{
    index: string;
    name: string;
  }>;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  isExpanded: boolean;
  color: string;
}

export interface CharacterData {
  character: Character;
  notes: Note[];
  mischiefTracker?: number;
}

export interface CharactersStore {
  characters: CharacterData[];
  activeCharacterId: string | null;
}
