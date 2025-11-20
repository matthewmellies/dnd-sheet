import React, { useState } from "react";

// Wild Magic Surge table from D&D 5e Player's Handbook
const WILD_MAGIC_SURGES: { [key: string]: string } = {
  "01-02":
    "Roll on this table at the start of each of your turns for the next minute, ignoring this result on subsequent rolls.",
  "03-04":
    "For the next minute, you can see any invisible creature if you have line of sight to it.",
  "05-06":
    "A modron chosen and controlled by the DM appears in an unoccupied space within 5 feet of you, then disappears 1 minute later.",
  "07-08": "You cast Fireball as a 3rd-level spell centered on yourself.",
  "09-10": "You cast Magic Missile as a 5th-level spell.",
  "11-12":
    "Roll a d10. Your height changes by a number of inches equal to the roll. If the roll is odd, you shrink. If the roll is even, you grow.",
  "13-14": "You cast Confusion centered on yourself.",
  "15-16":
    "For the next minute, you regain 5 hit points at the start of each of your turns.",
  "17-18":
    "You grow a long beard made of feathers that remains until you sneeze, at which point the feathers explode out from your face.",
  "19-20": "You cast Grease centered on yourself.",
  "21-22":
    "Creatures have disadvantage on saving throws against the next spell you cast in the next minute that involves a saving throw.",
  "23-24":
    "Your skin turns a vibrant shade of blue. A Remove Curse spell can end this effect.",
  "25-26":
    "An eye appears on your forehead for the next minute. During that time, you have advantage on Wisdom (Perception) checks that rely on sight.",
  "27-28":
    "For the next minute, all your spells with a casting time of 1 action have a casting time of 1 bonus action.",
  "29-30":
    "You teleport up to 60 feet to an unoccupied space of your choice that you can see.",
  "31-32":
    "You are transported to the Astral Plane until the end of your next turn, after which time you return to the space you previously occupied or the nearest unoccupied space if that space is occupied.",
  "33-34":
    "Maximize the damage of the next damaging spell you cast within the next minute.",
  "35-36":
    "Roll a d10. Your age changes by a number of years equal to the roll. If the roll is odd, you get younger (minimum 1 year old). If the roll is even, you get older.",
  "37-38":
    "1d6 flumphs controlled by the DM appear in unoccupied spaces within 60 feet of you and are frightened of you. They vanish after 1 minute.",
  "39-40": "You regain 2d10 hit points.",
  "41-42":
    "You turn into a potted plant until the start of your next turn. While a plant, you are incapacitated and have vulnerability to all damage. If you drop to 0 hit points, your pot breaks, and your form reverts.",
  "43-44":
    "For the next minute, you can teleport up to 20 feet as a bonus action on each of your turns.",
  "45-46": "You cast Levitate on yourself.",
  "47-48":
    "A unicorn controlled by the DM appears in a space within 5 feet of you, then disappears 1 minute later.",
  "49-50":
    "You can't speak for the next minute. Whenever you try, pink bubbles float out of your mouth.",
  "51-52":
    "A spectral shield hovers near you for the next minute, granting you a +2 bonus to AC and immunity to Magic Missile.",
  "53-54":
    "You are immune to being intoxicated by alcohol for the next 5d6 days.",
  "55-56": "Your hair falls out but grows back within 24 hours.",
  "57-58":
    "For the next minute, any flammable object you touch that isn't being worn or carried by another creature bursts into flame.",
  "59-60": "You regain your lowest-level expended spell slot.",
  "61-62": "For the next minute, you must shout when you speak.",
  "63-64": "You cast Fog Cloud centered on yourself.",
  "65-66":
    "Up to three creatures you choose within 30 feet of you take 4d10 lightning damage.",
  "67-68":
    "You are frightened by the nearest creature until the end of your next turn.",
  "69-70":
    "Each creature within 30 feet of you becomes invisible for the next minute. The invisibility ends on a creature when it attacks or casts a spell.",
  "71-72": "You gain resistance to all damage for the next minute.",
  "73-74":
    "A random creature within 60 feet of you becomes poisoned for 1d4 hours.",
  "75-76":
    "You glow with bright light in a 30-foot radius for the next minute. Any creature that ends its turn within 5 feet of you is blinded until the end of its next turn.",
  "77-78":
    "You cast Polymorph on yourself. If you fail the saving throw, you turn into a sheep for the spell's duration.",
  "79-80":
    "Illusory butterflies and flower petals flutter in the air within 10 feet of you for the next minute.",
  "81-82": "You can take one additional action immediately.",
  "83-84":
    "Each creature within 30 feet of you takes 1d10 necrotic damage. You regain hit points equal to the sum of the necrotic damage dealt.",
  "85-86": "You cast Mirror Image.",
  "87-88": "You cast Fly on a random creature within 60 feet of you.",
  "89-90":
    "You become invisible for the next minute. During that time, other creatures can't hear you. The invisibility ends if you attack or cast a spell.",
  "91-92":
    "If you die within the next minute, you immediately come back to life as if by the Reincarnate spell.",
  "93-94": "Your size increases by one size category for the next minute.",
  "95-96":
    "You and all creatures within 30 feet of you gain vulnerability to piercing damage for the next minute.",
  "97-98": "You are surrounded by faint, ethereal music for the next minute.",
  "99-00": "You regain all expended sorcery points.",
};

export const WildMagic: React.FC = () => {
  const [currentSurge, setCurrentSurge] = useState<{
    roll: string;
    text: string;
  } | null>(null);

  const rollWildMagic = () => {
    // Roll d100 (1-100)
    const roll = Math.floor(Math.random() * 100) + 1;

    // Format as 01-100 string
    const rollString = roll.toString().padStart(2, "0");

    // Find the matching range in the table
    let matchedEffect = "";
    let matchedRange = "";

    for (const [range, effect] of Object.entries(WILD_MAGIC_SURGES)) {
      const [min, max] = range.split("-").map(Number);
      if (roll >= min && roll <= max) {
        matchedEffect = effect;
        matchedRange = range;
        break;
      }
    }

    setCurrentSurge({
      roll: `${rollString} (${matchedRange})`,
      text: matchedEffect,
    });
  };

  const clearSurge = () => {
    setCurrentSurge(null);
  };

  return (
    <div className="wild-magic">
      <h1>Wild Magic Surge</h1>
      <p className="wild-magic-description">
        Roll on the Wild Magic Surge table to determine the random magical
        effect!
      </p>

      <div className="wild-magic-button-container">
        <button onClick={rollWildMagic} className="btn-wild-magic">
          ✨ Roll Wild Magic Surge ✨
        </button>
      </div>

      {currentSurge && (
        <div className="surge-result">
          <div className="surge-header">
            <div>
              <h3>✨ Wild Magic Surge!</h3>
              <p className="surge-roll">d100 Roll: {currentSurge.roll}</p>
            </div>
            <button onClick={clearSurge} className="btn-clear-surge">
              ✕
            </button>
          </div>
          <p className="surge-text">{currentSurge.text}</p>
        </div>
      )}

      <div className="wild-magic-info">
        <h3>📖 About Wild Magic</h3>
        <p>
          When a Wild Magic Sorcerer casts a leveled spell, the DM can have them
          roll a d20. If they roll a 1, they must roll on the Wild Magic Surge
          table (d100) to determine what random magical effect occurs.
        </p>
        <p>
          This table contains {Object.keys(WILD_MAGIC_SURGES).length} different
          effects from the Player's Handbook, ranging from beneficial to
          catastrophic!
        </p>
      </div>
    </div>
  );
};
