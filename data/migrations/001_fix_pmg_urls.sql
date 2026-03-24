-- Migration 001: Fix PMG URLs to point to human-readable site
-- Problem: meetings.pmg_url was stored as api.pmg.org.za (API endpoint)
--          instead of pmg.org.za (human-readable site)
-- Pattern: https://api.pmg.org.za/committee-meeting/12345/
--       → https://pmg.org.za/committee-meeting/12345/
--
-- Run in Supabase SQL editor or via psql:
--   psql $DATABASE_URL -f data/migrations/001_fix_pmg_urls.sql

BEGIN;

-- Fix meetings.pmg_url
UPDATE meetings
SET pmg_url = replace(pmg_url, 'https://api.pmg.org.za/', 'https://pmg.org.za/')
WHERE pmg_url LIKE 'https://api.pmg.org.za/%';

-- Fix documents.pmg_file_url (file links from PMG API also use api subdomain)
UPDATE documents
SET pmg_file_url = replace(pmg_file_url, 'https://api.pmg.org.za/', 'https://pmg.org.za/')
WHERE pmg_file_url LIKE 'https://api.pmg.org.za/%';

-- Verify
SELECT
  COUNT(*) FILTER (WHERE pmg_url LIKE 'https://api.pmg.org.za/%') AS remaining_api_urls,
  COUNT(*) FILTER (WHERE pmg_url LIKE 'https://pmg.org.za/%')     AS fixed_urls
FROM meetings;

COMMIT;
