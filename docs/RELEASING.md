# Publishing Muslim Icons

The four public workspaces are `@muslim-icons/react`, `@muslim-icons/vue`, `@muslim-icons/svelte`, and `@muslim-icons/svg`. Core, the repository root, and the demo are private. Each public package has its own version and can be staged independently.

The release workflow uses npm staged publishing. Submitting a tarball does not make it installable: a maintainer approves it on npm with 2FA.

## 1. Record changes

```bash
npm run changeset
```

Select affected public packages. A shared artwork change affects all four packages; a framework-specific change can affect only that package. The initial changeset prepares React's next patch and first `0.1.0` versions for Vue, Svelte, and SVG.

## 2. Prepare independent versions

On a release branch, run:

```bash
npm ci
npm run version-packages
npm test
npm run build
npm run typecheck
npm run verify:packages
npm run test:packages
```

Review and commit the updated versions, changelogs, consumed changesets, and lockfile. Use a current npm version with `npm stage` support when staging locally. `0.0.0` versions are development placeholders and cannot be submitted by the staging script.

Merge the prepared release commit through your normal review process. Every selected package version must match that commit. Never reuse a published version or move an existing release tag.

## 3. Identify the source

Use the release commit's full 40-character SHA or a package-specific tag:

```bash
git tag @muslim-icons/vue@0.1.0 <release-commit-sha>
git push origin @muslim-icons/vue@0.1.0
```

One commit can contain several independently versioned packages. The workflow accepts that commit SHA to stage them together. Existing `v0.x.x` tags remain unchanged and available as historical React releases.

## 4. Configure npm access

The npm publishing account must have permission for each package under the `muslim-icons` scope. Before first release, check that the Vue, Svelte, and SVG package names are available and that the repository's `NPM_PUBLISH_TOKEN` covers the new names or the scope.

Keep the existing granular **Read and write (stage only)** token in the GitHub Actions secret `NPM_PUBLISH_TOKEN`. Keep Bypass 2FA disabled. The secret is passed only to the final staging step. Never paste credentials into commits, issues, or workflow inputs.

A trusted publisher can be considered later after verifying the intended npm publishing flow for each package; this migration preserves staged publishing and maintainer approval.

## 5. Inspect and stage

Open **Actions → Stage npm packages**. Enter the immutable source ref, choose one package or `all`, and leave `dry_run` enabled for the first inspection.

The workflow installs from the lockfile, tests, builds, checks types, validates tarballs in standalone consumers, and packs the selection. Download the inspected tarballs from its artifacts. A dry run does not submit packages.

Run it again with `dry_run` disabled when ready. The script preflights every selected package and skips versions already publicly published. It submits the exact packed tarballs with public access and the `latest` tag. This flow accepts stable versions only; prerelease versions require a separate dist-tag flow.

For local staging from a clean committed checkout with npm authentication already configured:

```bash
npm run build
npm run stage-packages -- --packages vue,svg --dry-run
npm run stage-packages -- --packages vue,svg --publish
```

Without `--publish`, the command is always a dry run. Individual clean builds also work, such as `npm run build -w @muslim-icons/vue`; selected packages must be built before staging.

### Partial success and retries

Multi-package staging is not atomic. The command reports a result for each package and stops on a failed submission. Earlier successful submissions remain staged. Review npm **Staged Packages** before retrying a selection; a staged-but-unapproved version is not yet a publicly published version, so it will not be automatically skipped. Retry only packages that still need submission.

Registry failures other than a genuine missing-package `E404` abort the preflight; they are not treated as a new package.

## 6. Approve on npm

Sign in as a package maintainer, open **Account Settings → Staged Packages**, review each selected version, and approve it with 2FA. Until approval, a new package may show a placeholder and the submitted version is not installable.

After approval, verify the public version and try installing it in a fresh project:

```bash
npm view @muslim-icons/vue version
npm install @muslim-icons/vue
```

Repeat for every approved package. React users can keep their existing imports throughout this migration.

Reference: https://docs.npmjs.com/staged-publishing/
