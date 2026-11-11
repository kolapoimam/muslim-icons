import test from 'node:test';
import assert from 'node:assert/strict';
import { selectPackages, assertReleaseRef, planRelease } from './packages.mjs';

test('only explicit public package selections are accepted', () => {
  assert.equal(selectPackages('all').length, 4);
  assert.deepEqual(selectPackages('vue,svg'), ['vue', 'svg']);
  for (const invalid of ['core', 'website', '../react', 'react,react', 'react,', '']) assert.throws(() => selectPackages(invalid));
});
test('release sources use immutable tags or full SHAs', () => {
  for (const ref of ['v0.4.0', '@muslim-icons/vue@0.1.0', 'a'.repeat(40)]) assert.equal(assertReleaseRef(ref), ref);
  for (const ref of ['main', 'feature/x', '', 'HEAD', 'v1.2', 'v1.2.3;echo bad']) assert.throws(() => assertReleaseRef(ref));
});
test('independent versions skip published packages and reject private workspaces', () => {
  const packages = [{ name: '@muslim-icons/react', version: '0.4.0' }, { name: '@muslim-icons/vue', version: '0.1.0' }];
  assert.deepEqual(planRelease(packages, { '@muslim-icons/react': ['0.4.0'] }).map(pkg => pkg.action), ['skip', 'stage']);
  assert.throws(() => planRelease([{ name: '@muslim-icons/core', version: '0.1.0', private: true }], {}));
});

test('stable latest releases reject accidental prerelease tags', () => {
  assert.throws(() => planRelease([{name: '@muslim-icons/vue', version: '0.1.0-beta.1'}], {}));
});
