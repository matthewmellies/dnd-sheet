# Deployment Guide

This guide will help you deploy your D&D Character Sheet to various platforms.

## Build for Production

Before deploying, create a production build:

```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

## Option 1: Vercel (Recommended)

Vercel is free and optimized for React apps.

1. Install Vercel CLI:

```bash
npm install -g vercel
```

2. Deploy:

```bash
vercel
```

3. Follow the prompts and your app will be live!

## Option 2: Netlify

1. Install Netlify CLI:

```bash
npm install -g netlify-cli
```

2. Deploy:

```bash
netlify deploy --prod
```

3. Select the `dist` folder when prompted

## Option 3: GitHub Pages

1. Install the gh-pages package:

```bash
npm install --save-dev gh-pages
```

2. Add to `package.json`:

```json
{
  "homepage": "https://yourusername.github.io/dnd-sheet",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. Update `vite.config.ts` to set the base path:

```typescript
export default defineConfig({
  plugins: [react()],
  base: "/dnd-sheet/",
});
```

4. Deploy:

```bash
npm run deploy
```

## Option 4: Self-Hosting

After running `npm run build`, upload the contents of the `dist/` folder to any web server or hosting provider.

### Requirements:

- Static file hosting (no server required)
- HTTPS recommended
- Any web server (Apache, Nginx, etc.)

## Testing Your Deployment

After deployment:

1. Open the app on your phone
2. Add a test character
3. Close the browser completely
4. Reopen - your character should still be there (localStorage test)
5. Try searching for spells and equipment (API test)

## Troubleshooting

### Issue: Blank page after deployment

- Check browser console for errors
- Verify the `base` path in `vite.config.ts` matches your deployment URL
- Ensure all files in `dist/` were uploaded

### Issue: LocalStorage not working

- Verify your site is served over HTTPS
- Check browser privacy settings

### Issue: API calls failing

- Check browser console for CORS errors
- The D&D 5e API should work from any domain
- Verify your internet connection

## Mobile Installation (PWA)

To add PWA support for "Add to Home Screen" functionality:

1. Install vite-plugin-pwa:

```bash
npm install -D vite-plugin-pwa
```

2. Update `vite.config.ts`:

```typescript
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "D&D 5e Character Sheet",
        short_name: "D&D Sheet",
        description: "Mobile-friendly D&D 5e character sheet",
        theme_color: "#8b0000",
        icons: [
          {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
```

3. Add app icons to the `public/` folder
4. Rebuild and deploy

Now users can "Add to Home Screen" on their phones!
