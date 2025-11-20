# D&D 5e Character Sheet

A mobile-friendly D&D 5e character sheet web application built with React, TypeScript, and Vite. Features local storage for saving character data and integration with the D&D 5e API for spells, equipment, and other game content.

## Features

- 📱 **Mobile-First Design** - Optimized for use on phones and tablets
- 💾 **Local Storage** - All character data is saved automatically to your browser
- 🎲 **Full Character Management** - Track ability scores, skills, spells, equipment, and more
- 🔮 **D&D 5e API Integration** - Search and add official D&D 5e spells and equipment
- ⚡ **Fast & Responsive** - Built with React, TypeScript, and Vite for optimal performance
- 🎨 **D&D Themed** - Dark theme with classic D&D color scheme

## Getting Started

### Prerequisites

- Node.js 20.19+ or 22.12+ (you currently have 20.17.0, which works but is slightly below recommended)
- npm or yarn

### Installation

1. Clone or navigate to the project directory:

```bash
cd e:\dnd-sheet
```

2. Install dependencies (already done):

```bash
npm install
```

3. Start the development server (already running):

```bash
npm run dev
```

4. Open your browser to `http://localhost:5173/`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # React components
│   ├── AbilityScores.tsx
│   ├── CharacterInfo.tsx
│   ├── CombatStats.tsx
│   ├── Equipment.tsx
│   ├── Skills.tsx
│   └── Spells.tsx
├── hooks/              # Custom React hooks
│   ├── useDnDAPI.ts   # D&D 5e API integration
│   └── useLocalStorage.ts
├── types/             # TypeScript type definitions
│   └── character.ts
├── utils/             # Helper functions
│   └── characterHelpers.ts
├── App.tsx            # Main application component
├── App.css            # Application styles
└── main.tsx          # Application entry point
```

## Features in Detail

### Character Management

- **Basic Info**: Name, class, level, race, background, alignment, and XP
- **Ability Scores**: Strength, Dexterity, Constitution, Intelligence, Wisdom, Charisma
- **Skills**: All 18 D&D 5e skills with proficiency tracking
- **Saving Throws**: Track proficiencies for all six abilities
- **Combat Stats**: HP (current/max/temporary), AC, initiative, speed, proficiency bonus

### Spell Management

- Search for spells using the D&D 5e API
- View detailed spell information (level, school, range, components, duration, description)
- Mark spells as prepared
- All spell data saved locally

### Equipment Management

- Search for equipment using the D&D 5e API
- Track quantity and weight
- Organized by equipment category
- Persistent storage

### Local Storage

All character data is automatically saved to browser localStorage, so your character persists between sessions.

## D&D 5e API Integration

This project uses the official [D&D 5e API](https://www.dnd5eapi.co/) to fetch:

- Spells
- Equipment
- Classes
- Races
- And more!

API endpoints used:

- `https://www.dnd5eapi.co/api/2014/spells` - Spell list and details
- `https://www.dnd5eapi.co/api/2014/equipment` - Equipment list and details
- `https://www.dnd5eapi.co/api/2014/classes` - Class information
- `https://www.dnd5eapi.co/api/2014/races` - Race information

## Technologies Used

- **React 18** - UI framework
- **TypeScript** - Type safety and better developer experience
- **Vite** - Fast build tool and dev server
- **CSS3** - Styling with mobile-first responsive design
- **D&D 5e API** - Official D&D content

## Mobile Optimization

The app is designed with a mobile-first approach:

- Touch-friendly buttons and inputs (44px minimum touch targets)
- Responsive grid layouts that adapt to screen size
- Sticky header for easy navigation
- Tabbed interface to reduce scrolling
- Optimized font sizes and spacing for small screens

## Browser Compatibility

Works in all modern browsers that support:

- ES6+ JavaScript
- LocalStorage API
- Fetch API
- CSS Grid and Flexbox

## Future Enhancements

Potential features to add:

- Multiple character support
- Character import/export (JSON)
- Dice roller
- Notes and features section
- Monster lookup
- Item lookup beyond equipment
- Character portrait upload
- Print-friendly stylesheet
- Dark/light theme toggle

## License

This project is open source and available for personal use. D&D 5e content is owned by Wizards of the Coast.

## Credits

- D&D 5e API: [https://www.dnd5eapi.co/](https://www.dnd5eapi.co/)
- D&D 5e is a trademark of Wizards of the Coast
  },
  ])

````

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
````
