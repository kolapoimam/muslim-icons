# Muslim Icons for Vue

104 outline icons as native Vue 3 components. Use the same collection and component names as the React package, with Vue props, slots, and event handling.

## Install

```bash
npm install @muslim-icons/vue
```

Vue 3 is a peer dependency. TypeScript declarations are included. ESM and CommonJS entry points are available.

## Start with an icon

```vue
<script setup lang="ts">
import { Mosque, Quran, Ghusl } from '@muslim-icons/vue';
</script>

<template>
  <Mosque :size="32" color="#246b55" :strokeWidth="1.5" aria-label="Mosque" />
  <Quran :size="24" />
  <Ghusl :size="48" absoluteStrokeWidth />
</template>
```

Use named imports so your bundler can remove icons you do not use. Standard Vue SVG attributes and listeners are forwarded to the SVG element:

```vue
<script setup>
import { QiblaCompass } from '@muslim-icons/vue';
</script>
<template>
  <button type="button" aria-label="Find the Qibla">
    <QiblaCompass class="qibla-icon" />
  </button>
</template>
```

The default slot can contain an SVG title or other child content:

```vue
<script setup>
import { Mosque } from '@muslim-icons/vue';
</script>
<template>
  <Mosque aria-labelledby="mosque-title">
    <title id="mosque-title">Mosque</title>
  </Mosque>
</template>
```

For typed wrappers, import `IconProps` from `@muslim-icons/vue`. Vue component refs expose the SVG through `$el`.

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
