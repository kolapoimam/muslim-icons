import { writeFile, mkdir, rm } from 'node:fs/promises';
import { loadIcons, catalogOf, jsxNodes, svelteNodes } from '../packages/core/index.mjs';

const root = new URL('../', import.meta.url);
const allowed = ['react', 'vue', 'svelte', 'svg', 'website'];
const args = process.argv.slice(2);
if (args.length && (args.length !== 2 || args[0] !== '--target' || !allowed.includes(args[1]))) throw new Error('Usage: node scripts/generate.mjs [--target react|vue|svelte|svg|website]');
const targets = args.length ? [args[1]] : allowed;
// Validate the whole collection before writing any output.
const icons = await loadIcons();
const catalog = catalogOf(icons);
async function write(path, value) { await writeFile(new URL(path, root), value); }
for (const target of targets) {
  if (target === 'website') {
    const dest = new URL('website/public/icons/', root);
    await rm(dest, { recursive: true, force: true });
    await mkdir(dest, { recursive: true });
    for (const icon of icons) await write(`website/public/icons/${icon.slug}.svg`, icon.source);
    await write('website/src/catalog.generated.ts', `export const catalog = ${JSON.stringify(catalog, null, 2)} as const;\n`);
    continue;
  }
  const dir = `packages/${target}/src/generated/`;
  await rm(new URL(dir, root), { recursive: true, force: true });
  await mkdir(new URL(dir, root), { recursive: true });
  const exports = [];
  for (const icon of icons) {
    if (target === 'react') {
      await write(`${dir}${icon.name}.tsx`, `import * as React from 'react';\nimport { createIcon } from '../IconBase';\nexport const ${icon.name} = createIcon('${icon.name}', <>${jsxNodes(icon.nodes)}</>);\n`);
      exports.push(`export { ${icon.name} } from './${icon.name}';`);
    } else if (target === 'vue') {
      await write(`${dir}${icon.name}.ts`, `import { createIcon } from '../IconBase';\nexport const ${icon.name} = createIcon('${icon.name}', ${JSON.stringify(icon.nodes)});\n`);
      exports.push(`export { ${icon.name} } from './${icon.name}';`);
    } else if (target === 'svelte') {
      await write(`${dir}${icon.name}.svelte`, `<script lang="ts">\n  import type { IconProps } from '../types.js';\n  let { size = 24, color = 'currentColor', strokeWidth = 2, absoluteStrokeWidth = false, children, ...rest }: IconProps = $props();\n  let numericSize = $derived(typeof size === 'number' ? size : Number.parseFloat(size));\n  let effectiveWidth = $derived(absoluteStrokeWidth && numericSize > 0 ? Number(strokeWidth) * 24 / numericSize : strokeWidth);\n  let labelled = $derived(Boolean(rest['aria-label'] || rest['aria-labelledby'] || rest['aria-hidden'] === false));\n</script>\n<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} stroke-width={effectiveWidth} stroke-linecap="round" stroke-linejoin="round" role={rest.role ?? (labelled ? 'img' : undefined)} aria-hidden={rest['aria-hidden'] ?? (labelled ? undefined : true)} {...rest}>${svelteNodes(icon.nodes)}{@render children?.()}</svg>\n`);
      exports.push(`export { default as ${icon.name} } from './${icon.name}.svelte';`);
    } else {
      await write(`${dir}${icon.name}.ts`, `export const ${icon.name} = ${JSON.stringify(icon.source)};\n`);
      exports.push(`export { ${icon.name} } from './${icon.name}';`);
    }
  }
  await write(`${dir}index.ts`, exports.join('\n') + '\n');
  if (target === 'svg') await write(`${dir}catalog.ts`, `export const catalog = ${JSON.stringify(catalog, null, 2)} as const;\n`);
}
console.log(`Generated ${icons.length} icons for ${targets.join(', ')}`);
