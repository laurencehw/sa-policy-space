-- Migration 023: Final PMG URL cleanup (idempotent catch-all)
-- Generated 2026-03-26
--
-- Context: Migrations 001 and 009 already cleaned api.pmg.org.za URLs from
-- meetings and documents in local dev.  This migration is an idempotent
-- safety-net for Supabase production in case any rows were inserted after
-- those migrations ran, or if the migrations were applied out of order.
--
-- Both http:// and https:// variants of api.pmg.org.za are normalised to
-- the human-readable https://pmg.org.za/ prefix.
--
-- No hardcoded api.pmg.org.za URLs were found in the codebase outside of
-- data-collection scripts (collect_*.py) where the API base URL is correct
-- and is already converted before storage.
--
-- Run in Supabase SQL editor or via psql:
--   psql $DATABASE_URL -f data/migrations/023_fix_pmg_urls.sql

BEGIN;

-- meetings.pmg_url — http variant
UPDATE meetings
SET pmg_url = replace(pmg_url, 'http://api.pmg.org.za/', 'https://pmg.org.za/')
WHERE pmg_url LIKE 'http://api.pmg.org.za/%';

-- meetings.pmg_url — https variant
UPDATE meetings
SET pmg_url = replace(pmg_url, 'https://api.pmg.org.za/', 'https://pmg.org.za/')
WHERE pmg_url LIKE 'https://api.pmg.org.za/%';

-- documents.pmg_file_url — http variant
UPDATE documents
SET pmg_file_url = replace(pmg_file_url, 'http://api.pmg.org.za/', 'https://pmg.org.za/')
WHERE pmg_file_url LIKE 'http://api.pmg.org.za/%';

-- documents.pmg_file_url — https variant
UPDATE documents
SET pmg_file_url = replace(pmg_file_url, 'https://api.pmg.org.za/', 'https://pmg.org.za/')
WHERE pmg_file_url LIKE 'https://api.pmg.org.za/%';

-- Verify — both tables should report 0 remaining api.pmg.org.za URLs
SELECT
  'meetings'                                                          AS tbl,
  COUNT(*) FILTER (WHERE pmg_url LIKE '%api.pmg.org.za%')            AS remaining_api_urls,
  COUNT(*) FILTER (WHERE pmg_url LIKE 'https://pmg.org.za/%')        AS clean_urls
FROM meetings
UNION ALL
SELECT
  'documents',
  COUNT(*) FILTER (WHERE pmg_file_url LIKE '%api.pmg.org.za%'),
  COUNT(*) FILTER (WHERE pmg_file_url LIKE 'https://pmg.org.za/%')
FROM documents;

COMMIT;
