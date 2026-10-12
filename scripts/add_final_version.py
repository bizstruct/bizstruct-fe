#!/usr/bin/env python3
"""One-off: add finalVersion, finalCanvasId and finalSwotId to every swot_errc_cycle row of a project dump.

THESE FIELDS COME FROM BE. bizstruct-be will return them on every swot_errc_cycle row of
GET /api/projects/{id} (be task feat/final-version-in-project). Until that is merged, the
fixtures carry them so the viewer reads them exactly as it will read the real ones. The
viewer never derives the final version itself; this script is the only place it is computed,
and it uses the domain package (final_swot / final_canvas, i.e. select_final_version over the
cycle's Swots), never a re-implementation.

Needs bizstruct-domain v0.17.0 on the import path, e.g. the ml worker's venv:

    ../bizstruct-ml/.venv/bin/python scripts/add_final_version.py IN.json OUT.json

The cycle row holds Swot v1..vN and Canvas v2..vN; Canvas v1 lives on the canvas row the cycle refs.
"""

import json
import sys
from pathlib import Path

from bizstruct_domain import ArtifactRecord, ArtifactType, Canvas, Swot, final_canvas, final_swot, parse_artifact


def parsed(row: dict, artifact_type: ArtifactType) -> list:
    return [
        parse_artifact(ArtifactRecord(id=a["id"], type=ArtifactType(a["type"]), data=a["data"]))
        for a in row["artifacts"]
        if a["type"] == artifact_type.value
    ]


def add_final_fields(project: dict) -> dict:
    rows = {row["id"]: row for row in project["rows"]}
    for row in project["rows"]:
        if row["stage"] != "swot_errc_cycle":
            continue
        (canvas_row_id,) = row["refs"]["canvas"]
        swots: list[Swot] = parsed(row, ArtifactType.SWOT)
        canvases: list[Canvas] = parsed(rows[canvas_row_id], ArtifactType.CANVAS) + parsed(row, ArtifactType.CANVAS)
        swot = final_swot(swots)
        canvas = final_canvas(canvases, swots)
        row["finalVersion"] = swot.canvas_version
        row["finalCanvasId"] = canvas.id
        row["finalSwotId"] = swot.id
    return project


def main() -> None:
    source, target = Path(sys.argv[1]), Path(sys.argv[2])
    project = add_final_fields(json.loads(source.read_text(encoding="utf-8")))
    target.write_text(json.dumps(project, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    for row in project["rows"]:
        if row["stage"] == "swot_errc_cycle":
            print(f"{target.name}: cycle {row['id']} finalVersion={row['finalVersion']}")


if __name__ == "__main__":
    main()
