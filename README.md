# RGE Solutions — Astro

Separate Astro migration of rgesol.com. The original PHP project and GoDaddy shared hosting remain unchanged. **Production is not launched. Website DNS cutover requires Tim's explicit approval.**

Private repository: https://github.com/timgabaree/rgesol.com-astro

## Development

Use Node from `.nvmrc`, then:

```sh
npm ci
npm run check
npm test
npm run build:staging
npm run test:integration
npm run preview
```

The Worker preview at http://127.0.0.1:8788 uses no-email dry-run mode. `npm run dev` runs the Astro page preview only; contact endpoints require the Worker preview. `npm run build:production` writes separate `dist-production` assets.

After a production build, `npm run test:site` checks internal links, image assets, structured metadata, sitemap targets and the downloadable contact card.

## Structure

- `src/pages`: page content, HTML/image sitemap, XSLT-free XML sitemap.
- `src/components`, `src/layouts`: shared navigation, footer, privacy choices.
- `public`: public assets only; no PHP, hosting configuration, credentials, or archives.
- `worker`: access control, security headers, contact validation, persistent abuse protection and Resend adapter.
- `tests`, `scripts`: automated verification and deployment preparation.

## Deployment boundaries

Staging: https://rgesol-com-astro-staging.timgabaree-com-astro.workers.dev

Staging requires Basic authentication before pages, downloads, or form endpoints. Its password is in macOS Keychain under `rgesol.com-astro-staging-basic-auth` (account `review`), not Git. Staging is noindex and does not load Google Analytics.

Production: `rgesol-com-astro-production`. Its configuration deliberately has `PRODUCTION_ENABLED=false`, no hostname routes, no workers.dev endpoint and no preview URLs. Do not change these settings before approved cutover.

`npm run deploy:staging` checks, tests, builds and deploys staging only. Production deployment is intentionally explicit:

```sh
npm run build:production
npx wrangler deploy --config wrangler.production.jsonc
```

With the checked-in closed configuration, this updates preparation only; it does not launch the site. A Git push is not a deployment.

## Email and analytics

Cloudflare secrets: `RESEND_API_KEY`, `CONTACT_FROM`, `CONTACT_TO`; staging additionally uses `STAGING_USER`, `STAGING_PASSWORD`. Never place their values in this repository or logs.

Sender: `RGE Solutions Website <website@forms.rgesol.com>`; recipient: `tim@rgesol.com`. Resend's verified `forms.rgesol.com` domain requires encrypted delivery. Each environment uses a separate sending-only key restricted to that domain. Provider acceptance and delivery are distinct checks.

Google Analytics property `G-G94X7J9MCF` loads only after opt-in on the production hostname. The small notice is dismissible without granting consent; footer privacy settings allow changing the choice. Advertising signals are disabled. Form contents are not analytics events. Existing Cloudflare Web Analytics uses automatic injection, excluding EU visitors; this setting is unchanged. Verify its beacon and reporting after launch rather than adding a duplicate manual snippet.

Monitoring integration is deferred until all four requested site migrations are complete. Current Worker error logging is sanitized and is not wired to the separate timgabaree.com alert system.

See [MIGRATION.md](MIGRATION.md) for evidence, remaining gates and rollback scope.
