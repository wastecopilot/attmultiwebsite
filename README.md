# Authorized Internet Retailer website (AT&T services)

Multipage website for Urban Wireless, an independent authorized retailer of AT&T Fiber,
AT&T Internet Air, AT&T wireless and AT&T Phone. Built with Next.js, TypeScript and Tailwind CSS and served at `/att`.

| Folder / file | Contents |
|---|---|
| `att-site/` | The website (deploy this folder: set it as the Vercel **Root Directory**) |
| `HANDOVER.md` | How to run, update and publish the site, including the required environment variables |
| `DECISIONS.md`, `OPEN_ITEMS.md`, `AUDIT.md` | Decision log, items needed from the business, audit results |
| `IMAGE-PROMPTS.md` | Prompts used to generate the site photos |
| `research/`, `seo/`, `audit/` | Research notes, keyword map and audit evidence |

## Deploying on Vercel

1. Import this repository in Vercel and set **Root Directory** to `att-site` (framework: Next.js, default build settings).
2. Add the environment variables listed in `HANDOVER.md` section 3 for Production. The build stops if any is missing
   or looks like a test value.
3. Deploy. The site answers at `/att`; the domain root redirects there.
