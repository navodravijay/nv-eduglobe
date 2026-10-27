# Security and privacy notes

## Scope

NV. EduGlobe is a static educational demonstration. It has no backend, authentication, forms, API keys, database, payment system or personal profiles. It does not request camera, microphone, geolocation or a child's identity. It does not store quiz results, cookies or language preferences. State is held only in React memory in the current tab.

Hosting providers may maintain ordinary request logs outside the application's control. This project does not add tracking, analytics, telemetry or a reporting endpoint. Do not enable optional hosting analytics without reviewing and updating these statements.

## Implemented controls

- React escapes rendered text. No `dangerouslySetInnerHTML`, `eval`, inline script handlers or user-supplied HTML.
- Search input is capped at 100 characters; queries are Unicode-normalized and compared as plain text against static data. No regular-expression execution or dynamic queries.
- Destination IDs and navigation targets are internal constants. Globe focus rejects non-finite/out-of-range geographic coordinates and clamps camera distance.
- All fonts, texture maps and photographs are local. The running application requires only its own origin. External source/enquiry links are explicit user actions with `noopener noreferrer`.
- `.gitignore` excludes credentials, `.env*`, caches, dependencies, browser traces and build outputs. Do not place secrets in `VITE_*`; such values would be public in a browser build.
- Cloudflare Pages `_headers` provides a same-origin content security policy, disallows embedded objects and framing, prevents MIME sniffing, restricts referrers, disables unnecessary permission APIs and sets HSTS for the deployed HTTPS host.
- `script-src 'self'` excludes inline/evaluated scripts. `style-src 'unsafe-inline'` is limited to styles because React sets progress-bar widths and Three.js sizes its canvas. No inline JavaScript permission is granted. Image `data:`/`blob:` support is limited to image loading. There are no cross-origin network allowances.
- Errors are handled without transmitting diagnostic payloads. The globe can fail independently without blocking non-WebGL learning content.
- Device pixel ratio, frame-rate limits, mobile star counts, visibility checks and resource cleanup reduce avoidable GPU and memory consumption.

These measures follow the principles of [OWASP XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) and [OWASP Content Security Policy](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html). They do not constitute a security certification or guarantee against all browser/driver defects.

## Release checks

Run `npm ci`, typecheck, lint, tests, build and `npm audit`. Recheck dependencies periodically; an audit reflects known advisories only at the time it runs. Keep the lockfile. Review licenses when adding assets or packages.

On Cloudflare Pages, verify `_headers` is deployed and the CSP is actually returned. Vite's dev server/preview do not interpret this file. GitHub repository hosting is supported; GitHub Pages, if chosen as a separate host, does not honor Cloudflare `_headers` and project-subpath hosting would require updating Vite's base and asset paths. The default deployment target here is a root-hosted Cloudflare Pages site.

Before release, inspect the browser Network panel for unexpected third-party requests, test reduced motion and WebGL failure, and run a device/accessibility review. Public hosting and domain configuration are operator responsibilities.

## Reporting a concern

Contact NV SHARP SOLUTIONS through **https://nv-sharp-solutions.pages.dev/**. Describe the affected version and reproduction steps without sending personal information, private credentials or children's data. There is no in-app incident-reporting or data-collection form.
