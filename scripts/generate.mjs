import { readdir, readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
const svgDir = new URL('../packages/svg/icons/', import.meta.url);
const out = new URL('../packages/react/src/generated/', import.meta.url);
const dest = new URL('../website/public/icons/', import.meta.url);
await mkdir(out,{recursive:true}); await mkdir(dest,{recursive:true});
const files=(await readdir(svgDir)).filter(x=>x.endsWith('.svg')).sort();
const index=[]; const catalog=[];
for (const file of files){
 const svg=await readFile(new URL(file,svgDir),'utf8');
 if(!/^<svg[^>]*viewBox="0 0 24 24"[^>]*>[\s\S]*<\/svg>\s*$/.test(svg))throw new Error(file+' missing 24x24 svg root');
 if(/<script|onload=|<foreignObject|<image|<use|href=/i.test(svg))throw new Error(file+' contains unsupported SVG features');
 const slug=file.slice(0,-4);const name=slug.split('-').map(x=>x[0].toUpperCase()+x.slice(1)).join('');
 const title=(svg.match(/<title>([^<]+)<\/title>/)||[])[1]||name;
 const category=((svg.match(/data-category="([^"]+)"/)||[])[1]||'General').replaceAll('&amp;', '&');
 const tags=((svg.match(/data-tags="([^"]+)"/)||[])[1]||'').split(',').map(x=>x.trim()).filter(Boolean);
 const body=svg.replace(/^[\s\S]*?<svg[^>]*>/,'').replace(/<\/svg>[\s\S]*$/,'').replace(/<title>[^<]*<\/title>/g,'').trim().replace(/\b(stroke-linecap|stroke-linejoin|stroke-width|fill-rule|clip-rule)=/g,(_,k)=>({'stroke-linecap':'strokeLinecap','stroke-linejoin':'strokeLinejoin','stroke-width':'strokeWidth','fill-rule':'fillRule','clip-rule':'clipRule'}[k]+'='));
 await writeFile(new URL(name+'.tsx',out),"import * as React from 'react';\nimport { createIcon } from '../IconBase';\nexport const "+name+" = createIcon('"+name+"', <>"+body+"</>);\n");
 index.push("export { "+name+" } from './"+name+"';");catalog.push({slug,name,label:title,category,tags});await copyFile(new URL(file,svgDir),new URL(file,dest));
}
await writeFile(new URL('index.ts',out),index.join('\n')+'\n');
await writeFile(new URL('../website/src/catalog.generated.ts',import.meta.url),'export const catalog = '+JSON.stringify(catalog,null,2)+' as const;\n');
console.log('Generated '+files.length+' icons');
