import { readFile } from 'node:fs/promises';
export const publicPackages = ['react', 'vue', 'svelte', 'svg'];
export const root = new URL('../', import.meta.url);
export function selectPackages(selection = 'all') {
  if (selection === 'all') return [...publicPackages];
  const selected = selection.split(',');
  if (!selected.length || selected.some(name => !publicPackages.includes(name)) || new Set(selected).size !== selected.length) throw new Error('Select all or a comma-separated list of react,vue,svelte,svg');
  return selected;
}
export async function packageInfo(kind) {
  if (!publicPackages.includes(kind)) throw new Error(`Unknown public package: ${kind}`);
  return JSON.parse(await readFile(new URL(`packages/${kind}/package.json`, root), 'utf8'));
}
export function assertReleaseRef(ref) {
  if (!/^(?:[0-9a-f]{40}|(?:@muslim-icons\/(?:react|vue|svelte|svg)@|v)\d+\.\d+\.\d+(?:-[a-zA-Z0-9.-]+)?)$/.test(ref)) throw new Error('Use a full commit SHA or a version tag; branch names are not release refs');
  return ref;
}
export function planRelease(packages, published) {
  return packages.map(pkg => {
    if (!/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(pkg.version)) throw new Error('The latest release flow requires stable package versions');
    if (pkg.private || !/^@muslim-icons\/(react|vue|svelte|svg)$/.test(pkg.name)) throw new Error(`Refusing to release ${pkg.name}`);
    return { ...pkg, action: (published[pkg.name] ?? []).includes(pkg.version) ? 'skip' : 'stage' };
  });
}
