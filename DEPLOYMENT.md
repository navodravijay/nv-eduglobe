# Publish NV. EduGlobe through GitHub and Cloudflare Pages

## GitHub

Create an empty repository in your GitHub account. A private repository can back a publicly accessible Cloudflare Pages site. Do not initialize the remote with a README, license or .gitignore; those files are already included locally.

Once the local release commit exists, connect the repository using its actual URL:

```sh
git remote add origin https://github.com/YOUR-ACCOUNT/nv-eduglobe.git
git push -u origin main
```

If Git requests authentication, use Git Credential Manager's browser sign-in. Never paste a password or token into chat or commit credentials. The ignored dependency, cache, report, environment and build directories must stay out of Git. Cloudflare builds the committed source.

## Cloudflare Pages Git integration

1. Open [Workers & Pages](https://dash.cloudflare.com/?to=/:account/workers-and-pages).
2. Choose **Create application → Pages → Import an existing Git repository**.
3. Connect GitHub and grant Cloudflare access to this repository.
4. Select the repository and enter the following settings.

| Setting                         | Value                                                   |
| ------------------------------- | ------------------------------------------------------- |
| Project name                    | `nv-eduglobe` (or another available name)               |
| Production branch               | `main`                                                  |
| Framework preset                | React / Vite                                            |
| Root directory                  | Leave blank (repository root)                           |
| Build command                   | `npm run build`                                         |
| Build output directory          | `dist`                                                  |
| Node                            | Node 22, selected by the committed `.node-version` file |
| Environment variables / secrets | None required                                           |

5. Select **Save and Deploy**. Copy the actual `https://…pages.dev` URL from the successful deployment. The requested project name is not a guarantee of an available public hostname.

Use a **Pages** project for this setup. The static app has no Worker entry point or Worker deploy command. Do not create a Direct Upload project if you want this native Git integration.

Subsequent pushes to `main` automatically trigger deployments. Pull requests can receive preview deployments. Cloudflare's deployment build does not wait for the independent GitHub Actions quality-check workflow; keep that workflow green before publishing changes to `main`.

## Verify the public release

- Open the exact deployed URL on desktop and mobile. Check Earth loading, destination photos, Sinhala, quiz and presentation controls.
- Confirm the browser console has no unexpected errors and the business enquiry link opens correctly.
- Check response headers with `curl -I https://YOUR-PROJECT.pages.dev/`: the Content Security Policy and other headers from `public/_headers` must be present.
- Confirm `/assets/amazon.jpg` and `/assets/kandy.jpg` load from the same public hostname. The app requires no remote asset hosts or analytics.

Official references: [React build settings](https://developers.cloudflare.com/pages/framework-guides/deploy-a-react-site/), [GitHub integration](https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/), [build image and Node selection](https://developers.cloudflare.com/pages/configuration/build-image/), [response headers](https://developers.cloudflare.com/pages/configuration/headers/).
