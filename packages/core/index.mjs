import { readdir, readFile } from 'node:fs/promises';
import { SaxesParser } from 'saxes';

export const iconsDirectory = new URL('./icons/', import.meta.url);
const elements = new Set(['svg', 'g', 'path', 'circle', 'ellipse', 'rect', 'line', 'polyline', 'polygon', 'title', 'desc']);
const attributes = new Set(['xmlns', 'width', 'height', 'viewBox', 'fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'fill-rule', 'clip-rule', 'opacity', 'stroke-opacity', 'fill-opacity', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-miterlimit', 'transform', 'd', 'cx', 'cy', 'r', 'rx', 'ry', 'x', 'y', 'x1', 'y1', 'x2', 'y2', 'points', 'data-category', 'data-tags']);
const reactNames = { 'stroke-width': 'strokeWidth', 'stroke-linecap': 'strokeLinecap', 'stroke-linejoin': 'strokeLinejoin', 'fill-rule': 'fillRule', 'clip-rule': 'clipRule', 'stroke-opacity': 'strokeOpacity', 'fill-opacity': 'fillOpacity', 'stroke-dasharray': 'strokeDasharray', 'stroke-dashoffset': 'strokeDashoffset', 'stroke-miterlimit': 'strokeMiterlimit' };

export function parseIcon(source, filename) {
  if (!/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*\.svg$/.test(filename)) throw new Error(`Invalid icon filename: ${filename}`);
  const parser = new SaxesParser();
  const stack = [];
  let root;
  parser.on('doctype', () => { throw new Error(`${filename}: DOCTYPE is forbidden`); });
  parser.on('processinginstruction', () => { throw new Error(`${filename}: processing instructions are forbidden`); });
  parser.on('opentag', ({ name, attributes: attrs }) => {
    if (!elements.has(name) || (name === 'svg' && stack.length)) throw new Error(`${filename}: unsupported element ${name}`);
    for (const [key, value] of Object.entries(attrs)) {
      if (!attributes.has(key) || /url\s*\(|[{}]/i.test(value)) throw new Error(`${filename}: unsupported attribute ${key}`);
    }
    const node = { tag: name, attrs: { ...attrs }, children: [] };
    if (stack.length) stack.at(-1).children.push(node);
    else root = node;
    stack.push(node);
  });
  parser.on('text', text => {
    if (!text.trim()) return;
    if (!['title', 'desc'].includes(stack.at(-1)?.tag)) throw new Error(`${filename}: unexpected text`);
    stack.at(-1).text = (stack.at(-1).text ?? '') + text;
  });
  parser.on('closetag', () => { stack.pop(); });
  parser.on('error', error => { throw new Error(`${filename}: ${error.message}`); });
  parser.write(source).close();
  if (root?.tag !== 'svg' || root.attrs.viewBox !== '0 0 24 24') throw new Error(`${filename}: expected a 24 × 24 SVG`);
  for (const [key, value] of Object.entries({ xmlns: 'http://www.w3.org/2000/svg', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })) {
    if (root.attrs[key] !== value) throw new Error(`${filename}: expected ${key}=${value}`);
  }
  const title = root.children.find(node => node.tag === 'title')?.text;
  if (!title || !root.attrs['data-category'] || !root.attrs['data-tags']) throw new Error(`${filename}: missing title, category or tags`);
  const slug = filename.slice(0, -4);
  const name = slug.split('-').map(word => word[0].toUpperCase() + word.slice(1)).join('');
  function artwork(nodes) {
    return nodes.filter(node => !['title', 'desc'].includes(node.tag)).map(node => ({ ...node, children: artwork(node.children) }));
  }
  return { slug, name, label: title, category: root.attrs['data-category'], tags: root.attrs['data-tags'].split(',').map(tag => tag.trim()).filter(Boolean), source, nodes: artwork(root.children) };
}

export async function loadIcons(directory = iconsDirectory) {
  const filenames = (await readdir(directory)).filter(file => file.endsWith('.svg')).sort();
  if (!filenames.length) throw new Error('The canonical icon collection is empty');
  const icons = await Promise.all(filenames.map(async filename => parseIcon(await readFile(new URL(filename, directory), 'utf8'), filename)));
  if (new Set(icons.map(icon => icon.name)).size !== icons.length) throw new Error('Duplicate component names');
  return icons;
}

export function catalogOf(icons) {
  return icons.map(({ slug, name, label, category, tags }) => ({ slug, name, label, category, tags }));
}

export function jsxNodes(nodes) {
  return nodes.map(({ tag, attrs, children }) => `<${tag}${Object.entries(attrs).map(([key, value]) => ` ${reactNames[key] ?? key}={${JSON.stringify(value)}}`).join('')}${children.length ? `>${jsxNodes(children)}</${tag}>` : '/>'}`).join('');
}

export function svelteNodes(nodes) {
  const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  return nodes.map(({ tag, attrs, children }) => `<${tag}${Object.entries(attrs).map(([key, value]) => ` ${key}="${escape(value)}"`).join('')}>${svelteNodes(children)}</${tag}>`).join('');
}
