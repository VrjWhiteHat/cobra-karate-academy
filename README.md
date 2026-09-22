# The Cobra Karate Academy

A responsive, dark cinematic website for **The Cobra Karate Academy** with public academy content, student attendance lookup, and a protected coach administration experience.

## Included

- Public landing page sections for the academy, training programs, achievements, gallery, coach profile, announcements, and contact.
- `/attendance` read-only student attendance lookup.
- `/admin` coach login entry and `/admin/dashboard` management workspace.
- Full-stack data model for students, attendance, achievements, gallery items, and announcements.
- Admin-only tRPC procedures for student management and attendance updates.
- Attendance uniqueness enforced by `studentId + date + session` to prevent duplicates.
- Dark charcoal, deep red, and white visual system with responsive mobile navigation.
- Official academy logo and a cinematic kata hero background served from project storage.
- Coach credentials are configured as server-side `COACH_USERNAME` and `COACH_PASSWORD` secrets; they are never committed to the repository or bundled into the frontend.

Academy names, statistics, achievements, contact details, qualifications, and student records are intentionally placeholders. Replace them with official information before launch.

## Local development

```bash
pnpm install
pnpm dev
```

The development server runs on port `3000` by default.

## Database configuration

The full-stack WebDev template expects these environment variables to be configured by the project runtime:

- `DATABASE_URL` — MySQL/TiDB connection string.
- `JWT_SECRET` — session signing secret.
- `VITE_APP_ID`, `OAUTH_SERVER_URL`, `VITE_OAUTH_PORTAL_URL` — Manus OAuth settings.
- `OWNER_OPEN_ID`, `OWNER_NAME` — project owner identity; the owner is promoted to admin by the auth bootstrap.
- `COACH_USERNAME`, `COACH_PASSWORD` — credentials for the private coach portal. Configure these through the project secret manager.

To generate a migration after changing `drizzle/schema.ts`:

```bash
pnpm drizzle-kit generate
pnpm db:push
```

Do not commit `.env` files or secrets. Use the WebDev project secret manager or Vercel environment variables.

## Test and build

```bash
pnpm check
pnpm test
pnpm build
```

## GitHub

Create a new private repository, then push the project:

```bash
gh repo create cobra-karate-academy --private --source . --remote origin --push
```

## Vercel

1. Import the GitHub repository into Vercel.
2. Add the environment variables listed above in the Vercel project settings.
3. Keep the project build command as `pnpm build` and the start command as `pnpm start` if Vercel asks for them.
4. Configure the OAuth callback URL for the deployed domain through the Manus OAuth project settings.
5. Run the database migration against the production database before enabling live attendance management.

## Notes for production

The coach login is verified server-side and establishes an HTTP-only signed coach session. Production admin procedures accept either this coach session or the existing Manus OAuth admin identity. The public attendance page should use the `attendance.lookup` tRPC procedure once student records have been added through the admin workflow.
