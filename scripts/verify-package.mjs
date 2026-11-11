import { access, readFile, readdir } from 'node:fs/promises';
import assert from 'node:assert/strict';

const root = new URL('../', import.meta.url);
const pkgDir = new URL('../packages/react/', import.meta.url);
const pkg = JSON.parse(await readFile(new URL('package.json', pkgDir), 'utf8'));
assert.equal(pkg.name, '@muslim-icons/react');
assert.equal(pkg.version, '0.1.0');
assert.equal(pkg.sideEffects, false);
for (const filename of [pkg.main, pkg.module, pkg.types, 'README.md', 'LICENSE']) {
  await access(new URL(filename, pkgDir));
  console.log('Verified ' + filename);
}
const icons = (await readdir(new URL('packages/svg/icons/', root))).filter(x => x.endsWith('.svg'));
assert.equal(icons.length, 50);
console.log('Validated 50 original SVG files and published entry points');
