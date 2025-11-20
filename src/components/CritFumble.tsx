import React, { useState } from "react";

const CRIT_EFFECTS: string[] = [
  "Nothing special happens on this critical hit. (Roll all of the attack's damage dice twice and add them together. Then add any relevant modifiers as normal.)",
  "Right Between The Scales: This attack ignores damage resistance.",
  "Get Out: The target is knocked backwards 5'.",
  "Stay Down: The target is knocked prone.",
  "Sudden Urge To Retreat: The target becomes Frightened of the attacker until the end of the target's next turn.",
  "Bewilderment: The target may not use its reaction until after the end of its next turn.",
  "Right Place, Right Time: Immediately following this attack, any friendly creatures that can see the target may use their reaction to make one weapon attack against the target.",
  "That's Gotta Hurt: The attack inflicts a Lingering Injury (DMG 272).",
  "Kick 'Em While They're Down: The attacker may use their bonus action to make one additional attack against the target.",
  "Confounded: The target becomes Stunned until the end of its next turn.",
  "Vulnerable: All subsequent attacks against the target are made with advantage until the beginning of the target's next turn.",
  "Knockout: The target falls Unconscious until another creature rouses it, an attack hits it, or three rounds have passed, whichever happens first.",
  "That'll Leave A Mark: The attack inflicts a Lingering Injury (DMG 272).",
  "Max Damage: Treat all damage dice rolled for this critical hit as though they produced their maximum possible value.",
  "Grievous Wound: Instead of doubling the number of damage dice, triple them. The attack inflicts a Lingering Injury (DMG 272).",
  "Mortal Wound: The target must succeed on a DC 18 Constitution save or die. If they succeed, instead of doubling the number of damage dice, quadruple them. The attack inflicts a Lingering Injury (DMG 272).",
];

const FUMBLE_EFFECTS: string[] = [
  "Darn Thing: If the fumbler wields a melee weapon, it gets lodged in the ground, an enemy's armor, or something similar. Freeing the weapon requires succeeding on a Strength (Athletics) check as a bonus action. The check's DC is equal to 8 + the fumbler's Strength modifier. (No additional effect for ranged weapons)",
  "Pratfall: The fumbler falls prone and cannot move for the rest of their turn.",
  "Friendly Fire: The fumbler rolls damage and applies it to a friendly creature within their weapon's reach or range. If there is no such creature, the fumbler applies that damage to themselves.",
  "An Opening: Attacks against the fumbler are made with advantage until the beginning of the fumbler's next turn.",
  "Whoops: The fumbler's weapon flies d20 feet in a random direction.",
  "Fatigue: The fumbler takes one level of exhaustion.",
  "The Last Straw: The fumbler's weapon breaks, unless it is an artifact. (Whether it can be repaired is left to the GM's discretion.)",
  "Twisted Ankle: The fumbler's move speed is halved until they take a short or long rest.",
  "Something In My Eye: The fumbler is Blinded until the end of their next turn.",
  "Bite Your Tongue: The fumbler cannot speak until the end of their next turn.",
  "Wrong Place, Wrong Time: The enemy nearest to the fumbler may use its reaction to make one weapon attack against the fumbler.",
  "Gobsmacked: The fumbler drops their weapon and is stunned until the end of their next turn.",
  "Butterfingers: The fumbler has disadvantage on all attack rolls, ability checks, skill checks, or saving throws they make before the end of their next turn.",
  "Self-Inflicted Wound: The fumbler rolls damage and applies it to themselves.",
  "Calamitous Flub: Roll all the attack's damage dice twice and add them together, then add any relevant modifiers as normal. The fumbler applies this damage to themselves. They then fall Unconscious until another creature rouses them, an attack hits them, or three rounds have passed, whichever happens first.",
  "A collected skeleton key falls to the floor and shatters, disappearing in a cloud of black smoke. It appears you'll have to find it again.",
];

// Probability that nothing special happens on a fumble (0-1 scale)
const FUMBLE_NOTHING_CHANCE = 0.1; // 10% chance

export const CritFumble: React.FC = () => {
  const [currentEffect, setCurrentEffect] = useState<{
    type: "crit" | "fumble" | null;
    text: string;
  } | null>(null);

  const rollCrit = () => {
    const randomIndex = Math.floor(Math.random() * CRIT_EFFECTS.length);
    setCurrentEffect({
      type: "crit",
      text: CRIT_EFFECTS[randomIndex],
    });
  };

  const rollFumble = () => {
    // Check if nothing special happens
    if (Math.random() < FUMBLE_NOTHING_CHANCE) {
      setCurrentEffect({
        type: "fumble",
        text: "Nothing Special Happens",
      });
    } else {
      // Roll for actual fumble effect
      const randomIndex = Math.floor(Math.random() * FUMBLE_EFFECTS.length);
      setCurrentEffect({
        type: "fumble",
        text: FUMBLE_EFFECTS[randomIndex],
      });
    }
  };

  const clearEffect = () => {
    setCurrentEffect(null);
  };

  return (
    <div className="crit-fumble">
      <h1>Critical Hits & Fumbles</h1>
      <p className="crit-fumble-description">
        Roll for additional effects on critical hits (nat 20) or fumbles (nat 1)
      </p>

      <div className="crit-fumble-buttons">
        <button onClick={rollCrit} className="btn-crit">
          🎯 Critical Hit
        </button>
        <button onClick={rollFumble} className="btn-fumble">
          💥 Fumble
        </button>
      </div>

      {currentEffect && (
        <div className={`effect-result ${currentEffect.type}`}>
          <div className="effect-header">
            <h3>
              {currentEffect.type === "crit"
                ? "🎯 Critical Effect!"
                : "💥 Fumble Effect!"}
            </h3>
            <button onClick={clearEffect} className="btn-clear-effect">
              ✕
            </button>
          </div>
          <p className="effect-text">{currentEffect.text}</p>
        </div>
      )}

      <div className="crit-fumble-info">
        <div className="info-section">
          <h3>📊 Critical Hits ({CRIT_EFFECTS.length} effects)</h3>
          <p>
            When you roll a natural 20 on an attack roll, click the Critical Hit
            button for an additional effect!
          </p>
        </div>
        <div className="info-section">
          <h3>📊 Fumbles ({FUMBLE_EFFECTS.length} effects)</h3>
          <p>
            When you roll a natural 1 on an attack roll, click the Fumble button
            to see what goes wrong!
          </p>
        </div>
      </div>
    </div>
  );
};
