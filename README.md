# Muslim Icons

**104 outline icons for React, Vue, Svelte, and the web.**

[Explore the icons](https://muslimicons.vercel.app) · [GitHub](https://github.com/kolapoimam/muslim-icons)

Building a prayer app, a Quran reader, or a site for your local mosque? Choose the package that fits your project. Every distribution comes from the same SVG artwork, with matching names and a consistent 24 × 24 grid.

| Package | For | Install | Guide |
| --- | --- | --- | --- |
| `@muslim-icons/react` | React 18 and 19 | `npm install @muslim-icons/react` | [React](packages/react/README.md) |
| `@muslim-icons/vue` | Vue 3 | `npm install @muslim-icons/vue` | [Vue](packages/vue/README.md) |
| `@muslim-icons/svelte` | Svelte 5 | `npm install @muslim-icons/svelte` | [Svelte](packages/svelte/README.md) |
| `@muslim-icons/svg` | HTML, CSS, and JavaScript | `npm install @muslim-icons/svg` | [SVG](packages/svg/README.md) |

New packages become installable after npm release approval; see the [release guide](docs/RELEASING.md) for the first-release steps. React's existing API stays the same.

## A familiar name in every framework

```tsx
// React
import { Mosque } from '@muslim-icons/react';
<Mosque size={32} color="#246b55" strokeWidth={1.5} />
```

```vue
<!-- Vue 3 -->
<script setup>
import { Mosque } from '@muslim-icons/vue';
</script>
<template>
  <Mosque :size="32" color="#246b55" :strokeWidth="1.5" />
</template>
```

```svelte
<!-- Svelte 5 -->
<script>
  import { Mosque } from '@muslim-icons/svelte';
</script>
<Mosque size={32} color="#246b55" strokeWidth={1.5} />
```

```js
// Vanilla JavaScript: the export is an SVG string
import { Mosque } from '@muslim-icons/svg';
document.querySelector('#mosque-icon').innerHTML = Mosque;
```

Framework icons support `size`, `color`, `strokeWidth`, and `absoluteStrokeWidth`, along with native SVG attributes. They inherit text color and are decorative by default; add `aria-label` when an icon communicates meaning on its own. The SVG package provides the raw artwork for you to embed or style.

## The collection

| Category | What you'll find | Icons |
| --- | --- | ---: |
| Worship & Prayer | Prayer positions, prayer times, Qibla, Wudu, Ghusl, and Tayammum | 18 |
| Quran & Knowledge | Books, recitation, memorisation, and learning | 13 |
| Ramadan & Eid | Fasting, meals, dates, lanterns, and celebrations | 11 |
| Hajj & Umrah | Pilgrimage rites, the Kaaba, and landmarks | 11 |
| Places & Architecture | Mosques, domes, minarets, and prayer halls | 11 |
| Muslim Lifestyle | Family, community, clothing, food, Halal, and Haram | 26 |
| General Islamic Concepts | Charity, patience, gratitude, and remembrance | 14 |
| **Total** | **Seven categories** | **104** |

[Browse all SVGs](packages/core/icons) or see the [full component list](packages/react/README.md#all-104-icons). `Takbir`, `Qiyam`, `Ruku`, `Qawmah`, `Sujood`, `Jalsah`, `Tashahhud`, and `Taslim` cover prayer positions. Purification icons include `Wudu`, `Ghusl`, and `Tayammum`.

## Working on the collection

Use Node 22 or newer and npm workspaces:

```bash
npm ci
npm test
npm run build
npm run typecheck
npm run verify:packages
npm run test:packages
```

Edit artwork in `packages/core/icons`. Each public package has an independent build, for example `npm run build -w @muslim-icons/vue`; its prebuild step generates its components from core. The internal demo has its own `npm run dev` command. The separate landing-page repository is not part of this workspace.

```text
packages/
  core/       canonical SVGs and shared build-time parsing (private)
  react/      generated React components
  vue/        generated Vue 3 components
  svelte/     generated Svelte 5 components
  svg/        generated SVG files, strings, and catalog
scripts/      generators, validation, and release tooling
website/      internal React demo
.changeset/   independent package versions and release notes
```

Read the [architecture notes](docs/ARCHITECTURE.md), [contribution guide](CONTRIBUTING.md), and [release guide](docs/RELEASING.md).

## Help shape the collection

Missing a symbol you use? [Open an icon request](https://github.com/kolapoimam/muslim-icons/issues/new) and tell us what it should represent. Improvements to existing drawings are welcome too.

Software is [MIT licensed](LICENSE). Original SVG artwork carries a [separate notice](packages/core/LICENSE) describing an intended CC0 1.0 dedication, subject to confirmation of contributor rights.

Made and maintained by [Kolapo Imam](https://github.com/kolapoimam).
