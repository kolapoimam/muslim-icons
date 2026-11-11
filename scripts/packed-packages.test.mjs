import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile, cp, rm, mkdtemp } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { compile } from 'svelte/compiler';
import { loadIcons } from '../packages/core/index.mjs';
import { publicPackages, packageInfo } from './packages.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const dir = await mkdtemp(join(tmpdir(), 'muslim-icons-consumer-'));
const temporaryDirectories = [dir];
const cache = fileURLToPath(new URL('../work/npm-cache/', import.meta.url));
const run = (command, args, cwd = dir) => execFileSync(command, args, { cwd, encoding: 'utf8', env: { ...process.env, npm_config_cache: cache }, stdio: ['ignore', 'pipe', 'pipe'] });

before(async () => {
  await rm(dir, { recursive: true, force: true });
  await mkdir(dir, { recursive: true });
  await cp(new URL('./fixtures/consumer/', import.meta.url), dir, { recursive: true });
  const dependencies = {};
  for (const name of ['react', 'react-dom', 'vue', '@vue/server-renderer', 'svelte', 'jsdom', 'typescript', '@types/react', '@types/react-dom']) {
    const info = JSON.parse(await readFile(new URL(`../node_modules/${name}/package.json`, import.meta.url), 'utf8'));
    dependencies[name] = info.version;
  }
  for (const kind of publicPackages) {
    const pkg = await packageInfo(kind);
    const [tarball] = JSON.parse(run('npm', ['pack', '--workspace', pkg.name, '--pack-destination', dir, '--json'], root));
    assert.ok(!tarball.files.some(file => file.path.startsWith('src/') || file.path.includes('node_modules')), pkg.name);
    dependencies[pkg.name] = `file:./${tarball.filename}`;
  }
  await writeFile(`${dir}/package.json`, JSON.stringify({ private: true, type: 'module', dependencies }, null, 2));
  await writeFile(`${dir}/baseline.json`, await readFile(new URL('./fixtures/react-contract.json', import.meta.url)));
  await writeFile(`${dir}/icons.json`, JSON.stringify(await loadIcons()));
  run('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund']);
  await writeFile(`${dir}/tsconfig.json`, JSON.stringify({ compilerOptions: { strict: true, skipLibCheck: true, noEmit: true, target: 'ES2020', module: 'NodeNext', moduleResolution: 'NodeNext', jsx: 'react-jsx', types: ['react'] }, include: ['types.tsx', 'types.cts'] }));
  await writeFile(`${dir}/tsconfig.vue.json`, JSON.stringify({ compilerOptions: { strict: true, skipLibCheck: true, noEmit: true, target: 'ES2020', module: 'ESNext', moduleResolution: 'Bundler' }, include: ['VueExample.vue'] }));
  await writeFile(`${dir}/tsconfig.svelte.json`, JSON.stringify({ compilerOptions: { strict: true, skipLibCheck: true, target: 'ES2020', module: 'ESNext', moduleResolution: 'Bundler', allowJs: true, checkJs: true, isolatedModules: true }, include: ['App.svelte'] }));
  for (const target of ['server', 'client']) {
    await build({ entryPoints: [`${dir}/svelte-${target}-entry.js`], outfile: `${dir}/svelte-${target}.js`, bundle: true, format: 'esm', platform: target === 'server' ? 'node' : 'browser', conditions: target === 'server' ? ['svelte', 'node'] : ['svelte', 'browser'], external: target === 'server' ? ['svelte', 'svelte/*'] : [], plugins: [{ name: 'svelte-consumer', setup(builder) {
      builder.onLoad({ filter: /\.svelte$/ }, async args => ({ contents: compile(await readFile(args.path, 'utf8'), { filename: args.path, generate: target }).js.code, loader: 'js' }));
    } }] });
  }
}, { timeout: 240_000 });

for (const kind of ['react', 'vue', 'vue-client', 'svelte', 'vanilla']) test(`packed ${kind} package works in a standalone consumer`, { timeout: 120_000 }, () => {
  console.log(run(process.execPath, [`${kind}.mjs`]));
});

test('packed public TypeScript exports compile in a standalone consumer', { timeout: 120_000 }, () => {
  run(process.execPath, ['node_modules/typescript/bin/tsc', '--project', 'tsconfig.json']);
  run(process.execPath, [`${root}/node_modules/vue-tsc/bin/vue-tsc.js`, '--project', `${dir}/tsconfig.vue.json`]);
  run(process.execPath, [`${root}/node_modules/svelte-check/bin/svelte-check`, '--workspace', dir, '--tsconfig', './tsconfig.svelte.json']);
});

test('packed React supports the declared React 18 peer boundary', { timeout: 120_000 }, async () => {
  const variant = await mkdtemp(join(tmpdir(), 'muslim-icons-react18-'));
  temporaryDirectories.push(variant);
  await rm(variant, { recursive: true, force: true });
  await mkdir(variant, { recursive: true });
  for (const file of ['react.mjs', 'assert-svg.mjs', 'baseline.json', 'icons.json']) await cp(`${dir}/${file}`, `${variant}/${file}`);
  const manifest = JSON.parse(await readFile(`${dir}/package.json`, 'utf8'));
  await writeFile(`${variant}/package.json`, JSON.stringify({ private: true, type: 'module', dependencies: { react: '18.0.0', 'react-dom': '18.0.0', '@types/react': '^18.3.0', '@types/react-dom': '^18.3.0', jsdom: manifest.dependencies.jsdom, '@muslim-icons/react': `file:${dir}/muslim-icons-react-${(await packageInfo('react')).version}.tgz` } }));
  run('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund'], variant);
  console.log(run(process.execPath, ['react.mjs'], variant));
  await writeFile(`${variant}/types.tsx`, "import React, {createRef} from 'react';\nimport { Mosque, createIcon, type IconProps } from '@muslim-icons/react';\nconst props: IconProps = {size: 32, absoluteStrokeWidth: true, 'aria-label': 'Mosque'};\nconst element = <Mosque {...props} ref={createRef<SVGSVGElement>()} />;\nconst Custom = createIcon('Custom', <path d='M2 2h20' />);\nvoid [element, Custom];\n");
  run(process.execPath, [`${root}/node_modules/typescript/bin/tsc`, '--strict', '--skipLibCheck', '--noEmit', '--jsx', 'react-jsx', '--module', 'NodeNext', '--moduleResolution', 'NodeNext', 'types.tsx'], variant);
});

test('packed Vue supports the declared Vue 3.0 peer boundary', { timeout: 120_000 }, async () => {
  const variant = await mkdtemp(join(tmpdir(), 'muslim-icons-vue30-'));
  temporaryDirectories.push(variant);
  await rm(variant, { recursive: true, force: true });
  await mkdir(variant, { recursive: true });
  for (const file of ['vue.mjs', 'vue-client.mjs', 'assert-svg.mjs', 'icons.json']) await cp(`${dir}/${file}`, `${variant}/${file}`);
  const manifest = JSON.parse(await readFile(`${dir}/package.json`, 'utf8'));
  await writeFile(`${variant}/package.json`, JSON.stringify({ private: true, type: 'module', dependencies: { vue: '3.0.0', '@vue/server-renderer': '3.0.0', jsdom: manifest.dependencies.jsdom, '@muslim-icons/vue': `file:${dir}/muslim-icons-vue-${(await packageInfo('vue')).version}.tgz` } }));
  run('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund'], variant);
  console.log(run(process.execPath, ['vue.mjs'], variant));
  console.log(run(process.execPath, ['vue-client.mjs'], variant));
  await writeFile(`${variant}/types.ts`, "import { h } from 'vue';\nimport { Mosque, type IconProps } from '@muslim-icons/vue';\nconst props: IconProps = {size: 32, color: 'green', absoluteStrokeWidth: true};\nh(Mosque, props);\n");
  run(process.execPath, [`${root}/node_modules/typescript/bin/tsc`, '--strict', '--skipLibCheck', '--noEmit', '--module', 'NodeNext', '--moduleResolution', 'NodeNext', 'types.ts'], variant);
});

after(async () => {
  await Promise.all(temporaryDirectories.map(directory => rm(directory, { recursive: true, force: true })));
});
