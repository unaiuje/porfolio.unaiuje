# Admin area to manage your portfolio content

Goal: you add, edit and delete your projects, skills and studies yourself from a private admin page — no need to ask me.

## What you get

**A private admin page at `/admin`**
- Sign in with your email and password. Only your account can get in.
- Three tabs: Projects, Skills, Education.
- Each tab has a list of items with edit and delete buttons, plus an "Add new" form.

**Projects**
- Title, short description, image link (you paste a URL), tech tags, live site link, source code link, and ordering.
- Shown on the home page in a new Projects section (cards with hover animation, matching the current style). The section stays hidden while you have no projects.

**Skills**
- Name and ordering. Replaces the current hardcoded chips row.

**Education**
- Title, place, date range, description and ordering. Replaces the current hardcoded timeline items.

**Home page**
- Loads all three sections from your saved content instead of fixed text. Everything else (hero, about, contact, dock) stays as it is.

## How you set it up (one time)

1. I turn on the backend and create your login.
2. You open `/admin`, sign up once with your email and password.
3. I mark that account as the admin so nobody else can edit.
4. You start adding content; it appears on the site immediately.

## Technical notes

- Lovable Cloud (database + auth) enabled for this project.
- Email/password auth turned on, with auto-confirm so you can sign in right away.
- Tables: `projects`, `skills`, `education`, plus `user_roles` with an `app_role` enum and a `has_role()` security-definer function.
- RLS: public `SELECT` for anon and authenticated on the three content tables; `INSERT`/`UPDATE`/`DELETE` restricted to `has_role(auth.uid(), 'admin')`. `user_roles` readable by authenticated only. Explicit `GRANT`s for `anon`, `authenticated` and `service_role` in the same migration.
- New files: `src/pages/Admin.tsx`, `src/pages/Auth.tsx`, `src/components/ProjectsSection.tsx`, admin form components, and hooks for fetching content.
- Routes `/admin` and `/auth` added in `App.tsx`; `/admin` redirects to `/auth` when not signed in or not an admin.
- `SkillsSection` and `EducationSection` switch from hardcoded arrays to data fetched from the database, keeping the existing markup and animations.
