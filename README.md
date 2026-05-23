This is a Next.js portfolio project with a protected admin panel, Convex data storage, and Uploadthing media uploads.

## Getting Started

Install dependencies:

```bash
npm install
```

Copy `.env.example` to `.env.local`, then fill in the required secrets:

```bash
copy .env.example .env.local
```

Set these same server-side secrets in Convex:

```bash
npx convex env set ADMIN_SETUP_TOKEN your-setup-token
npx convex env set ADMIN_API_TOKEN your-admin-api-token
```

Generate Convex code and seed the admin account:

```bash
npm run convex:codegen
npm run seed:admin
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000/admin](http://localhost:3000/admin).

## Admin Content

- Projects: `/admin/projects`
- Blog posts: `/admin/blog`
- About/resume: `/admin/about`
- Uploads require `UPLOADTHING_TOKEN`.
