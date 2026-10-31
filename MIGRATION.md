# Migration and launch status — 2026-10-28

## Current state

- Local PHP content and approved local improvements migrated into a separate Astro checkout. PHP source and shared GoDaddy hosting unchanged.
- Private GitHub repository: https://github.com/timgabaree/rgesol.com-astro. Source and preparation notes are maintained separately from the PHP repository; pushes do not deploy automatically.
- Production launched on Cloudflare at approximately 22:17 UTC with Tim's explicit approval. Both `rgesol.com` and `www.rgesol.com` are custom domains on `rgesol-com-astro-production`; HTTP/www redirect to the canonical HTTPS apex. Staging remains protected; production workers.dev and preview URLs remain disabled.
- New isolated Resend sender domain `forms.rgesol.com` verified, with TLS Enforced. Only three new sender-verification DNS records were added; existing website and mailbox records were not edited.
- Staging sending-only credential securely configured. Protected Cloudflare contact endpoint test delivered to `tim@rgesol.com` at 20:42 UTC (Resend ID `01a1843f-f2ed-7142-9032-f026502b5ef7`). Inbox confirmation remains pending.
- The unused production key that appeared in a tool response was permanently revoked with Tim's approval; it had no activity and was never installed. Its replacement (`a523691f-b290-4ed7-b46b-e2744275829b`) has sending-only access restricted to `forms.rgesol.com`, stored in Cloudflare secrets and macOS Keychain. Temporary plaintext handoff removed; no secret values in Git.
- Private production-credential test delivered to `tim@rgesol.com` at 22:03 UTC / 5:03 p.m. Central (Resend ID `01a1848a-0284-741d-a13a-67cbccf68785`). This used the local Astro `sendMail` adapter and the production credential, not the public production Worker. Resend confirms Delivered, and Tim confirmed receipt.
- Latest protected staging version: `6e387af1-906a-420b-aa2a-02391d9e5ce7`. Live production version: `59f2a97b-fa60-496f-9765-6dbcbe4923fd`, with `PRODUCTION_ENABLED=true` and both custom domains attached. The plain-language release below supersedes footer-style version `7794bf6f-6ed1-4924-9ffe-a9c0e00b7849`. The footer fix (`1be868d`) remains included. Staging, routes, DNS, and GoDaddy were unchanged.
- Tim's final launch instruction makes `timgabaree@rgesol.com` the public address, both environments' form recipient, fallback address, and live-test recipient. Historical pre-launch tests above went to the previously approved `tim@rgesol.com`; their records are retained accurately. The verified authenticated sender remains `website@forms.rgesol.com`; mailbox DNS was not changed for this address update.
- One live browser form test, `RGE Cloudflare Live Cutover Test`, reached `/thank-you`. Resend confirms Delivered to `timgabaree@rgesol.com` at 22:17 UTC, ID `01a18497-1660-7e77-9514-60f1c0fba628`. User inbox confirmation is pending.

## Verification

### Plain-language production release — October 28, 2026

- Owner approved direct production publication for review. Updated Home, About,
  Contact, shared navigation labels, search/social/structured descriptions and
  contact topic display names. Completed About using supported existing experience.
- Corrected `$25M+` / unqualified cost savings to `$25M` / projected savings
  identified. The section now attributes the results to Tim's leadership roles,
  rather than implying that all results came from RGE client engagements.
- Existing styles, images, URLs, classes, IDs and form values/actions are unchanged.
  Contact Worker edits change only the six topic label strings, not validation,
  recipients, sending behavior, state or security.
- Zero Astro/TypeScript diagnostics; 37 unit tests and 325 build/site checks pass.
  Added regressions for financial qualification, completed About and metadata,
  plus consistent service/form/email labels with stable topic IDs.
- 118 read-only live checks pass: six page bodies exactly match the production
  build, security/indexing headers, canonical and legacy redirects, private-file
  404s, CSS/scripts/vCard/XML sitemap and all 28 media hashes, staging 401,
  production workers.dev 404.
- Desktop Home/About and 320/390-pixel Home/About/Contact layouts reviewed; no
  horizontal overflow. Live About visually verified. Browser emulation only;
  no new physical-phone or PageSpeed measurement.
- Version upload followed by 100% version deployment preserved existing hostname
  bindings. Previous production version: `7794bf6f-6ed1-4924-9ffe-a9c0e00b7849`.
  Current production version: `59f2a97b-fa60-496f-9765-6dbcbe4923fd`.
- No contact email, secret update, staging deployment,
  GoDaddy change or DNS change. After reviewing the live release, the owner
  approved committing and pushing the source, tests and notes to the RGE Astro
  repository. This source publication does not redeploy production.

### Earlier release and launch evidence

- October 28 footer release: clean type checks, 34 unit tests, production build, and 325 site checks passed. Live footer font/color/spacing match neighboring links; Enter opens privacy choices and Escape closes them with visible keyboard focus restored. Six live page/sitemap responses and security headers passed; served CSS hash matches the production build and the www redirect preserves path/query. No email was sent.
- Astro/TypeScript check: 0 errors, 0 warnings, 0 hints.
- 31 unit tests pass: validation, abuse protection, same-origin/CSRF enforcement, provider failures, production closure, consent and conversion behavior.
- 70 local Cloudflare runtime/build checks pass, with email disabled.
- 325 production link, asset, page-landmark, structured-data, XML-sitemap and contact-download checks pass. Production dependency audit: no known vulnerabilities reported.
- All six main pages fit 320, 768 and 1440-pixel viewports without horizontal overflow; one h1 each, no detected broken images. Mobile navigation opens with Enter, closes with Escape and restores button focus. Skip link and footer privacy controls work from the keyboard. Required fields focus the first invalid field; a keyboard-submitted local form completed in no-email mode.
- Mobile home, contact and privacy layouts and desktop image gallery were visually reviewed. Browser review recorded no console errors. The vCard browser download matched the served asset. The QR payload was decoded as `https://rgesol.com/rgesolutions.vcf`; its linked card's malformed address field and missing logo URL were corrected in Astro only.
- Separate staging and production builds pass; deploy assets reject PHP and private source/configuration.
- At migration, normalized homepage, about and thank-you text matched the local PHP source. The approved plain-language release below intentionally supersedes Home and About parity; contact and privacy also contain intentional updates. `scripts/verify-content.mjs` is a historical migration comparison, not a current release gate.
- Gold-text contrast issues identified in the first audit were corrected without layout changes. Repeat local production-build Lighthouse: mobile **96/100/100/100**, desktop **100/100/100/100** (Performance/Accessibility/Best Practices/SEO). Lighthouse 13.5.0; mobile Moto G Power/Slow 4G. Full reports retained in ignored `.local/lighthouse-mobile.json` and `.local/lighthouse-desktop.json`. These are laboratory preview results, not live PageSpeed or field measurements; analytics was hostname-gated off on localhost.
- Existing Cloudflare Web Analytics property `62dfae33485f4655916fb34e84ea1c84` is configured for rgesol.com with automatic injection excluding EU visitors. This setting was left unchanged. On the live contact page, the injected Cloudflare beacon is present; Google `G-G94X7J9MCF` is absent before consent and appears after Allow cookies. No duplicate beacon was added. Reporting-dashboard event/visit verification remains follow-up, not established by script presence alone.
- Real staging contact delivery verified in Resend, not merely inferred from the success page.
- Post-deploy verification at 22:09 UTC: all six main staging pages, CSS, vCard and XML sitemap exactly match the local build; unauthenticated requests return 401, authenticated responses are noindex/no-store, staging robots disallows crawling, the contact token is in real-email mode, private files return 404, and the production workers.dev address remains unavailable (404). No additional email was sent during these checks.
- Launch checks at 22:19 UTC passed: six public pages, HTTP/www canonical redirects, five legacy PHP redirects, real/private-file 404s, wrong-method 405, crawlable general robots rules, XSLT-free image sitemap, vCard/CSS/contact-script matches, and all 28 media assets hash-matched the production build. Staging returns 401; the production workers.dev endpoint returns 404. HTTPS certificate validation and a TLS 1.2 handshake pass. Local macOS temporarily cached a negative www lookup during replacement; public resolvers 1.1.1.1 and 8.8.8.8 resolved both names, and www redirects were verified using public DNS with normal certificate validation.
- Live 390-pixel homepage has no horizontal overflow or detected broken images. Keyboard navigation opens with Enter, closes with Escape and returns focus. Browser form submission completed successfully with no recorded console errors.
- Browser navigation to `https://www.rgesol.com/about?launch=1` successfully redirects to `https://rgesol.com/about?launch=1`; the local command-line negative cache does not reproduce in Chrome.
- Live Google PageSpeed report: https://pagespeed.web.dev/analysis/https-rgesol-com/bs8g54gsw9 — mobile **99/100/100/100**, desktop **100/100/100/100** (Performance/Accessibility/Best Practices/SEO). Mobile LCP 1.5 seconds, TBT 0 ms, CLS 0. These are single-run lab results; the report has no real-user field data yet.

## Archive and rollback

The deployed primary-domain document root is `/home/ma81y7v45nyj/public_html` on the GoDaddy shared account. A targeted archive includes the RGE site only; it excludes addon domains, account-wide files, mailbox data, logs and unrelated archives. No server-side files were written.

85 archived files matched SHA-256 manifests before and after the read-only capture. Local extraction and ZIP integrity checks passed. A live restore has not been attempted.

- Original archive: `/Volumes/StudioStack NVMe/Website Archives/rgesol.com/2026-10-28-pre-cutover/godaddy-rgesol.com.tar.gz`
- SHA-256: `adb718840cb582f231248a5e87239f5152625345138da9c629752f67b3c276b0`
- Dropbox copy: `/Volumes/StudioStack NVMe/Dropbox/Work Files/Websites/Archive/rgesol.com-GoDaddy-2026-10-28/godaddy-rgesol.com-backup.zip`
- ZIP SHA-256: `3a81bbe7f13e768981a77a93b0c42eb9e917ba08688ae77adb85294e8d023d3d`
- Verification evidence accompanies both archives. Off-device Dropbox sync has not been independently verified.

Full DNS export before sender setup is stored outside Git alongside the archive and in ignored `.local/dns-before-resend-2026-10-28.txt`. The existing website records are proxied A apex → `72.167.204.130` and proxied CNAME www → `rgesol.com`.

The fresh pre-cutover snapshot `.local/dns-pre-cutover-2026-10-28.txt` is also stored beside the original archive. At 22:14 UTC, comparison confirmed all 29 original records unchanged, with only the three approved Resend records added. After launch, read-only remote hashes at 22:18 UTC reconfirmed all 85 GoDaddy files unchanged, and both archive hashes still match.

**Preserved service aliases:** `cpanel`, `ftp`, `webdisk`, `webdisk.admin`, `whm`, and `www.admin` were changed with approval from apex CNAMEs to A records at the original GoDaddy IP `72.167.204.130`, retaining Auto TTL and Proxied status. They no longer follow apex traffic to Astro. This does not repair pre-existing service/proxy limitations.

Final exported DNS comparison at 22:18 UTC confirms exactly the eight approved changes: six service-alias replacements plus removal of apex/www origin records for Worker-managed custom domains. All 24 other records match the pre-cutover snapshot, including all email records. `.local/dns-post-cutover-2026-10-28.txt` and `.local/dns-launch-verification.json` retain evidence; the export is also beside the archive. Cloudflare-managed Worker bindings are not included in the BIND export and are verified separately by deployment output/dashboard/live HTTPS.

Launch incident: a dashboard edit unintentionally changed `sip.rgesol.com` to the GoDaddy A target. The record-by-record comparison caught it; it was immediately restored to its original CNAME `sipdir.online.lync.com`, Auto TTL, Proxied. The final comparison confirms exact restoration. No other email records changed. The apex/www replacement briefly produced a negative local DNS cache entry; public resolution and TLS-validated redirect tests pass.

Minimum TLS is now **1.2**, confirmed after dashboard reload. TLS 1.3 remains enabled; origin encryption mode remains Full. The existing active apex/wildcard certificate and live TLS validation are verified. The change is zone-wide; no GoDaddy hosting/security settings were changed.

Rollback after an approved launch would remove only the new RGE Worker hostname bindings and restore the saved apex/www website records. Verify service aliases separately; preserve all email records. The GoDaddy origin remains available for rollback.

## Completed launch and remaining follow-up

Tim explicitly approved the six service-alias replacements, minimum TLS 1.2, apex/www cutover, and one live form test. Record replacements were reconfirmed at the dashboard action. The first domain attachment attempt correctly failed on existing apex/www records; those two saved records were then removed and both custom domains attached successfully.

- Confirm the live test in Tim's inbox; Resend delivery is already verified.
- Verify event/visit reports in Google Analytics and Cloudflare, preserving consent and the EU exclusion.
- Submit/inspect the sitemap in Google Search Console and allow time for indexing.
- Launch source/notes are included in the approved GitHub update; a Git push does not deploy automatically.
- Keep shared GoDaddy hosting available; do not cancel or delete it.
