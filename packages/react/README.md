# @muslim-icons/react

104 outline SVG icons as reusable React components for Muslim-focused applications.

## Installation

```sh
npm install @muslim-icons/react
```

Requires React 18 or 19. TypeScript declarations are included.

## Usage

```tsx
import { Mosque, PrayerMat, Quran, Kaaba } from '@muslim-icons/react';

export function Icons() {
  return <>
    <Mosque />
    <PrayerMat size={32} />
    <Quran color="#17684e" strokeWidth={1.5} />
    <Kaaba className="icon" />
  </>;
}
```

Components are individually exported and tree-shakable. Every icon accepts standard React SVG properties, including `color`, `strokeWidth`, `className`, `style`, `aria-label` and ref forwarding.

- `size`: width and height, default 24; number or CSS length string.
- `absoluteStrokeWidth`: when true, compensates stroke thickness when resizing.
- Default: `viewBox="0 0 24 24"`, `stroke="currentColor"`, width 24, round caps and joins, no fill.

### Color with CSS

```tsx
<Mihrab className="text-emerald-700" size={24} />
```

### Accessibility

Decorative icons are hidden from assistive technology by default. Provide an accessible name if the icon communicates information on its own:

```tsx
<button><Mosque aria-hidden="true" /> Find a mosque</button>
<PrayerTime role="img" aria-label="Prayer time" />
```

Icons in an unlabeled button do not replace an accessible button name.

## Icons and source

The collection has 104 distinct icons in seven categories, covering all 88 concepts in the landing-page catalog and preserving seven additional existing icons. See the [SVG source](https://github.com/kolapoimam/muslim-icons/tree/main/packages/svg/icons) for the complete list.

[GitHub](https://github.com/kolapoimam/muslim-icons) · [Issues](https://github.com/kolapoimam/muslim-icons/issues) · [Contributing](https://github.com/kolapoimam/muslim-icons/blob/main/CONTRIBUTING.md)

## Prayer positions, purification and dietary status

- `Takbir`: raising the hands at the opening of prayer.
- `Qiyam`: standing with folded arms.
- `Ruku`: bowing.
- `Qawmah`: standing upright after bowing.
- `Sujood`: prostration.
- `Jalsah`: sitting between prostrations.
- `Tashahhud`: seated testimony with a raised index finger.
- `Taslim`: the closing greeting with the head turned.
- `Wudu`, `Ghusl`, `Tayammum`: ablution, full-body washing, and dry purification.
- `HalalBadge`, `HalalFood`, `HalalShopping`: permitted status, food, and shopping.
- `Haram`: a prohibition symbol for forbidden or restricted status.

```tsx
import { Qiyam, Ruku, Sujood, Ghusl, HalalBadge, Haram } from '@muslim-icons/react';
```

## License

Code: MIT. Original icon artwork: intended CC0 1.0, subject to rights confirmation. See repository licensing notes.
