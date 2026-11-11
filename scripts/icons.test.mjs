import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { loadIcons } from '../packages/core/index.mjs';
const baseline = JSON.parse(await readFile(new URL('./fixtures/react-contract.json', import.meta.url), 'utf8'));
const hash = value => createHash('sha256').update(value).digest('hex');

test('moving to core preserves every original SVG byte', async () => {
  const icons = await loadIcons();
  assert.equal(icons.length, 104);
  assert.deepEqual(Object.fromEntries(icons.map(icon => [`${icon.slug}.svg`, hash(icon.source)])), baseline.assets);
});
test('component names and icon geometry are unique', async () => {
  const icons = await loadIcons();
  assert.equal(new Set(icons.map(icon => icon.name)).size, icons.length);
  assert.equal(new Set(icons.map(icon => JSON.stringify(icon.nodes))).size, icons.length);
});
test('demo stays linked to the local React workspace independently of release versions', async () => {
  const demo = JSON.parse(await readFile(new URL('../website/package.json', import.meta.url), 'utf8'));
  assert.equal(demo.private, true);
  assert.equal(demo.dependencies['@muslim-icons/react'], '*');
});
