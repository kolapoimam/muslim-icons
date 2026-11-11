import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { loadIcons, parseIcon } from '../packages/core/index.mjs';

const root = new URL('../', import.meta.url);
test('all four generators cover the same catalog', async () => {
  const icons = await loadIcons();
  for (const kind of ['react', 'vue', 'svelte', 'svg']) {
    const index = await readFile(new URL(`packages/${kind}/src/generated/index.ts`, root), 'utf8');
    for (const icon of icons) assert.ok(index.includes(` ${icon.name} `), `${kind}: ${icon.name}`);
  }
  const catalog = await readFile(new URL('website/src/catalog.generated.ts', root), 'utf8');
  for (const icon of icons) {
    assert.ok(catalog.includes(`"name": "${icon.name}"`));
    assert.equal(await readFile(new URL(`website/public/icons/${icon.slug}.svg`, root), 'utf8'), icon.source);
  }
});
test('generation is deterministic, clears stale output, and respects --target', async () => {
  const vue = new URL('packages/vue/src/generated/', root);
  const first = await readFile(new URL('index.ts', vue), 'utf8');
  const react = await readFile(new URL('packages/react/src/generated/index.ts', root), 'utf8');
  await writeFile(new URL('RemovedIcon.ts', vue), 'stale');
  execFileSync(process.execPath, ['scripts/generate.mjs', '--target', 'vue'], { cwd: root });
  assert.ok(!(await readdir(vue)).includes('RemovedIcon.ts'));
  assert.equal(await readFile(new URL('index.ts', vue), 'utf8'), first);
  assert.equal(await readFile(new URL('packages/react/src/generated/index.ts', root), 'utf8'), react);
});
test('shared parser rejects active SVG content and invalid XML', async () => {
  const [icon] = await loadIcons();
  for (const attack of ['<script>alert(1)</script>', '<image href="https://example.com"/>', '<path onmouseover="x()"/>', '<path fill="url(https://example.com)"/>', '<foreignObject/>', '<svg/>']) {
    assert.throws(() => parseIcon(icon.source.replace('</svg>', `${attack}</svg>`), 'attack.svg'));
  }
  assert.throws(() => parseIcon('<!DOCTYPE svg [<!ENTITY x "bad">]>' + icon.source, 'attack.svg'));
  assert.throws(() => parseIcon(icon.source.replace('</svg>', ''), 'bad.svg'));
  assert.throws(() => parseIcon(icon.source, '../bad.svg'));
});
