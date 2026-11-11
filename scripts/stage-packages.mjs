import { execFileSync } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { selectPackages, packageInfo, root, planRelease } from './packages.mjs';
import { verifyPackages } from './verify-package.mjs';

const args = process.argv.slice(2);
let selection = 'all';
let publish = false;
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--packages' && args[i + 1]) selection = args[++i];
  else if (args[i] === '--publish') publish = true;
  else if (args[i] !== '--dry-run') throw new Error(`Unknown option: ${args[i]}`);
}
if (publish && args.includes('--dry-run')) throw new Error('Choose --publish or --dry-run');
const selected = selectPackages(selection);
const cwd = fileURLToPath(root);
const npm = (args, options = {}) => execFileSync('npm', args, { cwd, encoding: 'utf8', env: { ...process.env, npm_config_cache: process.env.npm_config_cache ?? fileURLToPath(new URL('work/npm-cache/', root)) }, ...options });
const packages = await Promise.all(selected.map(packageInfo));
await verifyPackages(selected);
if (publish) {
  try { npm(['stage', '--help'], { stdio: ['ignore', 'pipe', 'pipe'] }); } catch { throw new Error('Use a current npm release with npm stage support before publishing'); }
  if (execFileSync('git', ['status', '--porcelain', '--untracked-files=no'], { cwd, encoding: 'utf8' }).trim()) throw new Error('Commit tracked changes before staging a release');
  if (packages.some(pkg => pkg.version === '0.0.0')) throw new Error('Run npm run version-packages and commit the result before the first release');
}
const published = {};
// Preflight every selected package before submitting any release.
for (const pkg of packages) {
  try {
    const versions = JSON.parse(npm(['view', pkg.name, 'versions', '--json'], { stdio: ['ignore', 'pipe', 'pipe'] }));
    published[pkg.name] = Array.isArray(versions) ? versions : [versions];
  } catch (error) {
    let code;
    try { code = JSON.parse(String(error.stdout)).error?.code; } catch { /* handled below */ }
    if (code !== 'E404') throw new Error(`Cannot check ${pkg.name}: ${String(error.stderr || error.message)}`);
    published[pkg.name] = [];
  }
}
const plan = planRelease(packages, published);
const artifactDir = fileURLToPath(new URL('work/npm/', root));
await mkdir(artifactDir, { recursive: true });
// Inspect the exact package tarballs before the first registry write.
const artifacts = new Map();
for (const pkg of plan) {
  if (pkg.action === 'skip') { console.log(`SKIP ${pkg.name}@${pkg.version}: already published`); continue; }
  const [artifact] = JSON.parse(npm(['pack', '--workspace', pkg.name, '--pack-destination', artifactDir, '--json']));
  artifacts.set(pkg.name, `${artifactDir}/${artifact.filename}`);
  console.log(`PACKED ${pkg.name}@${pkg.version}: ${artifact.filename} (${artifact.shasum})`);
}
if (!publish) console.log('Dry run complete. No packages were submitted to npm.');
else for (const pkg of plan.filter(pkg => pkg.action === 'stage')) {
  try {
    npm(['stage', 'publish', artifacts.get(pkg.name), '--access', 'public', '--tag', 'latest'], { stdio: 'inherit' });
    console.log(`STAGED ${pkg.name}@${pkg.version}: awaiting npm maintainer approval`);
  } catch (error) {
    console.error(`FAILED ${pkg.name}@${pkg.version}. Earlier successful submissions remain staged. Review npm Staged Packages before retrying.`);
    throw error;
  }
}
