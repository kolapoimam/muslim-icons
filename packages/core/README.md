# Shared core (private)

`icons/` is the single source of truth for every public distribution. The original 104 SVGs were moved here without changing their bytes. The shared Node module validates SVGs, reads metadata, and exposes an element tree to the framework generators.

This workspace is private. Framework packages contain generated output and do not depend on core at runtime. Edit original artwork here, never generated components or the SVG distribution's `dist/icons/`.

Keep the root SVG's 24 × 24 viewBox, `currentColor`, 2-unit stroke, rounded caps and joins, title, `data-category`, and `data-tags`. The parser accepts a restricted set of geometry elements and attributes and rejects scripts, external references, DTDs, event attributes, and foreign content.

See [CONTRIBUTING](../../CONTRIBUTING.md) and the [artwork notice](LICENSE).
