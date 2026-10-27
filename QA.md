# Quality assurance record

**Review date:** 27 October 2026. **Target:** public Cloudflare Pages demonstration, with curriculum, native-language and target-device reviews still applicable.

## Verified public release

- **Live site:** https://nv-eduglobe.pages.dev/ — HTTPS HTTP 200, correct application title, verified after the user completed Cloudflare's GitHub import and deployment.
- **Source release:** `4a7d6daea56b4fd3bbaae92f5f5d0a5f65fedfe0` on `navodravijay/nv-eduglobe`, branch `main`.
- [GitHub Actions run 40534899039](https://github.com/navodravijay/nv-eduglobe/actions/runs/40534899039) completed successfully on Linux: clean install, TypeScript, lint, formatting, 17 unit/component tests, production build and **all 30 desktop/mobile browser tests**. This supersedes the interrupted local release rerun described below.
- **8 additional browser checks against the deployed URL passed**, covering the textured globe, decoded local assets, no uncaught errors or third-party runtime requests, search/filter/empty states, destination guides, English/Sinhala switching, all five Sri Lanka thumbnails, Amazon photo/credits, translated alt text and narrow Sinhala layout. These ran in desktop and mobile-emulated installed Chrome. The focused photo test uses reduced motion, DPR 1 and simulated WebGL unavailability; the other live checks exercise the real WebGL globe. Native iOS Safari remains untested.
- The deployed document returns the configured Content Security Policy, HSTS, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY` and `Referrer-Policy: no-referrer`.
- Earth, Sigiriya, Kandy, Galle, Ella, Colombo and Amazon image endpoints each return HTTP 200 with `image/jpeg`. Live browser checks also decode photographs and exercise the interface under the actual production security policy.
- Browser captures are stored locally under ignored `test-results/`; the temporary live-test configuration and command logs are in ignored `.tmp/`. Production application code was unchanged during publication verification.

## GitHub release preparation

The local repository was initialized on `main` for the requested GitHub → Cloudflare Pages publication. Added LF line-ending rules, a Node 22 selection file and a step-by-step DEPLOYMENT.md. Source and licensed assets are staged; dependencies, caches, reports, environment files and `dist/` are ignored. A filename and known-token/private-key-pattern scan found no matches in the staged files; this is a bounded check, not a security certification.

The release production build (including TypeScript), all 17 unit/component tests, lint and formatting passed. Windows virtual-memory exhaustion required a build retry with process-local `GOMAXPROCS=2`, `GOMEMLIMIT=128MiB` and `NODE_OPTIONS=--max-old-space-size=512`; these limits are not required Cloudflare environment settings.

The latest broad browser run completed **15 desktop and 4 mobile checks successfully**, then was interrupted. A smaller mobile retry did not complete under the machine's memory pressure and was stopped. The full 30-check suite therefore has **not** passed as a single release run; earlier acceptance results below remain historical evidence. GitHub Actions is configured to run the complete suite on Linux. Account-side GitHub repository creation, push, Cloudflare connection, deployment and live-header verification remain pending until access/setup is supplied.

## Automated verification

| Check                  | Result                                                                                                                                                                                                      |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm install`          | Completed, with an included lockfile and project-local cache                                                                                                                                                |
| `npm run typecheck`    | Passed                                                                                                                                                                                                      |
| `npm run lint`         | Passed                                                                                                                                                                                                      |
| `npm run format:check` | Passed                                                                                                                                                                                                      |
| `npm test`             | 17 tests passed: scoring, answer validation, search/filter combinations, bilingual lookup, coordinate/content integrity, complete quiz flow, answer locking/restart and state-preserving language switching |
| `npm run build`        | Passed; complete static `dist/` artifact                                                                                                                                                                    |
| `npm run test:browser` | 28 acceptance tests passed across desktop and mobile Chromium                                                                                                                                               |
| `npm audit`            | Zero known dependency vulnerabilities after updating Vitest to a patched release                                                                                                                            |

The build reports an informational vendor chunk size warning: the lazy-loaded Three.js/three-globe engine is about 1.66 MB minified / 472 KB gzip. The interface remains in a separate chunk. This is a documented performance budget, not a build failure.

## Browser coverage

### Sri Lanka and Amazon photo update

Added five local photographs and thumbnails for all five Sri Lanka spotlight rows. After this update, the production build (including TypeScript), lint, formatting and all 17 unit/component tests passed. Unit tests were run with `npm test -- --maxWorkers=1` after concurrent checks exhausted the restricted runner's memory; a separate TypeScript check also passed.

`npm run test:browser -- tests/photos.spec.ts` passed **2 focused checks**, one desktop and one mobile. These verify all five thumbnails decode, the four new Sri Lanka guides load photographs and source credits, Amazon uses its local photo and credited guide, Sinhala alt text changes correctly, and rows fit a 320px Sinhala layout. Screenshots were reviewed for the list and Amazon guide. This focused asset test uses DPR 1, reduced motion and simulated WebGL unavailability; globe rendering remains covered by the earlier acceptance suite below. Repeated restricted-runner browser memory crashes/timeouts were resolved by running this command outside that runner. The complete earlier 28-check suite was not rerun for this photo-only update.

Local installed Google Chrome, headless via Playwright. Desktop viewport **1440 × 1000**; mobile emulation **390 × 664**, DPR 3 with touch. Additional Sinhala overflow checks at **320, 768 and 1024px**. Mobile is emulated Chromium; native iOS Safari was not tested.

Each desktop/mobile project checks:

1. Successful WebGL 2 initialization, local Earth texture, canvas, loaded imagery, six initial destination cards, no uncaught runtime errors, no third-party runtime requests and no horizontal overflow.
2. Search, combined continent/category filtering, empty results, reset and readable destination dialog.
3. English → Sinhala → English switching, translated educational content and Sinhala search.
4. All ten quiz answers, per-answer feedback, 10/10 score and restart.
5. Presentation start, pause/resume, manual next destination, actual timed automatic advancement and ending the tour.
6. Forced lack of WebGL, helpful fallback and continued access to guides.
7. Reduced motion, keyboard globe rotation/zoom/reset, expanded view and Escape to exit.
8. Aborted texture request, successful retry, simulated context loss and continued destination search.
9. Navigation and Sinhala layout at narrow/tablet widths.
10. Enforcement of the declared Content Security Policy on the local document response, with working globe/quiz and no CSP violations. Playwright injects the policy from `public/_headers`; delivery by the real deployment host remains a separate release check.
11. Coordinate/equator/marker layers, actual canvas pixel changes and a layer popover contained within mobile viewport bounds.
12. All five Sri Lanka stops, previous/next wrapping, switching to the four-stop nature itinerary and adjustable travel pace.
13. Opening and closing guides/layer panels within an expanded presentation, including Escape behavior that preserves the parent view.
14. Sinhala journeys and layer controls, deliberately failed photography and original-artwork recovery.

Upgrade regression coverage includes 17 unit/component tests and 28 browser checks. Four new Unsplash-licensed photographs are local; the unit suite checks JPEG signatures, captions, credits and destination mappings. Screenshot review also identified and corrected oversized selection markers and the Sigiriya image crop. Full-page captures explicitly load and decode lazy images before capture.

The upgrade checks reproduced and fixed an offscreen-visibility problem when entering presentation mode from the journey collection, a mobile layer panel extending beyond the viewport and a stacking-order conflict between the layer popover and tour controls. Expanded views now remain visible to the renderer, and popovers stay above the presentation card.

Desktop/mobile hero and full-page screenshots were generated and visually inspected. They are in ignored `test-results/`. The mobile full-page capture uses CSS-pixel scaling to avoid oversized bitmap artifacts. Browser tests run against `vite preview`, not the development module server.

## Source and asset review

- The Earth map and Sigiriya photograph downloaded successfully and are bundled locally. Original source/license URLs and display modifications are documented in ASSETS.md. Direct font and library licenses are copied to `public/licenses/`.
- A source-link check identified two obsolete paths (Japan geography and Grand Canyon geology); both were replaced with working authoritative references. The Reef Authority link was updated to its current domain.
- Several educational sites return HTTP 403 or time out to automated Node requests. UNESCO, the Reef Authority and USAP pages were also verified with the web-reading tool. A bot-protected response is not proof that a link is dead. `npm run check:sources` is an optional maintenance aid and may exit nonzero for bot protection/network restrictions; it is not a required offline build check.
- Sri Lanka heritage listings and the seven-continent convention were checked against UNESCO and National Geographic respectively. Coordinate precision and representative-point limitations are disclosed in SOURCES.md.

## Environment issues resolved

- Windows PowerShell blocks `npm.ps1`: used `npm.cmd` without weakening execution policy.
- The system cache drive was full: added project-local npm cache and browser temporary-profile storage.
- Browser profile lock files conflicted with Vite's watcher: excluded cache/temp/report folders from watching and used a production preview for browser acceptance.
- A shared preview port was occupied by a different local app: isolated acceptance tests on port 4317 and disabled existing-server reuse. The final 20-test run started and stopped EduGlobe's own preview server.
- The initially selected test runner had known dependency advisories: upgraded to Vitest 5; the audit then reported zero vulnerabilities.
- Wikimedia rate-limited the initially considered image: replaced it with a verified, locally downloaded Unsplash-licensed Sigiriya photograph and updated all credits.

## Manual acceptance still required

- Native Sinhala editorial review and educator review for the intended curriculum and age group.
- Physical touch hardware and the specific exhibition/museum GPU, screen and kiosk settings.
- Safari/Firefox and assistive-technology review; no claim of independent WCAG certification.
- Physical-device review of the live Cloudflare deployment and any exhibition-specific cache/network policy. Production document security headers have been verified; Vite preview does not apply `_headers`.
- Final business-link and educational source-link review for the intended audience. The user performed the Cloudflare account setup; the public site and GitHub release were verified as described above.

Run commands are documented in README.md. GitHub Actions configuration is included but has not been executed on GitHub in this local session.
