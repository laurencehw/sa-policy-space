#!/usr/bin/env python
"""
Split supabase_housing_migration.sql into smaller batch files for Supabase SQL Editor.
Target: ~150 meeting rows per batch file, under 200KB each.
"""
import os
import re

INPUT_FILE = r"C:\dev\sa-policy-space\.claude\worktrees\romantic-euclid\data\supabase_housing_migration.sql"
OUTPUT_DIR = r"C:\dev\sa-policy-space\.claude\worktrees\romantic-euclid\data"
BATCH_SIZE = 90  # rows per batch

MEETINGS_INSERT_HEADER = """INSERT INTO meetings
    (pmg_meeting_id, committee_name, committee_id, date, title,
     summary_clean, pmg_url, num_documents)
VALUES"""

with open(INPUT_FILE, 'r', encoding='utf-8') as f:
    content = f.read()

lines = content.split('\n')

# Find sections
meetings_insert_start = None
meetings_values_start = None
meetings_end = None
policy_ideas_start = None
idea_meetings_start = None

for i, line in enumerate(lines):
    if line.strip() == 'INSERT INTO meetings':
        meetings_insert_start = i
    if line.strip() == 'VALUES' and meetings_insert_start is not None and meetings_values_start is None:
        meetings_values_start = i + 1  # first row line
    if 'ON CONFLICT (pmg_meeting_id) DO NOTHING' in line and meetings_values_start is not None and meetings_end is None:
        meetings_end = i
    if line.strip().startswith('INSERT INTO policy_ideas'):
        policy_ideas_start = i
    if line.strip().startswith('INSERT INTO idea_meetings'):
        idea_meetings_start = i

print(f"meetings_insert_start: {meetings_insert_start} (line {meetings_insert_start+1})")
print(f"meetings_values_start: {meetings_values_start} (line {meetings_values_start+1})")
print(f"meetings_end: {meetings_end} (line {meetings_end+1})")
print(f"policy_ideas_start: {policy_ideas_start} (line {policy_ideas_start+1})")
print(f"idea_meetings_start: {idea_meetings_start} (line {idea_meetings_start+1})")

# Extract meeting rows (lines from values_start to meetings_end-1)
meeting_row_lines = lines[meetings_values_start:meetings_end]

# Each row is a single line (possibly ending with ',' or not)
# Strip trailing commas to normalise, then we'll add them back as needed
meeting_rows = []
for line in meeting_row_lines:
    stripped = line.rstrip()
    if stripped:  # skip blank lines
        meeting_rows.append(stripped)

# Remove trailing commas from rows (we'll add them properly when writing)
clean_rows = []
for row in meeting_rows:
    if row.endswith(','):
        clean_rows.append(row[:-1])
    else:
        clean_rows.append(row)

print(f"\nTotal meeting rows found: {len(clean_rows)}")

# Split into batches
batches = []
for i in range(0, len(clean_rows), BATCH_SIZE):
    batches.append(clean_rows[i:i + BATCH_SIZE])

print(f"Number of batches: {len(batches)} (target {BATCH_SIZE} rows each)")
for i, batch in enumerate(batches):
    print(f"  Batch {i+1}: {len(batch)} rows")

# Write batch files
batch_files = []
for i, batch in enumerate(batches):
    batch_num = i + 1
    filename = f"supabase_housing_batch_{batch_num}.sql"
    filepath = os.path.join(OUTPUT_DIR, filename)

    rows_sql = ',\n'.join(batch)

    sql = f"""-- Housing/Human Settlements meetings — Batch {batch_num} of {len(batches)}
-- {len(batch)} rows (meetings from Human Settlements committees 91 and 291)
-- Run after: supabase_housing_batch_{batch_num-1}.sql (if applicable)

BEGIN;

{MEETINGS_INSERT_HEADER}
{rows_sql}
ON CONFLICT (pmg_meeting_id) DO NOTHING;

COMMIT;
"""
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(sql)

    size_kb = os.path.getsize(filepath) / 1024
    print(f"  Written: {filename} ({size_kb:.1f} KB)")
    batch_files.append(filepath)

# Write ideas file (policy_ideas + idea_meetings sections)
# Find end of file
ideas_section_lines = lines[policy_ideas_start:]
ideas_section = '\n'.join(ideas_section_lines)

# Also find the section header comment just before policy_ideas
# Look for the comment block starting 2-4 lines before policy_ideas_start
comment_start = policy_ideas_start
for j in range(policy_ideas_start - 1, max(policy_ideas_start - 6, 0), -1):
    if lines[j].startswith('-- '):
        comment_start = j
    elif lines[j].strip() == '':
        continue
    else:
        break

ideas_section_lines = lines[comment_start:]
ideas_section = '\n'.join(ideas_section_lines)

ideas_filename = "supabase_housing_ideas.sql"
ideas_filepath = os.path.join(OUTPUT_DIR, ideas_filename)

ideas_sql = f"""-- Housing/Human Settlements — Policy Ideas and Idea-Meeting Links
-- 15 new policy ideas (IDs 125-139) + idea_meetings cross-references
-- Run AFTER all supabase_housing_batch_*.sql files

BEGIN;

{ideas_section}

COMMIT;
"""

with open(ideas_filepath, 'w', encoding='utf-8') as f:
    f.write(ideas_sql)

size_kb = os.path.getsize(ideas_filepath) / 1024
print(f"\n  Written: {ideas_filename} ({size_kb:.1f} KB)")

print("\nDone. Files created:")
for fp in batch_files:
    print(f"  {fp}")
print(f"  {ideas_filepath}")
