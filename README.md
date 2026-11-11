# Muslim Icons

**Making it easier for developers to build for the Ummah, one icon at a time.**

An original open-source collection of **50 SVG icons across seven categories**, with a reusable React library and a searchable icon website.

## Install (after npm publication)

```bash
npm install @muslim-icons/react
```

```tsx
import { Mosque, Quran, PrayerMat, Kaaba } from '@muslim-icons/react';
export default function App() { return <><Mosque size={24}/><Quran color="currentColor"/><PrayerMat strokeWidth={1.5}/><Kaaba aria-label="Kaaba"/></>; }
```

**Package status:** Version 0.1.0 is prepared for npm release but has not been published. Don't rely on npm installation until the package is available on npm.

## Development

```bash
npm install
npm test
npm run build
npm run dev
```

The canonical, original SVGs live under `packages/svg/icons/`. Run `npm run generate` to generate individual React components, icon catalog and website SVG copies. Generated files aren't checked in.

## License

Software is MIT licensed. Original artwork is intended to be dedicated under CC0 1.0; review ownership and contributor confirmation before release. See `packages/svg/LICENSE`.

## Links

GitHub: https://github.com/kolapoimam/muslim-icons
