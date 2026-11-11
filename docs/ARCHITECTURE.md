# Architecture and compatibility

## Dependency direction

`packages/core/icons` → shared parser → framework generators → independently packed public packages.

Core is private and used only during repository builds. Vue has a Vue peer, Svelte has a Svelte peer, and React retains its React peer. The SVG distribution has no runtime dependencies. Framework packages do not import one another or core at runtime.

## React compatibility

The `IconBase.tsx` implementation and React root exports remain unchanged. `IconProps`, `createIcon`, all 104 names, React 18/19 peer support, ref forwarding, ESM/CJS entry points, and TypeScript declarations remain available. The migration baseline records asset hashes, export names, and three original renders per icon from commit `3cd2deb443c71885998f594f3f0d3209d2f67d1f`.

React's API type is intentionally not shared with Vue or Svelte: each framework has its own native attribute types. Common custom props and artwork have equivalent behavior across adapters.

## Generation

Run `npm run generate` for every target or `node scripts/generate.mjs --target vue` for one target. Every package build has a prebuild generator, so clean individual builds work. Generated directories are cleared before output is written, preventing removed icons from surviving a build. The canonical SVG collection is fully validated before output changes.

Vue components render native VNodes. Svelte uses native Svelte 5 components and the standard `svelte-package` library build. Raw SVG exports retain the canonical XML exactly. Metadata is derived from the SVG source rather than maintained in a second registry.

The legacy `packages/svg/icons` source path moves to `packages/core/icons`. `packages/svg` now contains the publishable vanilla distribution; generated artwork lives in its `dist/icons`. React consumer imports do not change.

## Validation

- Source tests validate unchanged SVG hashes, uniqueness and parser rejection of active SVG content.
- Generator tests validate catalog parity, target isolation, stale-file removal and determinism.
- Workspace type checks cover React, Vue, Svelte and vanilla TypeScript output.
- Packed consumer tests install tarballs into a separate project, compare original React renders, render all framework icons on the server, exercise browser DOM props/events, and compile consumer TypeScript, Vue and Svelte examples.
- Public entry points, file whitelists, metadata, raw-file exports and independent release selection are checked before staging.

`npm run test:packages` uses isolated temporary projects outside the repository and an ignored npm cache. It requires registry access to install framework peers. The separate public landing-page repository is unaffected.

## Versioning and attribution

Changesets versions public packages independently. The internal demo resolves the local React workspace with `*` so an adapter release cannot cause a registry lookup for an unpublished sibling. The root, core, and demo remain private. New public workspaces start at `0.0.0`; the initial minor changesets produce `0.1.0`.

Commits and package author metadata credit [kolapoimam](https://github.com/kolapoimam). The repository's `.mailmap` continues to consolidate the older local identity.
