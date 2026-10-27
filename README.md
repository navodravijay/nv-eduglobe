# NV. EduGlobe

[Live demonstration](https://nv-eduglobe.pages.dev/) · [GitHub repository](https://github.com/navodravijay/nv-eduglobe) · [Quality checks](https://github.com/navodravijay/nv-eduglobe/actions)

**A world of discovery.** A premium, bilingual, interactive geography experience by **NV SHARP SOLUTIONS**, designed and developed by **Navod Ravindu Jayaweera**.

An original digital museum experience built with Vite, React, TypeScript, Three.js and three-globe. Explore a satellite-textured Earth, travel between destinations, discover Sri Lanka and test your geography knowledge in English or Sinhala. All content and assets are local. No database, API key, authentication or paid service is needed.

This is an **educational commercial demonstration**, independently created and not endorsed by a government, school, NASA or UNESCO. Review content, language and target devices before public release.

## Experience upgrades

- **Three curated journeys:** Around the extraordinary (6 stops), An island of stories (all 5 Sri Lanka destinations), and Shaped by nature (4 natural wonders). Switch journeys during a presentation, choose an 8-, 12- or 20-second pace, pause/resume, or jump between stops.
- **Museum presentation view:** journey cards open the expanded globe with large destination captions on desktop, local photography, a selectable itinerary and the educational-demo identification. Opening a guide or a layer panel preserves the parent presentation; Escape closes the inner view first.
- **Educational map layers:** toggle the 10° latitude/longitude grid, the 0° equator and collection markers without recreating the WebGL renderer. A cyan focus marker identifies the current destination. Zoom can approach closer to the surface.
- **Destination photography:** Sigiriya, Kandy, Galle, Ella, Colombo, Amazon Rainforest, Everest, Giza, Machu Picchu and the Great Barrier Reef have locally bundled, verified Unsplash-licensed images. The Sri Lanka list includes photo thumbnails. Each photograph has English/Sinhala alt text, photographer and source credit. Failed photos recover with original artwork.

All new settings remain in tab memory. No storage, personal profiles, runtime APIs or tracking were introduced. Image provenance and exact download identifiers are in ASSETS.md. The optional `node scripts/fetch-photos.mjs` helper refreshes the additional licensed photographs; normal installation and build use the included local copies.

## Start locally

Use **Node.js 22.12+ or a compatible newer release** and npm. Installation was verified with Node 26 and npm 11. A lockfile is provided.

```sh
npm install
npm run dev
```

Open **http://127.0.0.1:5173**. In Windows PowerShell, if execution policy blocks `npm.ps1`, use `npm.cmd` in place of `npm` for every command; no execution-policy changes are necessary.

The project uses `.npm-cache/` for npm's cache, avoiding reliance on free space on the system drive. This folder and browser temporary files are ignored by Git and linting.

```sh
npm run typecheck
npm run lint
npm test
npm run build
npm run preview
```

`npm run preview` serves the production build at **http://127.0.0.1:4173**. `dist/` is the complete deployable artifact. Browser tests use a dedicated port, **4317**, with server reuse disabled. Preview does not apply Cloudflare's `_headers` file; verify production headers on the deployment host.

## The experience

- Real WebGL Earth with NASA Blue Marble imagery, atmospheric halo, starfield and an animated camera reveal.
- Drag, pinch, scroll, zoom buttons, auto-rotation, reset, expanded view and smooth destination focus. Pick visible globe markers or use the equivalent destination buttons.
- 20 curated destinations across all seven continents, with combined bilingual search, continent/category filters, coordinate readouts, original educational summaries and direct source links.
- A dedicated Sri Lanka collection: Sigiriya, Kandy, Galle Fort, Ella and Colombo.
- Seven continent guides and four categories: countries, culture and heritage, natural wonders, cities.
- Ten multiple-choice questions, answer explanations, deterministic scoring, results and restart. No timer or personal information.
- English/Sinhala essential UI, educational content, quiz options and explanations. Switching language preserves the current quiz, filters and presentation state. Search understands either language independently of the display language.
- Three guided presentation journeys. The default world route visits Sigiriya → Giza → Eiffel Tower → Grand Canyon → Machu Picchu → Great Barrier Reef. Automatic travel defaults to 12 seconds per destination, with 8/20-second options, pause/resume, previous/next, direct stop selection and end controls. Tours pause their schedule when the page is hidden, the globe is offscreen or a guide is open. Pausing also stops the active camera transition; resuming refocuses the current stop. Direct globe interaction pauses the tour.
- Responsive sections for Explore, Learn, Sri Lanka, About and Business Enquiries. Enquiries link to **https://nv-sharp-solutions.pages.dev/** without collecting information in the app.
- Licensed local imagery, original vector field-note illustrations, locally bundled fonts and no runtime third-party requests.

## Controls and accessibility

| Action         | Mouse / keyboard / touch                                                      |
| -------------- | ----------------------------------------------------------------------------- |
| Rotate         | Drag / focus the globe and press arrow keys / one-finger drag                 |
| Zoom           | Wheel or +/− buttons / `+`, `=` or `-` while the globe is focused / pinch     |
| Reset          | Reset button / `Home` while the globe is focused                              |
| Browse places  | Search and filter, then activate a destination card                           |
| Guide          | Native modal dialog with focus containment; close with its button or `Escape` |
| Expanded globe | Expand button; `Escape` exits; keyboard focus stays inside                    |
| Language       | Header `EN / සිං` control                                                     |
| Learning tabs  | Click/tap or use Left/Right arrow keys on a tab                               |

Semantic headings, labels, visible keyboard focus, radio groups, live result messages and a skip link are included. Reduced motion follows `prefers-reduced-motion`: camera transitions become immediate, auto-rotation is disabled and decorative transitions are removed. The globe has a readable loading state, texture timeout and retryable WebGL fallback. Every educational guide and the complete quiz remain available without WebGL.

This implementation includes accessibility support; it is not a claim of independently certified WCAG conformance. Include assistive-technology and native Sinhala editorial review in final acceptance.

## Browser QA

```sh
npm run build
npx playwright install chromium
npm run test:browser
```

On Windows, the configuration uses installed Google Chrome when available. Elsewhere, it uses Playwright's Chromium. The launcher puts temporary browser profiles under `.tmp/` on the project drive. Browser tests start a local production preview automatically and run desktop (1440 × 1000) and mobile (390 × 664, touch) projects. Full-page captures are written to `test-results/`; failure traces and the HTML report are also local and ignored by Git. Mobile checks emulate a mobile Chromium viewport, not a physical iPhone or Safari engine.

Unit/component coverage includes scoring boundaries, missing/invalid answers, combined search filters, English/Sinhala lookup, geographic data integrity, the complete quiz flow, answer locking, restart and language switching without lost state. Browser coverage includes real WebGL rendering, image loading, responsive overflow, search and filters, dialogs, localization, all ten quiz answers, automatic tour advancement, controls, reduced motion and WebGL absence.

See [QA.md](QA.md) for the recorded acceptance checks and remaining manual review.

## Cloudflare Pages deployment

The project supports a GitHub-connected Pages deployment. Follow [DEPLOYMENT.md](DEPLOYMENT.md) for the account setup, exact settings and public-release checks. The committed `.node-version` selects Node 22. A public deployment URL must be verified after deployment; local build success alone does not mean the app is published.

### GitHub integration

Create a GitHub repository and commit the source, including `package-lock.json`. Do not commit ignored folders or credentials. In Cloudflare, create a Pages project connected to that repository, and select:

| Setting                     | Value                                            |
| --------------------------- | ------------------------------------------------ |
| Framework preset            | React / Vite                                     |
| Root directory              | Repository root                                  |
| Build command               | `npm run build`                                  |
| Output directory            | `dist`                                           |
| Node version                | 22.12+ (use a supported compatible Node release) |
| Secrets / database bindings | None                                             |

The static `_headers` file is copied into `dist/` and applied by Cloudflare Pages. No rewrite rule is required because navigation uses section anchors, not server routes. Leave optional analytics and injected third-party integrations disabled to preserve the app's privacy model.

### Exact CLI commands

For a **new Direct Upload project**, run these once, replacing the project name if it is unavailable:

```sh
npm ci
npm run build
npx wrangler login
npx wrangler pages project create nv-eduglobe --production-branch main
npx wrangler pages deploy dist --project-name nv-eduglobe --branch main
```

For an existing Pages project, skip `pages project create`. Wrangler's interactive login keeps account credentials outside this repository. Git integration and Direct Upload are separate Cloudflare project choices; use Git integration when you want repository-triggered builds.

After deployment, confirm HTTPS, the browser console, correct asset loading and response security headers. Check the enquiry destination and source links, then perform the final content and device review.

Official references: [Pages React guide](https://developers.cloudflare.com/pages/framework-guides/deploy-a-react-site/), [Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/), [Pages headers](https://developers.cloudflare.com/pages/configuration/headers/).

## Architecture and maintenance

```text
src/
  App.tsx                    Sections, search state, tour lifecycle
  components/Globe.tsx       Lazy-loaded Three.js / three-globe renderer
  components/Modal.tsx       Native accessible modal shell
  components/PlaceDetail.tsx Educational destination guide
  components/PlaceArt.tsx    Original vector landscape illustrations
  components/PlaceVisual.tsx Licensed photographs with artwork recovery
  components/GlobeLayers.tsx Accessible globe-layer controls
  components/TourPanel.tsx   Journey and presentation controls
  components/JourneyCollection.tsx Curated journey cards
  components/Quiz.tsx        Interactive question and results flow
  context/LanguageContext.tsx Shared bilingual state
  data/places.ts             Coordinates, summaries, categories, sources
  data/quiz.ts               Ten questions and scoring function
  data/translations.ts       Essential English/Sinhala UI
  data/journeys.ts           Curated bilingual itineraries
  data/photos.ts             Image captions, credits and source links
  styles.css                 Visual identity and component styling
  styles/responsive.css      Mobile, tablet and reduced-motion overrides
  styles/upgrades.css        Journey, layers and presentation layouts
  test/                      Vitest unit and component tests
tests/experience.spec.ts     Playwright acceptance tests
public/assets/              Licensed, locally served images
public/_headers             Cloudflare security and cache policy
```

To add a destination, provide an ID, WGS84 latitude/longitude, a continent/category, both translations and an authoritative source. Keep IDs unique and update source/asset attribution and tests if collection sizes change. Coordinates identify representative points, not borders or surveying positions. See [SOURCES.md](SOURCES.md).

The WebGL engine is lazy-loaded separately from the interface. Its sizable vendor chunk is expected for Three.js and three-globe; Vite reports a non-fatal size warning. Device pixel ratio is capped at 1.25 on narrow screens and 1.75 elsewhere; stars and frame rate are reduced on mobile. The render loop skips GPU work when hidden, offscreen or idle; three-globe's unused internal animations stay paused. Resize/intersection observers, event handlers, animation frames, controls, textures, geometries, materials and renderer/context are cleaned up on unmount. There are no heavy post-processing passes or real-time API calls.

## Privacy, security and licenses

No accounts, data collection, cookies, local storage, analytics, geolocation or child profiles. Quiz answers and language state exist in tab memory and reset on reload. External links are opt-in and use `noopener noreferrer`. Search is length-limited and rendered as text. No unsafe HTML insertion, user-generated URLs or arbitrary network fetches are used. See [SECURITY.md](SECURITY.md) for the threat model and headers.

Original source is MIT licensed: [LICENSE](LICENSE). Third-party images, fonts and dependencies retain their own licenses; see [ASSETS.md](ASSETS.md) and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). NV. and NV SHARP SOLUTIONS branding is not granted as a third-party trademark endorsement.

## Portfolio description

**NV. EduGlobe — geography you can step into.** An original bilingual digital museum built for schools, museums and exhibitions. A cinematic, satellite-textured 3D Earth connects 20 curated destinations with source-linked educational stories, a Sri Lanka spotlight and an interactive ten-question geography challenge. English/Sinhala content, guided presentation journeys and a complete non-WebGL learning path make the experience adaptable across classrooms, touch displays and personal devices. Designed and developed by **Navod Ravindu Jayaweera** for **NV SHARP SOLUTIONS**.
