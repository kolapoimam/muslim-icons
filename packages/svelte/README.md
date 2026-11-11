# Muslim Icons for Svelte

104 outline icons as native Svelte 5 components. The names match the React and Vue packages, and every component is generated from the same SVG artwork.

[Explore the icons](https://muslimicons.vercel.app) · [GitHub](https://github.com/kolapoimam/muslim-icons)

## Install

```bash
npm install @muslim-icons/svelte
```

Requires Svelte 5. The package ships Svelte source and TypeScript declarations for your Svelte or SvelteKit toolchain to compile.

## Start with an icon

```svelte
<script lang="ts">
  import { Mosque, Quran, Ghusl } from '@muslim-icons/svelte';
  let size = $state(24);
</script>

<Mosque {size} color="#246b55" strokeWidth={1.5} aria-label="Mosque" />
<Quran size={24} />
<Ghusl size={48} absoluteStrokeWidth />
<button onclick={() => size = 48}>Make the mosque icon larger</button>
```

Native SVG event handlers, such as `onclick`, and SVG attributes are forwarded to the element. Use named imports so your bundler can keep the icons your app needs.

Children use Svelte 5 snippets:

```svelte
<script>
  import { Mosque } from '@muslim-icons/svelte';
</script>

<Mosque aria-labelledby="mosque-title">
  <title id="mosque-title">Mosque</title>
</Mosque>
```

For typed wrappers, import `IconProps` from `@muslim-icons/svelte`.

## Props

| Prop | Type | Default | Purpose |
| --- | --- | --- | --- |
| `size` | `number` or `string` | `24` | SVG width and height |
| `color` | `string` | `currentColor` | Stroke color |
| `strokeWidth` | `number` or `string` | `2` | Stroke weight |
| `absoluteStrokeWidth` | `boolean` | `false` | Keeps the stroke thickness steady when using numeric pixel sizes |

Icons inherit the surrounding text color and accept native SVG attributes such as `class`, `style`, `aria-label`, and `aria-labelledby`. Icons are decorative by default. Use an accessible label when an icon conveys information on its own; label the button when it contains only an icon.

All 104 names match the React collection: `Mosque`, `Quran`, `PrayerMat`, `Ghusl`, `HalalBadge`, `Haram`, and more. See the [full collection](https://github.com/kolapoimam/muslim-icons/blob/main/packages/react/README.md#all-104-icons).

## Contribute

[Request an icon](https://github.com/kolapoimam/muslim-icons/issues/new) or read the [contribution guide](https://github.com/kolapoimam/muslim-icons/blob/main/CONTRIBUTING.md). Artwork is shared across all frameworks.

## License

Component code: MIT. Original SVG artwork has a separate [artwork notice](https://github.com/kolapoimam/muslim-icons/blob/main/packages/core/LICENSE) describing the intended CC0 dedication and contributor-rights requirements.

Maintained by [Kolapo Imam](https://github.com/kolapoimam).
