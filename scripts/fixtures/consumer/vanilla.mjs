import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import * as Icons from '@muslim-icons/svg';
const require = createRequire(import.meta.url);
const source = JSON.parse(fs.readFileSync(new URL('./icons.json', import.meta.url)));
assert.equal(Icons.catalog.length, 104);
assert.deepEqual(Object.keys(require('@muslim-icons/svg')).sort(), Object.keys(Icons).sort());
assert.equal(require('@muslim-icons/svg/catalog.json').length, 104);
for (const icon of source) {
  assert.equal(Icons[icon.name], icon.source);
  assert.equal(fs.readFileSync(require.resolve(`@muslim-icons/svg/icons/${icon.slug}.svg`), 'utf8'), icon.source);
}
console.log('SVG: exact raw files, 104 named strings, catalog and ESM/CJS exports passed');
