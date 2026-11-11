import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { createSSRApp, h } from 'vue';
import { renderToString } from '@vue/server-renderer';
import * as Icons from '@muslim-icons/vue';
import { assertSvg, customProps } from './assert-svg.mjs';
const source = JSON.parse(fs.readFileSync(new URL('./icons.json', import.meta.url)));
assert.deepEqual(Object.keys(Icons).filter(name => name !== 'createIcon').sort(), source.map(icon => icon.name).sort());
assert.deepEqual(Object.keys(createRequire(import.meta.url)('@muslim-icons/vue')).sort(), Object.keys(Icons).sort());
for (const icon of source) {
  assertSvg(await renderToString(createSSRApp({ render: () => h(Icons[icon.name]) })), icon);
  assertSvg(await renderToString(createSSRApp({ render: () => h(Icons[icon.name], customProps) })), icon, true);
}
const title = await renderToString(createSSRApp({ render: () => h(Icons.Mosque, { 'aria-labelledby': 'title' }, { default: () => h('title', { id: 'title' }, 'Mosque') }) }));
assert.ok(title.includes('<title id="title">Mosque</title>'));
console.log('Vue: 104 native components, SSR, shared props, ESM/CJS and slots passed');
