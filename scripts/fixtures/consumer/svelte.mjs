import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as Icons from './svelte-server.js';
import { assertSvg, customProps, installDom } from './assert-svg.mjs';
const source = JSON.parse(fs.readFileSync(new URL('./icons.json', import.meta.url)));
assert.deepEqual(Object.keys(Icons).filter(name => name !== 'render').sort(), source.map(icon => icon.name).sort());
for (const icon of source) {
  assertSvg(Icons.render(Icons[icon.name]).body, icon);
  assertSvg(Icons.render(Icons[icon.name], { props: customProps }).body, icon, true);
}
installDom();
const { App, mount, unmount, flushSync } = await import('./svelte-client.js');
const app = mount(App, { target: document.querySelector('#app') });
flushSync();
const svg = document.querySelector('svg');
assert.equal(svg.getAttribute('width'), '24');
assert.equal(svg.getAttribute('stroke'), '#246b55');
assert.equal(svg.getAttribute('aria-hidden'), null);
svg.dispatchEvent(new MouseEvent('click', { bubbles: true }));
flushSync();
assert.equal(document.querySelector('span').textContent, '1');
document.querySelector('button').click();
flushSync();
assert.equal(svg.getAttribute('width'), '48');
await unmount(app);
console.log('Svelte: 104 native components, SSR, reactive props and DOM events passed');
