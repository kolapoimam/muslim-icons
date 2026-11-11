import test from 'node:test';import assert from 'node:assert/strict';import {readdir,readFile} from 'node:fs/promises';
const dir=new URL('../packages/svg/icons/',import.meta.url);
test('all SVGs are consistent and safe',async()=>{const files=(await readdir(dir)).filter(f=>f.endsWith('.svg'));assert.equal(files.length,104);for(const file of files){const svg=await readFile(new URL(file,dir),'utf8');assert.match(svg,/viewBox="0 0 24 24"/);assert.match(svg,/stroke="currentColor"/);assert.match(svg,/stroke-width="2"/);assert.match(svg,/stroke-linecap="round"/);assert.match(svg,/stroke-linejoin="round"/);assert.doesNotMatch(svg,/<script|onload=|<foreignObject|<image|<use|href=/i);assert.doesNotMatch(svg,/&(?!amp;|lt;|gt;|quot;|apos;|#\d+;|#x[0-9a-f]+;)/i);}});
test('SVG filenames are unique',async()=>{const files=(await readdir(dir)).filter(f=>f.endsWith('.svg'));assert.equal(new Set(files).size,files.length)});
test('generated exports and website assets match SVGs',async()=>{const names=(await readdir(dir)).filter(f=>f.endsWith('.svg')).sort();const generated=new URL('../packages/react/src/generated/',import.meta.url);const published=new URL('../website/public/icons/',import.meta.url);const index=await readFile(new URL('index.ts',generated),'utf8');const cat=await readFile(new URL('../website/src/catalog.generated.ts',import.meta.url),'utf8');for(const filename of names){const name=filename.slice(0,-4).split('-').map(x=>x[0].toUpperCase()+x.slice(1)).join('');assert.ok(index.includes("export { "+name+" } from './"+name+"';"));assert.ok(cat.includes('"name": "'+name+'"'));const source=await readFile(new URL(filename,dir),'utf8');assert.equal(await readFile(new URL(filename,published),'utf8'),source);assert.ok((await readFile(new URL(name+'.tsx',generated),'utf8')).includes('export const '+name+' = createIcon'));}});

test('every icon has distinct drawing geometry and meaningful metadata',async()=>{
 const seen=new Map();
 for(const file of (await readdir(dir)).filter(f=>f.endsWith('.svg'))){
  const svg=await readFile(new URL(file,dir),'utf8');
  assert.match(svg,/<title>[^<]+<\/title>/,file+' has a title');
  assert.match(svg,/data-category="[^"]+"/,file+' has a category');
  assert.match(svg,/data-tags="[^"]+"/,file+' has search tags');
  const geometry=svg.replace(/<svg[^>]*>|<title>[^<]*<\/title>|<\/svg>|\s+/g,'');
  assert.ok(!seen.has(geometry),file+' duplicates '+seen.get(geometry));
  seen.set(geometry,file);
 }
});

test('internal demo resolves the current local package version',async()=>{
 const pkg=JSON.parse(await readFile(new URL('../packages/react/package.json',import.meta.url),'utf8'));
 const demo=JSON.parse(await readFile(new URL('../website/package.json',import.meta.url),'utf8'));
 assert.equal(demo.dependencies[pkg.name],pkg.version);
});
