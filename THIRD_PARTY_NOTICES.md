# Third-party notices

Sri Lanka and Amazon photography: Unsplash License; Kandy — Chathura Anuradha Subasinghe; Galle — Suhas Dissanayake; Ella — Pasan Jayaweera; Colombo — Zoshua Colah; Amazon Rainforest — Rodrigo Kugnharski. Exact sources and display modifications are recorded in ASSETS.md and the app's photo credits.

Original application code and code-native illustrations: © 2026 NV SHARP SOLUTIONS / Navod Ravindu Jayaweera, MIT. See LICENSE.

| Distributed dependency / asset | License / credit                                                                   |
| ------------------------------ | ---------------------------------------------------------------------------------- |
| React / React DOM              | MIT, Meta Platforms and contributors                                               |
| Three.js                       | MIT, three.js authors                                                              |
| three-globe                    | MIT, Vasco Asturiano and contributors                                              |
| Lucide React icons             | ISC, Lucide contributors (with applicable Feather attribution in upstream license) |
| DM Sans                        | SIL Open Font License 1.1; Colophon Foundry / Google Fonts contributors            |
| Noto Sans Sinhala              | SIL Open Font License 1.1; Noto contributors                                       |
| NASA Blue Marble texture       | NASA imagery guidelines; NASA Earth Observatory / BMNG team                        |
| Sigiriya photo                 | Unsplash License; sander traa                                                      |

Additional destination photography is licensed under the Unsplash License: Mount Everest — Mauricio Manzato; Giza — Dmitrii Zhodzishskii; Great Barrier Reef — GeoNadir; Machu Picchu — Natalie Pedigo. Source pages, image identifiers and modifications are documented in ASSETS.md and in the application credits.

Full direct dependency license files are included in `public/licenses/` and copied into the production artifact. The build's `scripts/sync-licenses.mjs` also copies available root-level license, copying and notice files from every installed production dependency, including transitive packages. `public/licenses/NOTICE.json` records each package's exact version, declared license and copied notice filenames. Vite/Rollup preserves upstream legal comments in distributed bundles where provided. Consult `package-lock.json` for the complete resolved tree. Development tools are not shipped as application runtime dependencies.

Image provenance, license links and display modifications: [ASSETS.md](ASSETS.md). Educational references: [SOURCES.md](SOURCES.md). No NASA, UNESCO, government or educational-institution endorsement is implied.
