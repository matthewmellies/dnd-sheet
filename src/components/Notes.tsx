import React, { useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface Note {
  id: string;
  title: string;
  content: string;
  isExpanded: boolean;
  color: string;
}

const NOTE_COLORS = [
  "#fff59d", // yellow
  "#a5d6a7", // green
  "#90caf9", // blue
  "#ce93d8", // purple
  "#ffab91", // orange
  "#f48fb1", // pink
];

export const Notes: React.FC = () => {
  const [notes, setNotes] = useLocalStorage<Note[]>("dnd-notes", []);
  const [showAddNote, setShowAddNote] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [selectedColor, setSelectedColor] = useState(NOTE_COLORS[0]);

  const addNote = () => {
    if (newNoteTitle.trim()) {
      const newNote: Note = {
        id: Date.now().toString(),
        title: newNoteTitle.trim(),
        content: newNoteContent.trim(),
        isExpanded: true,
        color: selectedColor,
      };
      setNotes([newNote, ...notes]);
      setNewNoteTitle("");
      setNewNoteContent("");
      setShowAddNote(false);
      setSelectedColor(NOTE_COLORS[0]);
    }
  };

  const deleteNote = (id: string) => {
    if (confirm("Are you sure you want to delete this note?")) {
      setNotes(notes.filter((note) => note.id !== id));
    }
  };

  const toggleNote = (id: string) => {
    setNotes(
      notes.map((note) =>
        note.id === id ? { ...note, isExpanded: !note.isExpanded } : note
      )
    );
  };

  const updateNote = (id: string, title: string, content: string) => {
    setNotes(
      notes.map((note) => (note.id === id ? { ...note, title, content } : note))
    );
  };

  return (
    <div className="notes-section">
      <div className="notes-header">
        <h1>Notes</h1>
        <button
          onClick={() => setShowAddNote(!showAddNote)}
          className="btn-add-note"
        >
          {showAddNote ? "Cancel" : "+ Add Note"}
        </button>
      </div>

      {showAddNote && (
        <div className="add-note-form">
          <input
            type="text"
            placeholder="Note Title"
            value={newNoteTitle}
            onChange={(e) => setNewNoteTitle(e.target.value)}
            className="note-title-input"
            autoFocus
          />
          <textarea
            placeholder="Note Content"
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            className="note-content-input"
            rows={4}
          />
          <div className="note-color-picker">
            <label>Color:</label>
            <div className="color-options">
              {NOTE_COLORS.map((color) => (
                <button
                  key={color}
                  className={`color-option ${
                    selectedColor === color ? "selected" : ""
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                  aria-label={`Select ${color} color`}
                />
              ))}
            </div>
          </div>
          <button onClick={addNote} className="btn-save-note">
            Save Note
          </button>
        </div>
      )}

      {notes.length === 0 ? (
        <div className="empty-notes">
          <p>No notes yet. Click "+ Add Note" to create your first note!</p>
        </div>
      ) : (
        <div className="notes-grid">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onToggle={() => toggleNote(note.id)}
              onDelete={() => deleteNote(note.id)}
              onUpdate={(title, content) => updateNote(note.id, title, content)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface NoteCardProps {
  note: Note;
  onToggle: () => void;
  onDelete: () => void;
  onUpdate: (title: string, content: string) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onToggle,
  onDelete,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);
  const [editContent, setEditContent] = useState(note.content);

  const saveEdit = () => {
    if (editTitle.trim()) {
      onUpdate(editTitle.trim(), editContent.trim());
      setIsEditing(false);
    }
  };

  const cancelEdit = () => {
    setEditTitle(note.title);
    setEditContent(note.content);
    setIsEditing(false);
  };

  return (
    <div
      className={`note-card ${note.isExpanded ? "expanded" : "collapsed"}`}
      style={{ backgroundColor: note.color }}
    >
      <div className="note-card-header" onClick={onToggle}>
        <h3>{note.title}</h3>
        <span className="note-toggle-icon">{note.isExpanded ? "▼" : "▶"}</span>
      </div>

      {note.isExpanded && (
        <div className="note-card-content">
          {isEditing ? (
            <div className="note-edit-form">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="note-edit-title"
              />
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="note-edit-content"
                rows={4}
              />
              <div className="note-edit-buttons">
                <button onClick={saveEdit} className="btn-save-edit">
                  Save
                </button>
                <button onClick={cancelEdit} className="btn-cancel-edit">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="note-text">{note.content || <em>No content</em>}</p>
              <div className="note-actions">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                  }}
                  className="btn-edit-note"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  className="btn-delete-note"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
