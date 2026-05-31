
# Jimiel Salmon | Portfolio

A terminal-inspired portfolio and content management system built with Next.js, Convex, and TypeScript.

Live site: [jimielsalmon.is-a.dev](https://jimielsalmon.is-a.dev)

## Overview

This project includes a public portfolio and a protected single-admin dashboard. Portfolio content is managed through the dashboard and stored in Convex.

Public pages:

- `/` - Homepage with selected work, recent writing, and contact form
- `/projects` - Published project archive with technology filters
- `/blog` - Published blog archive with search, filters, and pagination
- `/about` - Profile, skills, experience timeline, education, and resume

Admin pages:

- `/admin/login` - Credentials-based admin login
- `/admin` - Dashboard overview
- `/admin/projects` - Project management
- `/admin/blog` - Blog post management
- `/admin/about` - Profile and resume management
- `/admin/settings` - Account, site metadata, and public badge settings

## Features

- Terminal-inspired responsive interface with subtle motion
- Single-admin authentication with NextAuth.js credentials and JWT sessions
- Protected admin routes with Next.js Proxy
- Convex-backed project, blog, profile, and settings management
- UploadThing image and resume uploads
- Markdown blog posts and project details
- Contact form with Resend delivery and rate limiting
- SEO metadata, sitemap, robots rules, Open Graph images, and JSON-LD
- Google Search Console verification support

## Tech Stack

- Next.js 16 App Router
- React 19 and TypeScript
- Tailwind CSS v4 and shadcn/ui
- Convex
- NextAuth.js v4
- TanStack Query v5 and Axios
- React Hook Form and Zod
- UploadThing
- Framer Motion

## Local Setup

Install dependencies:

```powershell
npm install
```

Create your local environment file:

```powershell
Copy-Item .env.example .env.local
```

Fill in the required values in `.env.local`, then initialize Convex:

```powershell
npm run convex:dev
```

Set the matching server-only Convex environment variables:

```powershell
npx convex env set ADMIN_API_TOKEN your-admin-api-token
npx convex env set ADMIN_SETUP_TOKEN your-admin-setup-token
```

Seed the single admin account:

```powershell
npm run seed:admin
```

Keep Convex running, then start Next.js in a second terminal:

```powershell
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the portfolio or [http://localhost:3000/admin/login](http://localhost:3000/admin/login) for the admin panel.

## Environment Variables

| Variable | Purpose |
| --- | --- |
| `NEXTAUTH_URL` | Application URL used by NextAuth.js |
| `NEXTAUTH_SECRET` | Random secret used to sign authentication tokens |
| `NEXT_PUBLIC_CONVEX_URL` | Public Convex deployment URL |
| `CONVEX_DEPLOYMENT` | Convex deployment identifier |
| `ADMIN_API_TOKEN` | Shared server-only token for protected Convex CMS operations |
| `ADMIN_EMAIL` | Email address for the single admin account |
| `ADMIN_PASSWORD` | Initial admin password used by the seed script |
| `ADMIN_SETUP_TOKEN` | One-time setup guard used when seeding the admin account |
| `NEXT_PUBLIC_API_BASE_URL` | Optional API base URL; leave blank for same-origin requests |
| `NEXT_PUBLIC_APP_URL` | Canonical public portfolio URL |
| `UPLOADTHING_TOKEN` | UploadThing server token |
| `RESEND_API_KEY` | Optional Resend API key for contact form delivery |
| `CONTACT_TO_EMAIL` | Optional contact form destination; falls back to `ADMIN_EMAIL` |
| `CONTACT_FROM_EMAIL` | Optional verified sender; falls back to Resend onboarding sender |

Use independent random values for `NEXTAUTH_SECRET`, `ADMIN_API_TOKEN`, and `ADMIN_SETUP_TOKEN`. Do not commit `.env.local`.

## Useful Commands

```powershell
npm run dev
npm run build
npm run lint
npm run convex:dev
npm run convex:codegen
npm run seed:admin
```

## Project Structure

```text
app/        Next.js routes, layouts, API handlers, sitemap, and metadata
components/ Shared UI primitives
convex/     Schema, queries, mutations, and shared Convex helpers
features/   Feature-based auth, admin, CMS, portfolio, settings, and theme code
lib/        Shared application utilities
scripts/    Local setup scripts
```

## License

The source code is available under the MIT License.

Personal content, including profile information, resume files, blog posts, project descriptions, and uploaded media, is copyright Jimiel Salmon and may not be reused without permission.
