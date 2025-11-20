import React, { useState } from "react";
import type { Character } from "../types/character";

interface CharacterSelectorProps {
  characters: Character[];
  activeCharacter: Character | null;
  onSwitch: (characterId: string) => void;
  onCreate: () => void;
  onDelete: (characterId: string) => void;
}

export const CharacterSelector: React.FC<CharacterSelectorProps> = ({
  characters,
  activeCharacter,
  onSwitch,
  onCreate,
  onDelete,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSwitch = (characterId: string) => {
    onSwitch(characterId);
    setIsOpen(false);
  };

  const handleCreate = () => {
    onCreate();
    setIsOpen(false);
  };

  const handleDelete = (e: React.MouseEvent, characterId: string) => {
    e.stopPropagation();
    if (
      confirm(
        "Are you sure you want to delete this character? This cannot be undone."
      )
    ) {
      onDelete(characterId);
    }
  };

  // Show "New Character" button if only 0-1 characters
  if (characters.length <= 1) {
    return (
      <button onClick={onCreate} className="btn-reset">
        New Character
      </button>
    );
  }

  // Show "Change Character" dropdown if 2+ characters
  return (
    <div className="character-selector">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn-change-character"
      >
        Change Character
      </button>

      {isOpen && (
        <>
          <div className="selector-overlay" onClick={() => setIsOpen(false)} />
          <div className="character-dropdown">
            <div className="dropdown-header">
              <h3>Select Character</h3>
              <button
                className="btn-close-dropdown"
                onClick={() => setIsOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="character-list">
              {characters.map((char) => (
                <div
                  key={char.id}
                  className={`character-option ${
                    activeCharacter?.id === char.id ? "active" : ""
                  }`}
                  onClick={() => handleSwitch(char.id)}
                >
                  <div className="character-option-info">
                    <div className="character-option-name">{char.name}</div>
                    <div className="character-option-details">
                      Level {char.level} {char.class}
                    </div>
                  </div>
                  {characters.length > 1 && (
                    <button
                      className="btn-delete-character"
                      onClick={(e) => handleDelete(e, char.id)}
                      title="Delete character"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button className="btn-new-character" onClick={handleCreate}>
              + Create New Character
            </button>
          </div>
        </>
      )}
    </div>
  );
};
