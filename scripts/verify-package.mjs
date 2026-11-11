import { access, readFile, readdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { loadIcons } from '../packages/core/index.mjs';
import { publicPackages, packageInfo, root } from './packages.mjs';

export async function verifyPackages(selected = publicPackages) {
  const icons = await loadIcons();
  for (const kind of selected) {
    const pkg = await packageInfo(kind);
    const dir = new URL(`packages/${kind}/`, root);
    assert.equal(pkg.name, `@muslim-icons/${kind}`);
    assert.equal(pkg.private, undefined);
    assert.equal(pkg.sideEffects, false);
    assert.ok(!Object.keys(pkg.dependencies ?? {}).some(name => name.startsWith('@muslim-icons/')), 'public packages must be standalone');
    const flatten = value => typeof value === 'string' ? [value] : Object.values(value).flatMap(flatten);
    const entries = new Set([pkg.main, pkg.module, pkg.types, ...flatten(pkg.exports['.'])].filter(Boolean));
    for (const filename of [...entries, 'README.md', 'LICENSE', ...(kind === 'react' ? [] : ['ARTWORK-LICENSE'])]) await access(new URL(filename, dir));
    const declarations = await readFile(new URL(kind === 'svelte' ? 'dist/generated/index.d.ts' : pkg.types, dir), 'utf8');
    for (const icon of icons) assert.ok(new RegExp(`\\b${icon.name}\\b`).test(declarations), `${pkg.name}: missing ${icon.name}`);
    if (kind === 'svg') {
      assert.equal((await readdir(new URL('dist/icons/', dir))).length, icons.length);
      for (const icon of icons) assert.equal(await readFile(new URL(`dist/icons/${icon.slug}.svg`, dir), 'utf8'), icon.source);
      const catalog = JSON.parse(await readFile(new URL('dist/catalog.json', dir), 'utf8'));
      assert.deepEqual(catalog.map(icon => icon.name), icons.map(icon => icon.name));
    }
    console.log(`Verified ${pkg.name}@${pkg.version}: ${icons.length} icons and published entry points`);
  }
}
if (process.argv[1] === fileURLToPath(import.meta.url)) await verifyPackages();
