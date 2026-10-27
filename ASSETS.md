# Asset provenance and attribution

All production assets are served locally. No remote image or font host is contacted by the running app. Checked 27 October 2026.

## Earth texture — `public/assets/earth.jpg`

- **NASA Blue Marble Next Generation, December 2004**, with topography and bathymetry; 5400 × 2700 equirectangular JPEG.
- Credit: **NASA Earth Observatory; Blue Marble Next Generation team, including Reto Stöckli and Robert Simmon**. See NASA's dataset for full scientific credits.
- [Collection and methodology](https://science.nasa.gov/earth/earth-observatory/blue-marble-next-generation-5935/), [dataset manual](https://earthobservatory.nasa.gov/ContentFeature/BlueMarble/bmng.pdf).
- [Exact downloaded file](https://eoimages.gsfc.nasa.gov/images/imagerecords/73000/73909/world.topo.bathy.200412.3x5400x2700.jpg).
- [NASA reuse FAQ](https://science.nasa.gov/earth/faq/) and [media guidelines](https://www.nasa.gov/nasa-brand-center/images-and-media/).
- NASA-produced imagery is generally not subject to US copyright and may be reused under NASA's media guidelines. It is used here as factual educational material with credit and no implied NASA endorsement. No NASA logo or personnel imagery is used.
- Original downloaded map is unmodified; rendered onto a 3D sphere with artistic lighting and a simulated atmospheric halo. The cloud-free monthly composite is **not live satellite imagery**. Topographic/bathymetric shading is visualization, not true displacement or a live day/night model.

## Sigiriya photograph — `public/assets/sigiriya.jpg`

- Photographer: **sander traa** (@sandertraa).
- [Original photo / provenance](https://unsplash.com/photos/a-mountain-with-a-large-rock-on-top-of-it-NTIodyfKMIM), published 22 March 2024.
- [License: Unsplash License](https://unsplash.com/license); permits downloading, distribution and commercial use, subject to its restrictions. This is a free Unsplash photograph, not an Unsplash+ asset.
- [Downloaded image](https://images.unsplash.com/photo-1711100358840-ce6fd71c31b3?auto=format&fit=crop&fm=jpg&q=85&w=1600).
- Delivered as a 1600px JPEG and shown with responsive CSS crops/overlays. Credit and source links appear in the app. No endorsement by the photographer is implied.
- An initially considered Wikimedia image was not downloaded; **no Dronepicr or CC BY photograph is included**.

## Additional destination photography — upgrade collection

The following free Unsplash photographs were verified against their individual source pages and downloaded locally. Each uses the [Unsplash License](https://unsplash.com/license), not Unsplash+. All are delivered as 1200px JPEGs with responsive display crops. Individual photographer credits and source links are available in the destination guides and the app's Sources & Credits panel.

| Local file                       | Photographer         | Original source                                                                                                        | Downloaded image identifier        |
| -------------------------------- | -------------------- | ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| `public/assets/everest.jpg`      | Mauricio Manzato     | [Mount Everest from Tibet](https://unsplash.com/photos/snow-capped-mountain-peak-against-a-clear-blue-sky-dCMSxWkzkbk) | `photo-1741257067896-18b4b688766f` |
| `public/assets/giza.jpg`         | Dmitrii Zhodzishskii | [Giza pyramid complex](https://unsplash.com/photos/the-pyramids-of-giza-are-in-the-desert-aQ7cuVC1VmQ)                 | `photo-1632836388763-3a52d354cd7e` |
| `public/assets/reef.jpg`         | GeoNadir             | [SW Yanooa (Pelorus) Reef](https://unsplash.com/photos/an-aerial-view-of-a-coral-reef-in-the-ocean-k4XDVl-JCpQ)        | `photo-1638580591001-8c07e6f54097` |
| `public/assets/machu-picchu.jpg` | Natalie Pedigo       | [Machu Picchu](https://unsplash.com/photos/machu-picchu-UoKfSYSq0Rk)                                                   | `photo-1501371632240-5d60b49290e7` |

`scripts/fetch-photos.mjs` records exact image identifiers and download parameters. It is an optional maintenance helper, never part of installation, build or browser runtime. The reef photograph depicts a part of the reef system, not the exact representative marker coordinate. Photographs illustrate their named destinations; they are not live conditions. Failed image requests fall back to original vector artwork without retaining a misleading photographer credit on the artwork.

### Sri Lanka and Amazon collection

These five additional free photographs use the same Unsplash License and 1200px JPEG delivery described above. Sources and license status were verified on 27 October 2026. Local thumbnails, destination cards, guides and presentations reuse the same files; no third-party image requests occur at runtime.

| Local file                  | Photographer                 | Original source                                                                                                                 | Downloaded image identifier        |
| --------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| `public/assets/kandy.jpg`   | Chathura Anuradha Subasinghe | [Temple of the Sacred Tooth Relic, Kandy](https://unsplash.com/photos/temple-of-the-tooth-with-a-bridge-over-water-isdvqf04MDk) | `photo-1665849050430-5e8c16bacf7e` |
| `public/assets/galle.jpg`   | Suhas Dissanayake            | [Galle lighthouse and coast](https://unsplash.com/photos/white-lighthouse-on-a-grassy-cliff-overlooking-the-ocean-HJkZ9XZ8gPI)  | `photo-1767710048839-4bead77ab4a5` |
| `public/assets/ella.jpg`    | Pasan Jayaweera              | [Ella hills and tea fields](https://unsplash.com/photos/a-landscape-with-trees-and-hills-ZHREWItgO54)                           | `photo-1656314945066-edca54a983ec` |
| `public/assets/colombo.jpg` | Zoshua Colah                 | [Colombo streets and skyline](https://unsplash.com/photos/cityscape-view-with-buildings-and-overcast-sky-TRQ04e-B-yI)           | `photo-1742277712561-2cfe3422bdf7` |
| `public/assets/amazon.jpg`  | Rodrigo Kugnharski           | [Amazon riverbank near Tefé, Brazil](https://unsplash.com/photos/aerial-view-of-houses-on-body-of-water-PAgMQ2088RE)            | `photo-1534861542011-27e852f7c9f5` |

Kandy and Galle use adjusted CSS focal points to retain the temple and lighthouse in landscape crops. The Amazon image depicts rainforest and floating houses near Tefé in the Brazilian Amazon, illustrating the broader biome rather than the exact representative globe coordinate. English and Sinhala alt text describes each photograph. All other modifications are responsive display crops and overlays; original local JPEGs are retained.

To refresh only these files: `node scripts/fetch-photos.mjs kandy galle ella colombo amazon` (network required; optional maintenance only).

## Typography

- **DM Sans** — Colophon Foundry / Google Fonts contributors. [Fontsource package](https://fontsource.org/fonts/dm-sans), [upstream project](https://github.com/googlefonts/dm-fonts). **SIL Open Font License 1.1**.
- **Noto Sans Sinhala** — Noto project contributors. [Fontsource package](https://fontsource.org/fonts/noto-sans-sinhala), [upstream project](https://github.com/notofonts/sinhala). **SIL Open Font License 1.1**.
- WOFF/WOFF2 subsets are bundled through npm and Vite. The original license notices accompany each installed package and are reproduced in `public/licenses/`.
- Georgia is requested only as a system-font fallback; no proprietary font file is redistributed.

## Icons, artwork and layout

- **Lucide** icons: [lucide.dev/license](https://lucide.dev/license), **ISC License**. See `public/licenses/lucide-LICENSE`.
- The NV. favicon, field-note landscape vectors, globe-grid motif, simulated starfield, interface composition and visual identity are original code-native artwork created for this project. Field-note cards are illustrative interpretations rather than photographs. No website layout, logo system or third-party source template was copied.
- Source attribution does not grant use of an institution's logos, trademarks or endorsements. None is claimed.

Dependency licenses are summarized in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). Keep these records, public license files and on-screen credits when redistributing assets.
