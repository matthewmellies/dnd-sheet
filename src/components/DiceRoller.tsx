import React, { useState } from "react";

interface DiceResult {
  rolls: number[];
  total: number;
  type: string;
  modifier: number;
  sides: number;
}

export const DiceRoller: React.FC = () => {
  const [results, setResults] = useState<DiceResult[]>([]);
  const [modifier, setModifier] = useState(0);

  const rollDice = (sides: number, count: number = 1) => {
    const rolls: number[] = [];
    for (let i = 0; i < count; i++) {
      rolls.push(Math.floor(Math.random() * sides) + 1);
    }

    const total = rolls.reduce((sum, roll) => sum + roll, 0) + modifier;
    const result: DiceResult = {
      rolls,
      total,
      type: `${count}d${sides}${
        modifier !== 0 ? ` ${modifier >= 0 ? "+" : ""}${modifier}` : ""
      }`,
      modifier,
      sides,
    };

    setResults([result, ...results].slice(0, 10)); // Keep last 10 rolls
  };

  const rollCustom = (diceString: string) => {
    // Parse strings like "2d6+3" or "1d20-2"
    const match = diceString.match(/(\d+)d(\d+)([+-]\d+)?/i);
    if (match) {
      const count = parseInt(match[1]);
      const sides = parseInt(match[2]);
      const mod = match[3] ? parseInt(match[3]) : 0;

      const rolls: number[] = [];
      for (let i = 0; i < count; i++) {
        rolls.push(Math.floor(Math.random() * sides) + 1);
      }

      const total = rolls.reduce((sum, roll) => sum + roll, 0) + mod;
      const result: DiceResult = {
        rolls,
        total,
        type: diceString,
        modifier: mod,
        sides,
      };

      setResults([result, ...results].slice(0, 10));
    }
  };

  const clearHistory = () => {
    setResults([]);
  };

  const diceTypes = [
    { sides: 4, label: "d4" },
    { sides: 6, label: "d6" },
    { sides: 8, label: "d8" },
    { sides: 10, label: "d10" },
    { sides: 12, label: "d12" },
    { sides: 20, label: "d20" },
    { sides: 100, label: "d100" },
  ];

  return (
    <div className="dice-roller">
      <h2>Dice Roller</h2>

      <div className="dice-controls">
        <div className="modifier-control">
          <label htmlFor="modifier">Modifier:</label>
          <input
            id="modifier"
            type="number"
            value={modifier}
            onChange={(e) => setModifier(parseInt(e.target.value) || 0)}
            className="modifier-input"
          />
        </div>

        <div className="dice-buttons">
          {diceTypes.map(({ sides, label }) => (
            <button
              key={sides}
              onClick={() => rollDice(sides, 1)}
              className="dice-btn"
            >
              {label}
            </button>
          ))}
        </div>

        <div className="custom-roll">
          <input
            type="text"
            placeholder="e.g., 2d6+3"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                rollCustom(e.currentTarget.value);
                e.currentTarget.value = "";
              }
            }}
            className="custom-roll-input"
          />
          <button
            onClick={(e) => {
              const input = e.currentTarget
                .previousElementSibling as HTMLInputElement;
              rollCustom(input.value);
              input.value = "";
            }}
            className="btn-roll-custom"
          >
            Roll Custom
          </button>
        </div>
      </div>

      {results.length > 0 && (
        <div className="dice-results">
          <div className="results-header">
            <h3>Roll History</h3>
            <button onClick={clearHistory} className="btn-clear">
              Clear
            </button>
          </div>

          <div className="results-list">
            {results.map((result, index) => (
              <div key={index} className="result-item">
                <div className="result-type">{result.type}</div>
                <div className="result-details">
                  <span className="result-rolls">
                    [
                    {result.rolls.map((roll, i) => {
                      const isCriticalHigh = roll === result.sides;
                      const isCriticalLow = roll === 1;
                      return (
                        <span
                          key={i}
                          className={
                            isCriticalHigh
                              ? "roll-critical-high"
                              : isCriticalLow
                              ? "roll-critical-low"
                              : ""
                          }
                        >
                          {roll}
                          {i < result.rolls.length - 1 && ", "}
                        </span>
                      );
                    })}
                    ]
                    {result.modifier !== 0 && (
                      <span className="result-modifier">
                        {" "}
                        {result.modifier >= 0 ? "+" : ""}
                        {result.modifier}
                      </span>
                    )}
                  </span>
                  <span className="result-total">= {result.total}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
