# Publishing @muslim-icons/react

Publish from the `packages/react` workspace, not the monorepo root.

## First publication

Before publishing:
1. Ensure that the `muslim-icons` npm organization exists and you can publish to it. The GitHub account does not grant ownership of the npm scope.
2. Review original SVG licensing and contributor rights.
3. Verify GitHub CI, the full production build, and a test installation in a clean React project.
4. Inspect the tarball.

```sh
npm install
npm test
npm run build
npm pack --workspace @muslim-icons/react --dry-run
npm login
npm publish --workspace @muslim-icons/react --access public
```

The first release requires npm account authorization and 2FA, because the package must exist before a trusted publisher can be configured. The package version currently is `0.1.0`. The tarball must include compiled ESM/CJS, declarations, LICENSE and README.

## Subsequent releases: GitHub Actions trusted publishing

After the first publication, under the npm package's **Settings → Trusted publishing**, configure:

- GitHub user: `kolapoimam`
- Repository: `muslim-icons`
- Workflow filename: `publish.yml`
- Permit `npm publish`

This authorizes the manual workflow in `.github/workflows/publish.yml` to publish with OIDC rather than an npm token. The workflow checks out a version tag, installs dependencies, runs tests, builds, and publishes. It requires Node 24 and npm 11.5.1 or newer.

For each release, change the version in `packages/react/package.json`, document the change, merge after CI passes, create a matching `vX.Y.Z` tag, then run the workflow with that version.

Verify the resulting package at https://www.npmjs.com/package/@muslim-icons/react. A previously published npm version cannot be overwritten.
