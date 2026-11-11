# Contributing to Muslim Icons

We welcome original icon designs, improvements, tests, and documentation.

1. Add artwork only in `packages/core/icons/`. Create a 24×24 SVG with `viewBox="0 0 24 24"`, transparent background, `stroke="currentColor"`, 2px stroke, and round caps/joins.
2. Use lowercase kebab-case filenames, a `<title>`, `data-category`, and comma-separated `data-tags` on the root SVG.
3. Make symbols recognizable at 24px. Avoid unnecessary detail, embedded fonts, remote resources, scripts, raster images, and inline event handlers.
4. Confirm in your PR that your artwork is original, you own all rights required, and you agree to release it under CC0-1.0. Do not submit copied third-party artworks.
5. Run `npm ci`, `npm test`, `npm run build`, `npm run typecheck`, `npm run verify:packages`, and `npm run test:packages`. Include a screenshot where a visual change needs review.
6. Review includes geometry, consistency, respectful representation, accessibility, and license provenance.

Generated React, Vue, Svelte, SVG-distribution, and demo output is ignored by Git. Component names come from SVG filenames and must stay consistent across packages. Preserve existing names when updating artwork.

Add a changeset with `npm run changeset` for user-facing changes. Shared artwork changes affect all four public packages; framework-specific fixes can version that package alone. The core and demo workspaces are private.
