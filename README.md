# Muslim Icons

A collection of 50 original outline-style SVG icons for Muslim-focused applications, with React components generated from the same source files.

**Release status:** Preparing `@muslim-icons/react@0.1.0`. It is not yet published to npm.

## Install

After the first npm release:

```sh
npm install @muslim-icons/react
```

```tsx
import { Mosque, Quran, PrayerMat, Kaaba } from '@muslim-icons/react';

export function Navigation() {
  return <nav aria-label="Resources">
    <a href="/mosques"><Mosque aria-hidden="true" /> Mosques</a>
    <a href="/quran"><Quran aria-hidden="true" /> Quran</a>
    <a href="/prayer"><PrayerMat aria-hidden="true" /> Prayer</a>
    <a href="/hajj"><Kaaba aria-hidden="true" /> Hajj</a>
  </nav>;
}
```

Icons accept standard SVG attributes, `size` and `absoluteStrokeWidth`. They default to `currentColor`, so CSS can control their color. See the [React package documentation](packages/react/README.md) for customization and accessibility.

## Collection

The 50 icons cover places and architecture, worship and prayer, Quran and knowledge, Ramadan and Eid, Hajj and Umrah, Muslim lifestyle, and general Islamic concepts.

Browse [all canonical SVG files](packages/svg/icons). The default design is 24 × 24, 2px outline stroke, round line caps and joins, no fill, and `currentColor`.

## Contributing and development

Node 22+ is recommended.

```sh
npm install
npm run generate
npm test
npm run build
```

Edit original SVGs under `packages/svg/icons/`. The generator creates React components and an icon explorer catalog; generated assets are not the source of truth.

- [Contributing](CONTRIBUTING.md)
- [React package](packages/react)
- [Release procedure](docs/RELEASING.md)
- [Report a bug or request an icon](https://github.com/kolapoimam/muslim-icons/issues)

The `website/` directory contains a development icon explorer. The public landing page will be a separate project; there is no deployed site to link yet.

## License

Software is [MIT licensed](LICENSE). Original artwork is intended for [CC0 1.0](packages/svg/LICENSE), subject to confirmation of contributor rights. Third-party icons should not be copied or relicensed.

Maintained by [Kolapo Imam](https://github.com/kolapoimam).
