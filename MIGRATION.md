# Migration status — 2026-10-28

## Current state

- Local PHP content and approved local improvements migrated into a separate Astro checkout. PHP source and shared GoDaddy hosting unchanged.
- Private GitHub repository: https://github.com/timgabaree/rgesol.com-astro. Source and preparation notes are maintained separately from the PHP repository; pushes do not deploy automatically.
- Protected Cloudflare staging deployed. Separate production deployment created but closed, without hostname bindings or public preview endpoints.
- New isolated Resend sender domain `forms.rgesol.com` verified, with TLS Enforced. Only three new sender-verification DNS records were added; existing website and mailbox records were not edited.
- Staging sending-only credential securely configured. Protected Cloudflare contact endpoint test delivered to `tim@rgesol.com` at 20:42 UTC (Resend ID `01a1843f-f2ed-7142-9032-f026502b5ef7`). Inbox confirmation remains pending.
- The unused production key that appeared in a tool response was permanently revoked with Tim's approval; it had no activity and was never installed. Its replacement (`a523691f-b290-4ed7-b46b-e2744275829b`) has sending-only access restricted to `forms.rgesol.com`, stored in Cloudflare secrets and macOS Keychain. Temporary plaintext handoff removed; no secret values in Git.
- Private production-credential test delivered to `tim@rgesol.com` at 22:03 UTC / 5:03 p.m. Central (Resend ID `01a1848a-0284-741d-a13a-67cbccf68785`). This used the local Astro `sendMail` adapter and the production credential, not the public production Worker. Resend confirms Delivered, and Tim confirmed receipt.
- Latest protected staging version: `6a43993e-e3bf-4f39-bf9f-3d217c58bc72`. Latest closed production version: `d3337c9c-affa-43a2-a04a-4fd7a67f049c`. Remote production inspection confirms `PRODUCTION_ENABLED=false`; deployment reports no public targets. Production has not been opened for testing.
- Original public direct-contact address `timgabaree@rgesol.com` is retained in visible content, structured metadata and the vCard pending Tim's preference; the form and fallback use the approved `tim@rgesol.com` recipient. This does not change mailbox routing.

## Verification

- Astro/TypeScript check: 0 errors, 0 warnings, 0 hints.
- 31 unit tests pass: validation, abuse protection, same-origin/CSRF enforcement, provider failures, production closure, consent and conversion behavior.
- 70 local Cloudflare runtime/build checks pass, with email disabled.
- 325 production link, asset, page-landmark, structured-data, XML-sitemap and contact-download checks pass. Production dependency audit: no known vulnerabilities reported.
- All six main pages fit 320, 768 and 1440-pixel viewports without horizontal overflow; one h1 each, no detected broken images. Mobile navigation opens with Enter, closes with Escape and restores button focus. Skip link and footer privacy controls work from the keyboard. Required fields focus the first invalid field; a keyboard-submitted local form completed in no-email mode.
- Mobile home, contact and privacy layouts and desktop image gallery were visually reviewed. Browser review recorded no console errors. The vCard browser download matched the served asset. The QR payload was decoded as `https://rgesol.com/rgesolutions.vcf`; its linked card's malformed address field and missing logo URL were corrected in Astro only.
- Separate staging and production builds pass; deploy assets reject PHP and private source/configuration.
- Normalized homepage, about and thank-you text match the local PHP source. Contact and privacy include intentional migration updates. Live PHP email obfuscation accounts for source/live text differences.
- Gold-text contrast issues identified in the first audit were corrected without layout changes. Repeat local production-build Lighthouse: mobile **96/100/100/100**, desktop **100/100/100/100** (Performance/Accessibility/Best Practices/SEO). Lighthouse 13.5.0; mobile Moto G Power/Slow 4G. Full reports retained in ignored `.local/lighthouse-mobile.json` and `.local/lighthouse-desktop.json`. These are laboratory preview results, not live PageSpeed or field measurements; analytics was hostname-gated off on localhost.
- Existing Cloudflare Web Analytics property `62dfae33485f4655916fb34e84ea1c84` is configured for rgesol.com with automatic injection excluding EU visitors. This setting was inspected and left unchanged. Actual beacon loading and visit reporting still need post-cutover verification; do not add a duplicate manual beacon.
- Real staging contact delivery verified in Resend, not merely inferred from the success page.
- Post-deploy verification at 22:09 UTC: all six main staging pages, CSS, vCard and XML sitemap exactly match the local build; unauthenticated requests return 401, authenticated responses are noindex/no-store, staging robots disallows crawling, the contact token is in real-email mode, private files return 404, and the production workers.dev address remains unavailable (404). No additional email was sent during these checks.

## Archive and rollback

The deployed primary-domain document root is `/home/ma81y7v45nyj/public_html` on the GoDaddy shared account. A targeted archive includes the RGE site only; it excludes addon domains, account-wide files, mailbox data, logs and unrelated archives. No server-side files were written.

85 archived files matched SHA-256 manifests before and after the read-only capture. Local extraction and ZIP integrity checks passed. A live restore has not been attempted.

- Original archive: `/Volumes/StudioStack NVMe/Website Archives/rgesol.com/2026-10-28-pre-cutover/godaddy-rgesol.com.tar.gz`
- SHA-256: `adb718840cb582f231248a5e87239f5152625345138da9c629752f67b3c276b0`
- Dropbox copy: `/Volumes/StudioStack NVMe/Dropbox/Work Files/Websites/Archive/rgesol.com-GoDaddy-2026-10-28/godaddy-rgesol.com-backup.zip`
- ZIP SHA-256: `3a81bbe7f13e768981a77a93b0c42eb9e917ba08688ae77adb85294e8d023d3d`
- Verification evidence accompanies both archives. Off-device Dropbox sync has not been independently verified.

Full DNS export before sender setup is stored outside Git alongside the archive and in ignored `.local/dns-before-resend-2026-10-28.txt`. The existing website records are proxied A apex → `72.167.204.130` and proxied CNAME www → `rgesol.com`.

The refreshed snapshot `.local/dns-pre-cutover-2026-10-28.txt` is also stored beside the original archive. At 22:06 UTC, comparison confirmed **all 29 pre-existing records unchanged**, with only the three approved Resend records added. Read-only remote hashes reconfirmed all 85 GoDaddy files unchanged, and both archive hashes still match. Repeat this snapshot immediately before executing a later cutover.

**Cutover dependency:** `cpanel`, `ftp`, `webdisk`, `webdisk.admin`, `whm`, and `www.admin` currently alias the apex. They would follow an apex cutover away from GoDaddy. Review their intended targets and obtain approval for any service-alias adjustment before switching. Do not alter mailbox DNS or other hosted sites.

Recommended preservation plan, not executed: replace only those six service CNAMEs with A records pointing directly to the current GoDaddy IP `72.167.204.130`, retaining each record's existing TTL/proxy setting. This prevents an apex change from redirecting those names to Astro; it does not claim to repair pre-existing service/proxy limitations. Leave `mail`, `ssh`, `admin`, MX, SPF, DKIM, DMARC, autodiscover and all other records unchanged.

Cloudflare edge certificate for `rgesol.com` and `*.rgesol.com` is Active (managed expiry shown as December 1, 2026). Current minimum TLS is **1.0**, TLS 1.3 is enabled, and origin encryption mode is Full. These settings were inspected, not changed. Include minimum TLS **1.2** in the explicit launch approval; it is a zone-wide visitor compatibility setting. Leave origin encryption mode unchanged so shared GoDaddy subdomains are not inadvertently affected.

Rollback after an approved launch would remove only the new RGE Worker hostname bindings and restore the saved apex/www website records. Verify service aliases separately; preserve all email records. The GoDaddy origin remains available for rollback.

## Approval required before launch

Preparation does not authorize switching website traffic. Obtain explicit approval covering:

1. Preserve the six GoDaddy service aliases described above before changing apex/www.
2. Change the zone's minimum TLS to 1.2, preserving other security settings.
3. Replace only apex/www website DNS with Cloudflare Worker custom-domain bindings, enable the production Worker, and run launch checks. Keep GoDaddy files/hosting and mailbox DNS unchanged.
4. Send one clearly labeled live contact-form test to `tim@rgesol.com` and verify delivery.

At the approved launch, first refresh the DNS snapshot and check the GoDaddy rollback origin. After binding both hostnames, verify HTTPS/certificates, apex and www canonical redirects, all pages/assets/downloads, legacy PHP redirects, real 404s, sitemap/robots, privacy choices and contact submission. If checks fail, close production and restore the exact saved website records; retain GoDaddy hosting throughout. Record any approved service-alias changes separately so rollback never modifies mailbox DNS.

After launch, verify consent-controlled Google events and the Cloudflare beacon/reporting (preserving the EU exclusion), submit/inspect the sitemap in Search Console, and run live mobile/desktop PageSpeed. Current green scores are lab preview evidence, not live field data. Monitoring remains deferred until the four-site migration phase is complete.
