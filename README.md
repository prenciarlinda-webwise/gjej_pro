# Gjej Pro

Marketplace platform connecting freelance professionals (electricians, locksmiths, cleaners, etc.) with people who need a job done.

- **Backend:** Django 6 + DRF + PostgreSQL + SimpleJWT (Argon2 password hashing)
- **Frontend:** Next.js 16 (App Router, Turbopack) + React 19 + Tailwind v4 + Inter / Fraunces
- **Language:** Albanian-first UI, schema designed for multi-country expansion (UK)

## Prerequisites

- Python 3.13+ (tested on 3.14)
- Node.js 20.9+
- PostgreSQL 14+ running locally
- macOS / Linux

## First-time setup

### 1. Backend

```sh
cd backend
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
cp .env.example .env             # edit DB_USER if needed
createdb gjej_pro_dev             # if it doesn't already exist
.venv/bin/python manage.py migrate

# Create the first admin (set your own password)
.venv/bin/python manage.py createsuperuser \
  --email admin@example.com --first_name Admin --last_name Gjej --role admin
```

### 2. Frontend

```sh
cd frontend
npm install                       # (already done by create-next-app)
# .env.local already points at http://localhost:8765/api
```

## Run (two terminals)

```sh
# Terminal 1 — backend
cd backend && .venv/bin/python manage.py runserver 8765
```

```sh
# Terminal 2 — frontend
cd frontend && npm run dev
```

Open http://localhost:3000 (or whatever port Next.js prints). The API runs on http://localhost:8765/api.

## Signing in

After first-time setup, sign in with the admin credentials you created above. Register new freelancer / klient accounts at `/regjistrohu` to populate the user counts.

## Routes

### Frontend
| Path | Description |
| --- | --- |
| `/` | Public homepage |
| `/regjistrohu` | Registration (freelancer or klient role tabs) |
| `/hyr` | Login |
| `/dashboard/admin` | Admin overview — total users, breakdown by role, recent signups |
| `/dashboard/freelancer` | Freelancer dashboard — profile snapshot + completion + next steps |
| `/dashboard/freelancer/profili` | Freelancer profile editor (headline, bio, rate, company, etc.) |
| `/dashboard/freelancer/sherbime` | Freelancer services CRUD (add/edit/delete) |
| `/dashboard/freelancer/zonat` | Freelancer service areas (cities + region, no PostGIS yet) |
| `/dashboard/klient` | Klient dashboard — profile snapshot + 15-category grid |
| `/dashboard/klient/profili` | Klient profile editor (name, phone, address, city) |
| `/dashboard/klient/kerkesat` | Klient: list of own job requests |
| `/dashboard/klient/kerkesat/krijo` | Klient: post a new job request |
| `/dashboard/klient/kerkesat/[id]` | Klient: job detail + received quotes + accept/cancel/complete |
| `/dashboard/freelancer/punet` | Freelancer: open jobs to bid on (with filters) |
| `/dashboard/freelancer/punet/[id]` | Freelancer: job detail + submit/edit/withdraw quote |
| `/dashboard/freelancer/mesazhet` | Freelancer: messaging inbox + thread |
| `/dashboard/klient/mesazhet` | Klient: messaging inbox + thread |
| `/dashboard/freelancer/njoftimet` `/dashboard/klient/njoftimet` `/dashboard/admin/njoftimet` | Notifications inbox (per role) |
| `/rreth-nesh` | About us — mission, values, team |
| `/pyetjet-e-shpeshta` | FAQ |
| `/blog` `/blog/[slug]` | Blog index + post detail (Django-backed via admin) |
| `/dashboard/admin/perdoruesit` | Admin user list (paginated, search, role filter) |
| `/profesionistet` | Public freelancer browse — filter by category, city, verified |
| `/profesionist/[id]` | Public freelancer detail — services, areas, bio (no email/phone shown) |
| `/verifiko-emailin/[token]` | Email verification landing page |

After login, users are auto-redirected to the dashboard for their role.

### API
| Endpoint | Auth | Description |
| --- | --- | --- |
| `POST /api/auth/register/` | — | Register, returns user + JWT pair |
| `POST /api/auth/login/` | — | Login with email + password |
| `POST /api/auth/refresh/` | — | Refresh access token |
| `GET /api/auth/me/` | JWT | Currently authenticated user |
| `POST /api/auth/verify-email/` | — | Consume a verification token (`{token}` in body) |
| `POST /api/auth/resend-verification/` | JWT | Send a fresh verification email (rate-limited 60s) |
| `GET /api/profile/me/` | JWT | Current user + role-specific profile + completion % |
| `PATCH /api/profile/me/` | JWT | Update user-level + role-specific profile fields in one call |
| `GET /api/categories/` | — | List of active service categories (Albanian + English names) |
| `GET /api/me/services/` | JWT (freelancer) | Your services |
| `POST /api/me/services/` | JWT (freelancer) | Create a service |
| `PATCH/DELETE /api/me/services/:id/` | JWT (freelancer) | Edit / delete (owner only) |
| `GET /api/me/service-areas/` | JWT (freelancer) | Your service areas |
| `POST /api/me/service-areas/` | JWT (freelancer) | Add a city |
| `DELETE /api/me/service-areas/:id/` | JWT (freelancer) | Remove a city |
| `GET /api/freelancers/` | — | Public freelancer search (filters: q, category, city, verified, page) |
| `GET /api/freelancers/:user_id/` | — | Public freelancer detail (omits email/phone) |
| `POST /api/me/jobs/` | JWT (klient) | Create a job request |
| `GET /api/me/jobs/` | JWT (klient) | List own jobs |
| `GET /api/me/jobs/:id/` | JWT (klient) | Job detail with all received quotes |
| `PATCH/DELETE /api/me/jobs/:id/` | JWT (klient) | Edit / cancel (only while open) |
| `POST /api/me/jobs/:id/cancel/` | JWT (klient) | Cancel an open job (auto-rejects pending quotes) |
| `POST /api/me/jobs/:id/complete/` | JWT (klient) | Mark in-progress job as completed |
| `POST /api/me/jobs/:id/quotes/:quote_id/accept/` | JWT (klient) | Accept a quote (auto-rejects others, moves job to in_progress) |
| `GET /api/jobs/` | JWT (freelancer) | Open jobs to bid on; filters: q, category, city, mine_only |
| `GET /api/jobs/:id/` | JWT (freelancer) | Open job detail with the freelancer's own quote inlined |
| `POST /api/jobs/:id/quote/` | JWT (freelancer) | Submit a quote (one per (job, freelancer)) |
| `GET /api/me/quotes/` | JWT (freelancer) | List own quotes |
| `PATCH /api/me/quotes/:id/` | JWT (freelancer) | Edit own pending quote |
| `DELETE /api/me/quotes/:id/` | JWT (freelancer) | Withdraw own pending quote |
| `GET /api/conversations/` | JWT | Your conversations + total unread count |
| `POST /api/conversations/` | JWT | Get or create a conversation with `{peer_id}` (idempotent, klient↔freelancer only) |
| `GET /api/conversations/:id/` | JWT | Conversation with all messages |
| `POST /api/conversations/:id/messages/` | JWT | Send a message (`{body}`) |
| `POST /api/conversations/:id/read/` | JWT | Mark all incoming messages in this thread as read |
| `POST /api/reviews/` | JWT (klient) | Post a review for a completed job (1 review per job) |
| `GET /api/freelancers/:user_id/reviews/` | — | Public list of a freelancer's reviews |
| `GET /api/notifications/` | JWT | Paginated list of own notifications |
| `GET /api/notifications/unread-count/` | JWT | Unread count (cheap; polled by frontend every 30s) |
| `POST /api/notifications/:id/read/` | JWT | Mark a single notification as read |
| `POST /api/notifications/read-all/` | JWT | Mark every unread notification as read |
| `POST /api/profile/me/avatar/` | JWT | Upload profile avatar (multipart/form-data, JPEG/PNG/WebP, max 5MB) |
| `DELETE /api/profile/me/avatar/` | JWT | Remove avatar |
| `GET /api/blog/posts/` | — | Public list of published blog posts |
| `GET /api/blog/posts/:slug/` | — | Public blog post detail |
| `GET /api/admin/stats/` | JWT (admin) | User counts and recent signups |
| `GET /api/admin/users/` | JWT (admin) | Paginated user list (filters: q, role, is_active) |

### Email verification (dev mode)

In development, emails print to the Django terminal (the `EMAIL_BACKEND` defaults to `console`). After registering, look for a line like:

```
[VERIFY] verif@test.al
[VERIFY] http://localhost:3002/verifiko-emailin/<token>
```

Copy that link into your browser to verify the account. For prod, set the SMTP env vars in `backend/.env`.

## Project structure

```
gjej_pro/
├── backend/
│   ├── apps/
│   │   ├── accounts/      # User model, auth API, admin stats
│   │   └── profiles/      # FreelancerProfile, KlientProfile, Company
│   ├── config/            # Django settings, urls
│   ├── manage.py
│   └── requirements.txt
└── frontend/
    └── src/
        ├── app/
        │   ├── (auth)/    # /hyr, /regjistrohu (shared two-pane layout)
        │   ├── dashboard/ # role-specific pages, role-guarded layout
        │   └── page.tsx   # public homepage
        ├── components/    # Logo, Button, Field
        └── lib/           # api client, auth context
```

## Notes

- PostGIS is not yet wired up locally (Postgres 14 is running but the brew formula installed PostGIS for pg16). This is fine for Phase 1 (auth-only). Resolve before Phase 2 — recommend Docker compose with the `postgis/postgis:16-3.5` image to keep the user's other local databases untouched.
- Email verification is currently a no-op flag (`is_email_verified` defaults to `false`). Sending verification emails is scheduled for a follow-up phase.
