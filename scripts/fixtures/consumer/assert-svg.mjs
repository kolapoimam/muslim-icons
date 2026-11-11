import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
export function geometry(nodes) {
  return [...nodes].filter(node => node.nodeType === 1).map(node => ({
    tag: node.tagName,
    attrs: Object.fromEntries([...node.attributes].map(attr => [attr.name, attr.value])),
    children: geometry(node.childNodes),
  }));
}
export function assertSvg(markup, icon, customized = false) {
  const svg = new JSDOM(markup, { contentType: 'text/html' }).window.document.querySelector('svg');
  assert.ok(svg, icon.name);
  assert.deepEqual(geometry(svg.childNodes), icon.nodes, `${icon.name}: geometry`);
  assert.equal(svg.getAttribute('width'), customized ? '48' : '24');
  assert.equal(svg.getAttribute('stroke'), customized ? '#246b55' : 'currentColor');
  assert.equal(svg.getAttribute('stroke-width'), customized ? '0.75' : '2');
  assert.equal(svg.getAttribute('viewBox'), '0 0 24 24');
  if (customized) {
    assert.equal(svg.getAttribute('role'), 'img');
    assert.equal(svg.getAttribute('aria-label'), 'Example icon');
    assert.equal(svg.getAttribute('aria-hidden'), null);
  } else assert.equal(svg.getAttribute('aria-hidden'), 'true');
}
export const customProps = { size: 48, color: '#246b55', strokeWidth: 1.5, absoluteStrokeWidth: true, 'aria-label': 'Example icon' };
export function installDom() {
  const dom = new JSDOM('<div id="app"></div>', { pretendToBeVisual: true });
  for (const key of ['window', 'document', 'navigator', 'HTMLElement', 'Element', 'Node', 'Text', 'Comment', 'Event', 'MouseEvent', 'MutationObserver', 'SVGElement']) Object.defineProperty(globalThis, key, { value: key === 'window' ? dom.window : dom.window[key], configurable: true, writable: true });
  globalThis.requestAnimationFrame = dom.window.requestAnimationFrame.bind(dom.window);
  globalThis.cancelAnimationFrame = dom.window.cancelAnimationFrame.bind(dom.window);
  return dom;
}
