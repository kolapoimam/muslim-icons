import { mkdir, writeFile } from 'node:fs/promises';
import { loadIcons, catalogOf } from '../packages/core/index.mjs';
const dist = new URL('../packages/svg/dist/', import.meta.url);
await mkdir(new URL('icons/', dist), { recursive: true });
const icons = await loadIcons();
for (const icon of icons) await writeFile(new URL(`icons/${icon.slug}.svg`, dist), icon.source);
await writeFile(new URL('catalog.json', dist), JSON.stringify(catalogOf(icons), null, 2) + '\n');
