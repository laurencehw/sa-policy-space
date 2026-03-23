"""
Initialize dev.sqlite3 with SQLite-compatible schema and seed from dependency_graph.json.
Run from the project root: python scripts/init_and_seed_db.py
"""
import sqlite3
import json
import os
import re

DB_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'dev.sqlite3')
GRAPH_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'dependency_graph.json')

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'[\s-]+', '-', text).strip('-')
    return text

SCHEMA = """
CREATE TABLE IF NOT EXISTS meetings (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    pmg_meeting_id      INTEGER UNIQUE NOT NULL,
    committee_name      TEXT NOT NULL,
    committee_id        INTEGER,
    date                TEXT,
    title               TEXT,
    summary_clean       TEXT,
    pmg_url             TEXT,
    num_documents       INTEGER DEFAULT 0,
    created_at          TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS documents (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    meeting_id      INTEGER NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
    title           TEXT,
    file_type       TEXT,
    pmg_file_url    TEXT,
    description     TEXT
);

CREATE TABLE IF NOT EXISTS policy_ideas (
    id                      INTEGER PRIMARY KEY AUTOINCREMENT,
    title                   TEXT NOT NULL,
    description             TEXT,
    theme                   TEXT,
    binding_constraint      TEXT,
    first_raised_date       TEXT,
    times_raised            INTEGER DEFAULT 1,
    current_status          TEXT DEFAULT 'proposed',
    feasibility_rating      INTEGER CHECK (feasibility_rating BETWEEN 1 AND 5),
    feasibility_note        TEXT,
    growth_impact_rating    INTEGER CHECK (growth_impact_rating BETWEEN 1 AND 5),
    responsible_department  TEXT,
    key_quote               TEXT,
    source_committee        TEXT,
    reform_package          INTEGER,
    time_horizon            TEXT,
    slug                    TEXT UNIQUE,
    created_at              TEXT DEFAULT (datetime('now')),
    updated_at              TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS idea_meetings (
    idea_id     INTEGER NOT NULL REFERENCES policy_ideas(id) ON DELETE CASCADE,
    meeting_id  INTEGER NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
    PRIMARY KEY (idea_id, meeting_id)
);

CREATE TABLE IF NOT EXISTS implementation_plans (
    id                          INTEGER PRIMARY KEY AUTOINCREMENT,
    idea_id                     INTEGER UNIQUE NOT NULL REFERENCES policy_ideas(id) ON DELETE CASCADE,
    roadmap_summary             TEXT,
    implementation_steps        TEXT,
    estimated_timeline          TEXT,
    estimated_cost              TEXT,
    required_legislation        TEXT,
    draft_legislation_notes     TEXT,
    political_feasibility_notes TEXT,
    international_precedents    TEXT,
    created_at                  TEXT DEFAULT (datetime('now')),
    updated_at                  TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_meetings_date           ON meetings(date);
CREATE INDEX IF NOT EXISTS idx_meetings_committee_name ON meetings(committee_name);
CREATE INDEX IF NOT EXISTS idx_policy_ideas_theme              ON policy_ideas(theme);
CREATE INDEX IF NOT EXISTS idx_policy_ideas_binding_constraint ON policy_ideas(binding_constraint);
CREATE INDEX IF NOT EXISTS idx_policy_ideas_current_status     ON policy_ideas(current_status);
CREATE INDEX IF NOT EXISTS idx_policy_ideas_growth_impact      ON policy_ideas(growth_impact_rating DESC);
"""

RESPONSIBLE_DEPT = {
    'energy': 'Department of Mineral Resources and Energy',
    'logistics': 'Department of Transport / Transnet',
    'skills': 'Department of Higher Education and Training',
    'regulatory_burden': 'DTIC / Competition Commission',
    'governance': 'DPSA / National Treasury',
    'fiscal_constraint': 'National Treasury',
    'land_rights': 'DALRRD',
    'healthcare': 'Department of Health',
    'education': 'Department of Basic Education',
    'infrastructure': 'DPWI / PICC',
    'state_capacity': 'DPSA / National Treasury',
    'finance': 'National Treasury',
    'soe': 'DPSA / National Treasury',
}

def main():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)

    # Remove and recreate to ensure clean state
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)

    conn = sqlite3.connect(DB_PATH)
    conn.executescript(SCHEMA)

    with open(GRAPH_PATH) as f:
        graph = json.load(f)

    nodes = graph['nodes']
    print(f"Seeding {len(nodes)} ideas...")

    for n in nodes:
        slug = slugify(n['title'])
        # ensure unique slug
        conn.execute("""
            INSERT INTO policy_ideas
                (id, title, theme, binding_constraint, current_status,
                 feasibility_rating, growth_impact_rating, source_committee,
                 reform_package, time_horizon, slug, responsible_department)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            n['id'],
            n['title'],
            n.get('theme'),
            n.get('binding_constraint'),
            n.get('current_status', 'proposed'),
            n.get('feasibility_rating'),
            n.get('growth_impact_rating'),
            n.get('source_committee'),
            n.get('reform_package'),
            n.get('time_horizon'),
            slug,
            RESPONSIBLE_DEPT.get(n.get('binding_constraint', ''), None),
        ))

    conn.commit()
    conn.close()

    total = len(nodes)
    print(f"Done. {total} ideas seeded into {DB_PATH}")
    print("Verifying...")
    conn2 = sqlite3.connect(DB_PATH)
    c = conn2.cursor()
    c.execute("SELECT COUNT(*) FROM policy_ideas")
    print(f"  policy_ideas rows: {c.fetchone()[0]}")
    conn2.close()

if __name__ == '__main__':
    main()
