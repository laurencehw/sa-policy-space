-- Migration 009: Fix PMG URLs — strip api subdomain (http and https variants)
-- Problem: meetings.pmg_url was stored as http://api.pmg.org.za (API endpoint)
--          Migration 001 only handled https://api.pmg.org.za; the bulk of
--          the production data uses http:// (no TLS on the original API calls).
-- Pattern: http://api.pmg.org.za/committee-meeting/12345/
--       → https://pmg.org.za/committee-meeting/12345/

BEGIN;

-- Fix http variant (the predominant case in production)
UPDATE meetings
SET pmg_url = replace(pmg_url, 'http://api.pmg.org.za/', 'https://pmg.org.za/')
WHERE pmg_url LIKE 'http://api.pmg.org.za/%';

-- Fix https variant (belt-and-suspenders; should already be clean after 001)
UPDATE meetings
SET pmg_url = replace(pmg_url, 'https://api.pmg.org.za/', 'https://pmg.org.za/')
WHERE pmg_url LIKE 'https://api.pmg.org.za/%';

-- Same for documents (precautionary)
UPDATE documents
SET pmg_file_url = replace(pmg_file_url, 'http://api.pmg.org.za/', 'https://pmg.org.za/')
WHERE pmg_file_url LIKE 'http://api.pmg.org.za/%';

UPDATE documents
SET pmg_file_url = replace(pmg_file_url, 'https://api.pmg.org.za/', 'https://pmg.org.za/')
WHERE pmg_file_url LIKE 'https://api.pmg.org.za/%';

-- Verify
SELECT
  COUNT(*) FILTER (WHERE pmg_url LIKE '%api.pmg.org.za%') AS remaining_api_urls,
  COUNT(*) FILTER (WHERE pmg_url LIKE 'https://pmg.org.za/%')  AS fixed_urls
FROM meetings;

COMMIT;
