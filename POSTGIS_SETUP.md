# PostGIS setup runbook

The app now requires a PostGIS-enabled Postgres for "near me" search. The
`backend/.env` is already pointing at port `5433`. Pick **one** path below.

## Option A — Use the brew-installed pg16 + postgis (no Docker)

Your existing pg14 stays running on port 5432 with your other databases
untouched. We bring up pg16 alongside it on port 5433.

```sh
# 1. Make pg16 listen on 5433 instead of 5432
echo "port = 5433" >> /opt/homebrew/var/postgresql@16/postgresql.conf

# 2. Start pg16 (alongside the running pg14)
brew services start postgresql@16

# 3. Create the dev DB on the pg16 instance + enable PostGIS
PG16=/opt/homebrew/opt/postgresql@16/bin
$PG16/createdb -p 5433 gjej_pro_dev
$PG16/psql -p 5433 -d gjej_pro_dev -c "CREATE EXTENSION postgis;"

# 4. (Optional) Migrate existing dev data from pg14
pg_dump -p 5432 gjej_pro_dev | $PG16/psql -p 5433 gjej_pro_dev

# 5. Run Django migrations
cd backend && .venv/bin/python manage.py migrate

# 6. Restart Django (it'll pick up the new DB_PORT from .env)
```

## Option B — Docker compose

Cleaner separation, prod-parity. Requires Docker Desktop running.

```sh
# 1. Start Docker Desktop (one-time UI step), then:
docker compose up -d postgis

# 2. Wait for healthy
docker compose ps        # wait until "healthy"

# 3. (Optional) Migrate existing data
pg_dump -p 5432 gjej_pro_dev | \
  docker exec -i gjej_pro_postgis psql -U "$DB_USER" gjej_pro_dev

# 4. Run Django migrations
cd backend && .venv/bin/python manage.py migrate

# 5. Restart Django
```

## After migration

- Existing freelancers' service areas will automatically gain a
  `center_point` derived from the city name on next save (via the model's
  `save()` override). To backfill all existing rows in one go, run:

  ```sh
  cd backend && .venv/bin/python manage.py shell -c "
  from apps.catalog.models import ServiceArea
  for sa in ServiceArea.objects.all():
      sa.save()  # triggers the auto-geocode
  "
  ```

- Test the new endpoint:

  ```sh
  # Find pros within 30km of Tirana centre
  curl 'http://localhost:8765/api/freelancers/?lat=41.3275&lng=19.8189&radius_km=30'
  ```

- In the browser, visit `/profesionistet` and click **📍 Përdor vendndodhjen time**.

## Reverting

If something goes wrong and you want to roll back to pg14 (text-only):
1. Edit `backend/.env`: set `DB_PORT=5432`
2. Edit `backend/config/settings.py`: change `ENGINE` back to `django.db.backends.postgresql`
3. Comment out `django.contrib.gis` in `INSTALLED_APPS`
4. Remove migration `apps/catalog/migrations/0005_*.py` and revert `apps/catalog/models.py`
5. Restart Django

(Or just run with `DB_PORT=5432` and the app still works — the geo migration
just won't apply to the old DB.)
