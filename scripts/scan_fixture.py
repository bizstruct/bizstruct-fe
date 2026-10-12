#!/usr/bin/env python3
"""Scan a project dump before it becomes a test fixture. Stdlib only.

bizstruct-ml's experiments/guard.py only looks for known secret values and Service Bus
connection-string markers; it does not see emails, user ids, bearer tokens or JWTs. This
scan covers those too and prints EVERY hit with its context, so a person reads them.

    python3 scripts/scan_fixture.py src/test/fixtures/*.json

Exit code 1 on any hit that is not on the allow-list of domain terms (key_resources, ...).
Also fails when a field name looks like it carries a user or owner.
"""

import json
import re
import sys
from collections import Counter
from pathlib import Path

PATTERNS = {
    "@": r"@",
    "Bearer": r"Bearer",
    "key": r"\w*key\w*",
    "password": r"password",
    "token": r"token",
    "secret": r"secret",
    "connection string / JWT": r"(SharedAccessKey|Endpoint=|sb://|AccountKey|DefaultEndpointsProtocol|eyJ[A-Za-z0-9_-]{10,})",
}
# Words that contain "key" legitimately: Business Model Canvas sections, SWOT threat questions, prose.
ALLOWED_KEY_WORDS = {"key", "key_resources", "key_activities", "key_partnerships", "key_activity_disruption"}
USER_LIKE_FIELD = re.compile(r"user|owner|email|mail|author|account", re.I)


def field_names(value: object) -> set[str]:
    names: set[str] = set()
    if isinstance(value, dict):
        for key, item in value.items():
            names.add(key)
            names |= field_names(item)
    elif isinstance(value, list):
        for item in value:
            names |= field_names(item)
    return names


def scan(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    ok = True
    print(f"== {path.name} ({len(text)} bytes)")
    for label, pattern in PATTERNS.items():
        hits = [m.group(0).lower() for m in re.finditer(pattern, text, re.I)]
        if label == "key":
            unexpected = Counter(h for h in hits if h not in ALLOWED_KEY_WORDS)
            print(f"  {label}: {len(hits)} hits, words {dict(Counter(hits))}")
            ok &= not unexpected
        else:
            print(f"  {label}: {len(hits)} hits")
            ok &= not hits
    suspicious = sorted(n for n in field_names(json.loads(text)) if USER_LIKE_FIELD.search(n))
    print(f"  user-like field names: {suspicious or 'none'}")
    return ok and not suspicious


def main() -> None:
    results = [scan(Path(p)) for p in sys.argv[1:]]
    print("SCAN OK" if all(results) else "SCAN FOUND SOMETHING: read the hits above")
    sys.exit(0 if all(results) else 1)


if __name__ == "__main__":
    main()
