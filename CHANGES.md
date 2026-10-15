# CookNest fixes (14 Oct 2026)

## Setup after unzipping
1. Copy `.env.example` to `.env.local` and fill in your own values (your old `.env.local` is not in this zip).
2. `npm install` (adds the new `bcryptjs` package), then `npm run dev`.

## What changed
- **Passwords hashed (bcrypt).** New accounts store `passwordHash`. Old accounts with a plain-text password still log in once, and are upgraded to a hash automatically at that login.
- **One user document per email** (`users/<email>`). Fixes the login failure that could appear after visiting the profile page.
- **Login and signup show error messages** (wrong password, duplicate email, short password). Passwords must be 8+ characters.
- **Profile**: display name and photo now appear in the navbar, sidebar and greeting. Photos are cropped and compressed in the browser before saving.
- **Favorites**: heart button on recipe cards, recipe pages and the Categories page; the Favorites tab and the dashboard counter use real data (`favorites` collection).
- **Categories page** shows only your own recipes (Favorites tab shows saved ones). Edit and Delete only on your own recipes, and visible on touch screens.
- **New recipe page** `/recipes/[id]`; recipe links from the dashboard and categories open it.
- **Dead links fixed** (`/feed`, `/saved`, `/recipes/new`, `/profile`, `/dashboard/recipes`, `/dashboard/recipe`, `/api/auth/signin`).
- **Navbar**: search box now works; guests no longer see a signed-in menu; placeholder avatar added; Google avatars allowed in `next.config.ts`.
- **SessionProvider at the root layout**, so `useSession` works on the public Recipes page.
- **Dashboard** no longer needs a Firestore composite index.
- **vercel.json** cron is now once a day (the free plan rejects every-5-minutes).

## Not changed (needs a decision)
- Firestore security rules. The app talks to Firestore from the server without a Firebase login, so the rules must stay open for it to work. Properly locking it down means moving server code to the Firebase Admin SDK.
- "Forgot password" was removed from the login page; it needs an email service to work.

## Dark mode update (15 Oct 2026)
- **Theme toggle** (moon/sun button) added to the navbar on desktop and mobile; it remembers your choice.
- **Colour tokens** (`bg-background`, `text-text`, `text-muted`, `border-border`, `bg-surface`) now have dark values in `app/globals.css`, so every page that uses them follows the theme.
- **Dark styles added** to the login, signup, dashboard, recipe, profile and footer pages (about 75 places that were light-only).
- **Inputs** no longer turn white on focus in dark mode.
- **Logo** sits on a light pill in dark mode, because its text and pan are dark.
- `globals.css` now uses Tailwind's documented `@custom-variant dark` form.
