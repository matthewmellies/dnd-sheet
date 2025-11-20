import React, { useState } from "react";
import type { Character, Equipment } from "../types/character";
import { useDnDAPI } from "../hooks/useDnDAPI";

interface EquipmentProps {
  character: Character;
  onUpdate: (updates: Partial<Character>) => void;
}

export const EquipmentComponent: React.FC<EquipmentProps> = ({
  character,
  onUpdate,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [searchResults, setSearchResults] = useState<
    Array<{ index: string; name: string }>
  >([]);
  const api = useDnDAPI();

  const handleSearch = async () => {
    const equipment = await api.getEquipment();
    if (equipment && searchTerm.trim()) {
      const filtered = equipment.results.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filtered);
    }
  };

  const addEquipment = async (equipmentIndex: string) => {
    const equipmentDetails = await api.getEquipmentDetails(equipmentIndex);
    if (equipmentDetails) {
      const newEquipment: Equipment = {
        index: equipmentDetails.index,
        name: equipmentDetails.name,
        equipmentCategory: equipmentDetails.equipment_category.name,
        quantity: 1,
        weight: equipmentDetails.weight,
      };

      onUpdate({
        equipment: [...character.equipment, newEquipment],
      });

      setShowSearch(false);
      setSearchTerm("");
      setSearchResults([]);
    }
  };

  const removeEquipment = (equipmentIndex: string) => {
    onUpdate({
      equipment: character.equipment.filter(
        (item) => item.index !== equipmentIndex
      ),
    });
  };

  const updateQuantity = (equipmentIndex: string, quantity: number) => {
    onUpdate({
      equipment: character.equipment.map((item) =>
        item.index === equipmentIndex
          ? { ...item, quantity: Math.max(0, quantity) }
          : item
      ),
    });
  };

  return (
    <div className="equipment">
      <div className="equipment-header">
        <h2>Equipment</h2>
        <button onClick={() => setShowSearch(!showSearch)} className="btn-add">
          {showSearch ? "Cancel" : "+ Add Equipment"}
        </button>
      </div>

      {showSearch && (
        <div className="equipment-search">
          <div className="search-input-group">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for equipment..."
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button onClick={handleSearch} disabled={api.loading}>
              {api.loading ? "Searching..." : "Search"}
            </button>
          </div>

          {api.error && <div className="error">{api.error}</div>}

          {searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map((result) => (
                <div key={result.index} className="search-result-item">
                  <span>{result.name}</span>
                  <button onClick={() => addEquipment(result.index)}>
                    Add
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="equipment-list">
        {character.equipment.length === 0 ? (
          <p className="empty-message">
            No equipment added yet. Click "Add Equipment" to search and add
            items.
          </p>
        ) : (
          <table className="equipment-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Category</th>
                <th>Qty</th>
                <th>Weight</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {character.equipment.map((item) => (
                <tr key={item.index}>
                  <td>{item.name}</td>
                  <td>{item.equipmentCategory}</td>
                  <td>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(
                          item.index,
                          parseInt(e.target.value) || 0
                        )
                      }
                      min="0"
                      className="qty-input"
                    />
                  </td>
                  <td>{item.weight ? `${item.weight} lb` : "-"}</td>
                  <td>
                    <button
                      onClick={() => removeEquipment(item.index)}
                      className="btn-remove"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
