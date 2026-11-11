# Muslim Icons: SVG

104 outline SVG icons for HTML, CSS, JavaScript, and tools that work directly with SVG files. Choose individual files or import SVG strings in your code.

[Explore the icons](https://muslimicons.vercel.app) · [GitHub](https://github.com/kolapoimam/muslim-icons)

## Install

```bash
npm install @muslim-icons/svg
```

The package has no runtime dependencies. It includes individual SVGs, named JavaScript string exports, TypeScript declarations, and a JSON catalog.

## Use an SVG string

```html
<span id="mosque-icon" style="color: #246b55"></span>
```

```js
import { Mosque } from '@muslim-icons/svg';

document.querySelector('#mosque-icon').innerHTML = Mosque;
```

Named exports match the framework packages. Each value is a complete SVG string from the canonical collection, including its title and metadata. ESM and CommonJS are supported:

```js
const { Mosque } = require('@muslim-icons/svg');
```

## Use individual files

Files are exported at `@muslim-icons/svg/icons/<slug>.svg`. For example, a bundler with SVG URL imports can use:

```js
import mosqueUrl from '@muslim-icons/svg/icons/mosque.svg';
document.querySelector('#mosque-image').src = mosqueUrl;
```

Or copy `node_modules/@muslim-icons/svg/dist/icons/` into your site's public assets:

```html
<img src="/icons/mosque.svg" width="24" height="24" alt="Mosque" />
```

Inline SVG inherits text color through `currentColor`. An SVG used through `<img>` does not inherit the surrounding page's color. Use inline SVG when you want CSS to control the stroke.

## Browse the catalog

```js
import { catalog } from '@muslim-icons/svg';

const prayerIcons = catalog.filter(icon => icon.category === 'Worship & Prayer');
// Each entry has slug, name, label, category, and tags.
```

The same data is exported as `@muslim-icons/svg/catalog.json` for build tools and other consumers. See the [full icon list](https://github.com/kolapoimam/muslim-icons/blob/main/packages/react/README.md#all-104-icons).

## Style inline SVG

```css
#mosque-icon svg {
  width: 32px;
  height: 32px;
  stroke-width: 1.5;
}
```

The default artwork uses a 24 × 24 viewBox, a 2-unit outline stroke, rounded caps and joins, and no fill. When embedding decorative artwork, add `aria-hidden="true"` to the SVG. For meaningful standalone icons, provide an accessible name and `role="img"`.

## Contribute and license

[Request an icon](https://github.com/kolapoimam/muslim-icons/issues/new) or read the [contribution guide](https://github.com/kolapoimam/muslim-icons/blob/main/CONTRIBUTING.md).

Original SVG artwork has a separate [artwork notice](https://github.com/kolapoimam/muslim-icons/blob/main/packages/core/LICENSE) describing the intended CC0 dedication and contributor-rights requirements. JavaScript packaging code is MIT licensed.

Maintained by [Kolapo Imam](https://github.com/kolapoimam).
