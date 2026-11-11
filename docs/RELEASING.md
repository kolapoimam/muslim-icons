# Publishing @muslim-icons/react

The package lives in `packages/react`. This repository uses npm **staged publishing** for the first version and subsequent releases requiring approval. An npm maintainer explicitly approves each staged version with 2FA on npmjs.com.

## Before staging

1. Confirm the npm organization `muslim-icons` exists and the publishing account can manage packages in that scope.
2. Enable two-factor authentication on the npm account, and review the original SVG artwork rights.
3. Create a granular npm token with **Read and write (stage only)** access to `@muslim-icons`, with a short expiration. Leave Bypass 2FA disabled.
4. Save the token as the GitHub Actions repository secret `NPM_PUBLISH_TOKEN`. Never commit or paste it into an issue.
5. Check that CI succeeds and create a Git tag matching the version, such as `v0.1.0`.

## Stage the release in GitHub

Open **Actions → Stage npm package** and select **Run workflow** from `main`. Enter `0.1.0`.

The workflow checks out tag `v0.1.0`, installs dependencies, runs tests, builds the package, verifies the compiled entry points, checks the tarball, and runs `npm stage publish --access public` inside `packages/react`.

Staging does **not** make the release installable. For a brand-new package it may create a public placeholder until you approve the staged version.

## Approve the release on npm

Sign in to npmjs.com as a package maintainer. Open the **Staged Packages** tab, review the queued `@muslim-icons/react` release, and click **Approve**. Complete the interactive 2FA challenge. Check https://www.npmjs.com/package/@muslim-icons/react after approval and try installing it in a separate React app.

## Future releases

After the first approval, consider configuring a trusted publisher in npm package settings for `kolapoimam/muslim-icons`, workflow filename `publish.yml`, which can eliminate the static token. Remove the `NPM_PUBLISH_TOKEN` secret and revoke its token if migrating.

Never reuse a published npm version. Update the package version, run CI, create the matching tag, and stage or publish each new version deliberately.

Reference: https://docs.npmjs.com/staged-publishing/
