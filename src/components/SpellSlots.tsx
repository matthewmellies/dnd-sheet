import React, { useRef, useEffect, useCallback } from "react";
import type {
  Character,
  SpellSlots as SpellSlotsType,
} from "../types/character";

interface SpellSlotsProps {
  character: Character;
  onUpdate: (updates: Partial<Character>) => void;
}

export const SpellSlots: React.FC<SpellSlotsProps> = ({
  character,
  onUpdate,
}) => {
  // Use a ref to always have the latest character data
  const characterRef = useRef(character);
  const updatingRef = useRef(false);

  useEffect(() => {
    characterRef.current = character;
  }, [character]);
  // Initialize spell slots if they don't exist (for backwards compatibility)
  if (!character.spellSlots) {
    onUpdate({
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
    });
    return null;
  }

  const updateSlotMax = useCallback(
    (level: keyof SpellSlotsType, newMax: number) => {
      if (updatingRef.current) return;
      updatingRef.current = true;

      const slots = characterRef.current.spellSlots[level];
      onUpdate({
        spellSlots: {
          ...characterRef.current.spellSlots,
          [level]: {
            max: Math.max(0, newMax),
            used: Math.min(slots.used, newMax),
          },
        },
      });

      // Reset the updating flag after a short delay
      setTimeout(() => {
        updatingRef.current = false;
      }, 50);
    },
    [onUpdate]
  );

  const updateSlotUsed = (level: keyof SpellSlotsType, used: number) => {
    const maxSlots = characterRef.current.spellSlots[level].max;
    onUpdate({
      spellSlots: {
        ...characterRef.current.spellSlots,
        [level]: {
          ...characterRef.current.spellSlots[level],
          used: Math.max(0, Math.min(used, maxSlots)),
        },
      },
    });
  };

  const toggleSlot = (level: keyof SpellSlotsType, index: number) => {
    const slots = characterRef.current.spellSlots[level];
    const availableCount = slots.max - slots.used;

    // If clicking an available slot (use it)
    if (index < availableCount) {
      // Use slots up to and including this index
      updateSlotUsed(level, slots.max - index);
    } else {
      // If clicking a used slot (restore it)
      // Restore slots after this index
      updateSlotUsed(level, index - availableCount);
    }
  };

  const longRest = () => {
    const resetSlots: SpellSlotsType = {
      level1: { ...characterRef.current.spellSlots.level1, used: 0 },
      level2: { ...characterRef.current.spellSlots.level2, used: 0 },
      level3: { ...characterRef.current.spellSlots.level3, used: 0 },
      level4: { ...characterRef.current.spellSlots.level4, used: 0 },
      level5: { ...characterRef.current.spellSlots.level5, used: 0 },
      level6: { ...characterRef.current.spellSlots.level6, used: 0 },
      level7: { ...characterRef.current.spellSlots.level7, used: 0 },
      level8: { ...characterRef.current.spellSlots.level8, used: 0 },
      level9: { ...characterRef.current.spellSlots.level9, used: 0 },
    };
    onUpdate({ spellSlots: resetSlots });
  };

  const spellLevels: Array<{ key: keyof SpellSlotsType; label: string }> = [
    { key: "level1", label: "1st" },
    { key: "level2", label: "2nd" },
    { key: "level3", label: "3rd" },
    { key: "level4", label: "4th" },
    { key: "level5", label: "5th" },
    { key: "level6", label: "6th" },
    { key: "level7", label: "7th" },
    { key: "level8", label: "8th" },
    { key: "level9", label: "9th" },
  ];

  return (
    <div className="spell-slots">
      <div className="spell-slots-header">
        <button
          onClick={longRest}
          className="btn-long-rest"
          title="Reset all spell slots"
        >
          Long Rest
        </button>
      </div>

      <div className="spell-slots-grid">
        {spellLevels.map(({ key, label }) => {
          const slots = character.spellSlots[key];

          return (
            <div key={key} className="spell-slot-level">
              <div className="slot-level-header">
                <span className="slot-level-label">{label}</span>
                <div className="slot-controls">
                  {slots.max > 0 && (
                    <button
                      onClick={() => {
                        const currentMax =
                          characterRef.current.spellSlots[key].max;
                        updateSlotMax(key, currentMax - 1);
                      }}
                      className="btn-slot-adjust"
                      title="Decrease max slots"
                    >
                      −
                    </button>
                  )}
                  <span className="slot-count">
                    {slots.max > 0
                      ? `${slots.max - slots.used}/${slots.max}`
                      : "0"}
                  </span>
                  <button
                    onClick={() => {
                      const currentMax =
                        characterRef.current.spellSlots[key].max;
                      updateSlotMax(key, currentMax + 1);
                    }}
                    className="btn-slot-adjust"
                    title="Increase max slots"
                  >
                    +
                  </button>
                </div>
              </div>

              {slots.max > 0 && (
                <div className="slot-bubbles">
                  {Array.from({ length: slots.max }).map((_, index) => (
                    <button
                      key={index}
                      className={`slot-bubble ${
                        index < slots.max - slots.used ? "available" : "used"
                      }`}
                      onClick={() => toggleSlot(key, index)}
                      title={
                        index < slots.max - slots.used
                          ? "Use slot"
                          : "Restore slot"
                      }
                    >
                      {index < slots.max - slots.used ? "○" : "●"}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
