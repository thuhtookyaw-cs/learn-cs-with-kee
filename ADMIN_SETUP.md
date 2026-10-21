# Study with Kee admin setup

The admin workspace is at `/admin/`. It is private and only accepts a strong password stored in the server environment. The site never sends that password or any API token to the browser.

Set these environment variables for Production in the Vercel project, then redeploy:

- `ADMIN_PASSWORD`: a unique password of at least 16 characters.
- `ADMIN_SESSION_SECRET`: at least 32 random characters. For example, generate one with `openssl rand -base64 48`.
- `GITHUB_CONTENT_TOKEN`: a fine-grained GitHub personal access token limited to `thuhtookyaw-cs/learn-cs-with-kee`, with **Contents: Read and write**. This is required to publish articles and Store changes. Saves commit directly to `main`; the connected Vercel deployment updates after the build completes.
- `VERCEL_ANALYTICS_TOKEN`: a Vercel API token with access to this project's Web Analytics. Enable Web Analytics in the Vercel project before expecting traffic figures.

The dashboard does not show invented numbers. Until Web Analytics is enabled and the token is set, the traffic area reports that it is not connected. It shows aggregate visits, rather than individual student activity. Journal articles are Markdown files in `content/articles`; Store bundles live in `public/data/store-products.json`. The admin editor commits these files through GitHub, so changes persist across deployments.

For local work, copy `.env.example` to `.env.local` and fill in values. Keep `.env.local` private.
