# Fixtures

Real project dumps, never invented data. Each file is the JSON of `GET /api/projects/{id}` for a
completed project from our own smoke runs (bizstruct-ml `scripts/e2e_smoke.py`).

| file | idea | shape |
|---|---|---|
| `farm-1-segment.json` | farm produce delivery, `en` | 1 segment, 1 canvas, 3 canvas versions, final version 2 |
| `music-3-segments.json` | live local music platform, `en` | 3 segments in one multi-sided group, 1 canvas, 2 versions, final version 1 |

How a dump becomes a fixture:

1. Run it through bizstruct-ml `experiments/guard.py` (it only catches known secret values and Service
   Bus connection-string markers), then `python3 scripts/scan_fixture.py src/test/fixtures/*.json`, which
   also covers `@`, `Bearer`, `key`, `password`, `token`, `secret`, JWTs and user-like field names, and
   prints every hit. The public DTO carries no user or owner id and no email.
2. `../bizstruct-ml/.venv/bin/python scripts/add_final_version.py IN.json OUT.json` adds `finalVersion`,
   `finalCanvasId` and `finalSwotId` to each `swot_errc_cycle` row. be returns these fields (task
   `feat/final-version-in-project`); until it is merged the fixtures carry them.

The shape tests run over every `*.json` here, so the pilot dumps (five ideas) are added as files only.
