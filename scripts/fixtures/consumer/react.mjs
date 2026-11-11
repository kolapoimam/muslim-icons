import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as Icons from '@muslim-icons/react';
import { assertSvg, customProps, installDom } from './assert-svg.mjs';
const fixture = JSON.parse(fs.readFileSync(new URL('./baseline.json', import.meta.url)));
const source = JSON.parse(fs.readFileSync(new URL('./icons.json', import.meta.url)));
assert.deepEqual(Object.keys(Icons).sort(), fixture.exports);
const cjs = createRequire(import.meta.url)('@muslim-icons/react');
assert.deepEqual(Object.keys(cjs).sort(), fixture.exports);
for (const icon of source) {
  fixture.cases.forEach((props, index) => {
    const markup = renderToStaticMarkup(React.createElement(Icons[icon.name], props));
    assert.equal(createHash('sha256').update(markup).digest('hex'), fixture.renders[icon.name][index], `${icon.name}: baseline case ${index}`);
  });
  assertSvg(renderToStaticMarkup(React.createElement(Icons[icon.name], customProps)), icon, true);
}
installDom();
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const { createRoot } = await import('react-dom/client');
const act = React.act ?? (await import('react-dom/test-utils')).act;
const root = createRoot(document.querySelector('#app'));
const ref = React.createRef();
let clicks = 0;
await act(async () => root.render(React.createElement(Icons.Mosque, { ref, onClick: () => clicks++, 'aria-label': 'Mosque' })));
assert.equal(ref.current.tagName, 'svg');
ref.current.dispatchEvent(new MouseEvent('click', { bubbles: true }));
assert.equal(clicks, 1);
await act(async () => root.render(React.createElement(Icons.Mosque, { size: 48, ref })));
assert.equal(ref.current.getAttribute('width'), '48');
await act(async () => root.unmount());
console.log('React: original exports, 312 baseline renders, customization, refs and DOM events passed');
