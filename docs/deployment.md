# Deployment and authentication

## Local development

Install Node.js 22.12+ and run `npm ci`. Guest mode requires no external credentials.

For account features, copy `.env.example` to `.env.local`:

```dotenv
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLIC_CLIENT_KEY
VITE_EMAIL_AUTH_ENABLED=false
```

These `VITE_*` values are embedded into the browser build. Only a publishable/anon client key belongs here. OAuth secrets and service role keys must remain in the provider's server configuration.

## Supabase

Apply the SQL files in `supabase/migrations/` in filename order to your own project. They define the private workspace table, policies and transactional save function. Review migrations before applying them to an existing database.

Enable Google under Authentication → Sign in / Providers. Enter the Google OAuth Client ID and Client Secret. Keep **Skip nonce checks** disabled and do not enable accounts without an email for this configuration.

In Authentication → URL Configuration, set the production Site URL and allow the application's actual callback origins. For this deployment:

- Production: `https://uitplans.netlify.app/`
- Local development: `http://127.0.0.1:5173/`
- Add a local port only when it is actually used for development.

## Google OAuth

Create a Web application client in Google Cloud. Register the local and production JavaScript origins. The authorized redirect URI is the Supabase callback:

```text
https://YOUR_PROJECT.supabase.co/auth/v1/callback
```

Keep the client secret in Supabase, not in the source tree. Use basic identity scopes; uitplans does not request access to Gmail messages or Google Drive files. Configure the OAuth audience/test users or publication status as appropriate for your deployment, and complete Google's required consent steps yourself.

## Static hosting

```sh
npm run check
npm run check:features
npm run build
```

Publish `dist/`. `netlify.toml` supplies the build command, publish directory and HTML cache settings. Supply the public environment values before building; changing them requires a new build.

The current site is `https://uitplans.netlify.app/` and has been published by uploading the production build to the existing Netlify project. A GitHub push does not imply a Netlify deployment unless continuous deployment is explicitly connected.

Verify Explore, Google callback, save/reload and `/events.html` after deployment. Changing the origin creates a separate Guest store; export a backup before moving Guest data.

## Email

Guest and Google do not need Resend or SMTP. Email sign-in is disabled by default. Enable it only after configuring a suitable mail service and checking delivery to users outside the Supabase organization. The current Google flow is independent of that future email setup.
