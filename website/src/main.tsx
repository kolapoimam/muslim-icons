import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import * as Icons from '@muslim-icons/react';
import type { IconProps } from '@muslim-icons/react';
import { catalog } from './catalog';
import './style.css';

type IconComponent = React.ComponentType<IconProps>;
const icons = Icons as unknown as Record<string, IconComponent>;
const categories = ['All icons', ...new Set(catalog.map(item => item.category))];

function App() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All icons');
  const [selected, setSelected] = useState<string>('Mosque');
  const [size, setSize] = useState(32);
  const [stroke, setStroke] = useState(1.75);
  const [color, setColor] = useState('#17493f');
  const [copied, setCopied] = useState('');
  const filtered = useMemo(() => catalog.filter(item => {
    const search = (item.label + ' ' + item.name + ' ' + item.category + ' ' + item.tags.join(' ')).toLowerCase();
    return (category === 'All icons' || item.category === category) && search.includes(query.trim().toLowerCase());
  }), [query, category]);
  const item = catalog.find(x => x.name === selected) ?? catalog[0];
  const Preview = icons[item.name];
  async function copy(text: string, id: string) {
    try { await navigator.clipboard.writeText(text); setCopied(id); }
    catch { setCopied('unavailable'); }
  }
  async function copySvg() {
    const response = await fetch('/icons/' + item.slug + '.svg');
    if(response.ok) await copy(await response.text(), 'svg');
  }
  return <div className="app">
    <header className="header">
      <a href="#top" className="brand"><span className="symbol">☪</span> muslim<span className="brand-accent">icons</span><span className="period">.</span></a>
      <nav><a href="#explore">Icons</a><a href="#usage">Documentation</a><a href="https://github.com/kolapoimam/muslim-icons" target="_blank" rel="noreferrer">GitHub ↗</a></nav>
    </header>
    <main id="top">
      <section className="hero">
        <div><div className="eyebrow">OPEN SOURCE • DESIGNED FOR BUILDERS</div>
        <h1>Thoughtful icons.<br/><em>Meaningful products.</em></h1>
        <p>A consistent icon language for the experiences we're building together. Explore 50 free, original Muslim-themed SVG icons for modern applications.</p>
        <div className="hero-buttons"><a className="primary" href="#explore">Explore icons ↗</a><a className="secondary" href="#usage">Get started →</a></div>
        <div className="stats"><div><strong>50</strong><span>original icons</span></div><div><strong>7</strong><span>categories</span></div><div><strong>100%</strong><span>open source</span></div></div></div>
        <div className="hero-art"><div className="hero-mosaic">{['Mosque','PrayerMat','Quran','RamadanLantern','Kaaba','Tasbih','CrescentMoon','Hijab','Mihrab'].map((name,i)=>{const Icon=icons[name];return <div className={'mosaic-cell m'+i} key={name}>{Icon && <Icon size={i===4?65:42} strokeWidth={1.4}/>}</div>})}</div><span>CRAFTED FOR THE UMMAH</span></div>
      </section>
      <section id="explore" className="explore">
        <div className="eyebrow">THE COLLECTION / 001</div>
        <div className="section-title"><div><h2>Find your next icon.</h2><p>Browse symbols thoughtfully designed at a 24 × 24 grid.</p></div><span>{filtered.length} ICONS</span></div>
        <div className="search"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search mosque, prayer, Ramadan..." aria-label="Search icons"/></div>
        <div className="filters">{categories.map(c=><button aria-pressed={category===c} className={category===c?'selected':''} onClick={()=>setCategory(c)} key={c}>{c}</button>)}</div>
        <div className="workspace"><div className="grid">{filtered.map(icon=>{const Icon=icons[icon.name];return <button key={icon.slug} className={'icon-tile '+(item.name===icon.name?'chosen':'')} onClick={()=>setSelected(icon.name)} aria-label={'Preview '+icon.label}><div>{Icon && <Icon size={36} strokeWidth={1.65}/>}</div><span>{icon.label}</span></button>})}{filtered.length===0&&<p className="no-results">No icons found. Try another search.</p>}</div>
          <aside className="preview"><div className="preview-top"><span>ICON DETAILS</span><span>✳</span></div>
          <div className="preview-canvas">{Preview && <Preview size={size*2} color={color} strokeWidth={stroke}/>}</div><h3>{item.label}</h3><p>{item.category}</p>
          <label>Size <b>{size}px</b><input type="range" min={16} max={64} value={size} onChange={e=>setSize(+e.target.value)}/></label>
          <label>Stroke <b>{stroke}px</b><input type="range" min={1} max={3} step={0.25} value={stroke} onChange={e=>setStroke(+e.target.value)}/></label>
          <label className="color-row">Color <input type="color" value={color} onChange={e=>setColor(e.target.value)}/></label>
          <button className="copy-primary" onClick={()=>copy("import { "+item.name+" } from '@muslim-icons/react';",'import')}>{copied==='import'?'Copied!':'Copy React import'}</button>
          <button className="copy-secondary" onClick={()=>copy('<'+item.name+' size={'+size+'} strokeWidth={'+stroke+'} />','jsx')}>{copied==='jsx'?'Copied!':'Copy JSX example'}</button>
          <button className="copy-secondary" onClick={copySvg}>{copied==='svg'?'Copied!':'Copy SVG source'}</button>
          </aside>
        </div>
      </section>
      <section id="usage" className="usage"><div><div className="eyebrow">GET STARTED</div><h2>One import.<br/><em>Endless possibilities.</em></h2><p>Built for React, TypeScript, Next.js and Vite, with accessible SVG props and a tiny tree-shakable API.</p></div>
      <div className="code-window"><div className="code-title">terminal</div><pre>npm install @muslim-icons/react</pre><div className="code-title">App.tsx</div><pre>{"import { Mosque, Quran, Kaaba } from '@muslim-icons/react';\n\nexport default function App() {\n  return <Mosque size={32} color=\"currentColor\" />;\n}"}</pre><small>Package pending first npm publication.</small></div></section>
    </main>
    <footer><span className="brand">☪ muslim<span className="brand-accent">icons</span>.</span><p>Build once. Share freely. Help more developers build for the Ummah.</p><span>MIT software · CC0 intended original artwork</span></footer>
  </div>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
