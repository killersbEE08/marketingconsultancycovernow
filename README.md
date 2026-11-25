# CoverNow website

A plain HTML/CSS/JS site. There is no build step: upload the folder as it is.

## Pages

| File | Page |
|---|---|
| `index.html` | Home |
| `services.html` | Services |
| `approach.html` | How an engagement runs |
| `packages.html` | Packages and billing questions |
| `about.html` | About |
| `contact.html` | Contact form, phone, WhatsApp, email |
| `404.html` | Shown by Cloudflare for any missing page |

Shared files live in `assets/` (`css/styles.css`, `js/main.js`, `favicon.svg`).

## Deploy on Cloudflare Pages

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Upload assets**.
2. Name the project, then drag in this whole folder (README.md is harmless but can be removed).
3. After it deploys, open **Custom domains** and add `covernow.co.in` (and `www` if you want it).

If you use Git instead: connect the repo, leave the build command empty and set the output directory to `/`.

Cloudflare serves `services.html` at `/services` automatically. `_headers` adds basic security headers, and `404.html` is used for missing pages.

## Things to edit

- **Domain**: `covernow.co.in` is used in canonical links, `robots.txt` and `sitemap.xml`. Change it there if the site lives elsewhere.
- **Phone, WhatsApp, email**: they appear in every page and in `assets/js/main.js` (top of the file).
- **Contact form**: nothing is stored on a server. The form opens the visitor's email app or WhatsApp with their message filled in. To receive form submissions directly, connect a form service (e.g. Formspree) or a Cloudflare Pages Function later.
- **Icons**: Streamline Core Line (free, CC BY 4.0). The credit in the footer is required by that licence. Remove it only if you replace the icons.
