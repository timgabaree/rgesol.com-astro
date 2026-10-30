# RGE Solutions — Astro

## Plain-language production update — October 28, 2026

Home, About and Contact now use the same practical, plain-language style as
Tim's résumé and personal site. About is complete, service names and contact
topic labels agree, and search/social descriptions reflect the revised copy.
The homepage correctly identifies **$25M in projected savings**, not $25M+ in
realized savings. Results are explicitly attributed to Tim's leadership roles.

Published directly with owner approval as production version
`59f2a97b-fa60-496f-9765-6dbcbe4923fd`. Clean Astro/TypeScript checks, 37 unit tests,
325 production site checks and 118 read-only live checks passed. Desktop and
320/390-pixel browser previews showed no horizontal overflow; the live About page
was visually verified. These are not new PageSpeed or physical-phone results.

Design styles, images, links, contact addresses, form topic IDs, email safeguards,
analytics controls, monitoring, staging, GoDaddy and all DNS remain unchanged.
Only the displayed topic names used in the form and email labels changed; no
contact email was sent. The owner reviewed the live update and approved committing
and pushing the source, tests and notes to this Astro repository. Git publication
does not trigger another deployment. See [MIGRATION.md](MIGRATION.md) for release
and rollback evidence.

## Monitoring — October 29, 2026

UptimeRobot Solo 50 annual now provides five RGE checks: homepage content/TLS `804475316`, exact www redirect/TLS `804475319`, contact-page markup `804475329`, form readiness `804475330`, and RGE-only email failures `804475333`. Homepage/email checks run every minute; www/contact checks every five minutes. Alerts go to `tim@timgabaree.com`, as Tim clarified October 29; account login remains `timgabaree@gmail.com`. Certificate expiry reminders at 30/14/7/0 days apply once per hostname. The original homepage monitor `804464221` is paused with history preserved.

Both staging and production persist immediate contact-send failures to the separate `family-sites-email-monitor` Worker. A signed Resend receiver filters RGE events by application/environment and `timgabaree@rgesol.com`. The RGE-only public probe is `/delivery-status/rgesol`. Shared monitor `804464267` now checks receiver/storage health at `/monitor-status`, not combined delivery failures. Site-specific primary/fallback stores prevent cross-site overwrites; no form contents or visitor details are stored. Only a newer verified delivery can automatically clear matching delivery incidents.

The receiver, tests, and operational runbook are maintained in the sibling `carriegabaree.com-astro` repository (`MONITORING.md`, `wrangler.monitoring.jsonc`, and `scripts/email-monitor-admin.mjs`). Since October 30, newer signed delivery confirmations automatically resolve matching RGE environment/recipient failures; repeated healthy scheduled storage checks resolve monitor-runtime incidents. Investigate active alerts; manual acknowledgement of an exact reviewed revision remains available when needed. Resolution history is available through the admin script's `history` command. Secrets remain in Cloudflare/Keychain, never Git. The disabled legacy SQL rule remains unchanged. Finn and Clint have no contact forms and therefore do not need delivery-event monitoring. RGE website/staging deployments and all DNS/GoDaddy settings were unchanged by these monitoring updates.

Historical October 28 verification: 34 RGE unit tests and clean type checks; production/staging builds and deployments passed with no changed page assets. Live route, header, redirect, private-file, vCard, script, and all 28 media-file checks passed; staging remained protected and production workers.dev remained disabled. No inquiry was sent for this monitoring setup.

Automatic alert test: synthetic RGE signed failure plus Carrie fallback test produced UptimeRobot incident `373980481164829341` at 18:44:54 Central. Tim confirmed its DOWN email arrived. Clearing the exact two test revisions restored healthy status; UptimeRobot resolved at 18:48:08 and recorded recovery-email dispatch at 18:48:11. Real site availability and contact recipients were unchanged throughout.

Separate Astro migration of rgesol.com, launched on Cloudflare on 2026-10-28 with Tim's approval. The original PHP project and GoDaddy shared hosting remain available for rollback. See `MIGRATION.md` for launch evidence and remaining follow-up.

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

Production: `rgesol-com-astro-production`, serving `rgesol.com` and `www.rgesol.com` with `PRODUCTION_ENABLED=true`. The Worker redirects HTTP and www to `https://rgesol.com`, preserving paths and queries. Its workers.dev endpoint and preview URLs remain disabled. Use the versioned release workflow below only when publication is authorized, preserving existing hostname bindings.

`npm run deploy:staging` checks, tests, builds and deploys staging only. Production deployment is intentionally explicit:

```sh
npm run build:production
npx wrangler versions upload --config wrangler.production.jsonc
# Use the version ID returned by the upload:
npx wrangler versions deploy <version-id>@100 --config wrangler.production.jsonc
```

The checked-in production configuration is live: deploying a version updates the public site. Upload alone does not shift traffic. Do not run trigger changes as part of a code-only release. A Git push is not a deployment.

## Email and analytics

Cloudflare secrets: `RESEND_API_KEY`, `CONTACT_FROM`, `CONTACT_TO`; staging additionally uses `STAGING_USER`, `STAGING_PASSWORD`. Never place their values in this repository or logs.

Public contact address, form recipient in both environments, and launch-test recipient: `timgabaree@rgesol.com`, per Tim's final launch instruction. The authenticated sender remains `RGE Solutions Website <website@forms.rgesol.com>` so it uses the verified isolated sender domain without changing mailbox DNS. Resend requires encrypted delivery. Each environment uses a separate sending-only key restricted to that domain. Provider acceptance and delivery are distinct checks.

Google Analytics property `G-G94X7J9MCF` loads only after opt-in on the production hostname. The small notice is dismissible without granting consent; footer privacy settings allow changing the choice. Advertising signals are disabled. Form contents are not analytics events. Existing Cloudflare Web Analytics uses automatic injection, excluding EU visitors; this setting is unchanged. Verify its beacon and reporting after launch rather than adding a duplicate manual snippet.

Monitoring is enabled through the separate shared RGE/Carrie receiver described above. Sanitized logging remains enabled; Tim's independent alert system is unchanged.

See [MIGRATION.md](MIGRATION.md) for evidence, remaining gates and rollback scope.
