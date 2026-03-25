-- Fix 11 mismatched international comparisons where the case study topic
-- doesn't match the linked policy idea. Reassign to correct ideas.

-- Colombia homicide/cable car → Community Policing (was Fiscal Consolidation)
UPDATE international_comparisons SET idea_id = 156 WHERE id = 12;

-- Colombia labour reform → Section 189 Retrenchment Reform (was AGOA Trade)
UPDATE international_comparisons SET idea_id = 146 WHERE id = 11;

-- NZ resource management → Urban Land Release (was AGOA Trade)
UPDATE international_comparisons SET idea_id = 103 WHERE id = 27;

-- Brazil railway concessioning → Transnet Freight Rail (was Steel Master Plan)
UPDATE international_comparisons SET idea_id = 59 WHERE id = 4;

-- Rwanda tourism/MICE → SMME Red Tape BizPortal (was Fuel Deregulation)
UPDATE international_comparisons SET idea_id = 117 WHERE id = 60;

-- Chile pension AFPs → Road Accident Fund Reform (was SANRAL Road Funding)
UPDATE international_comparisons SET idea_id = 78 WHERE id = 55;

-- Brazil Bolsa Familia → Inclusive Growth Spending Review (was SMME Procurement)
UPDATE international_comparisons SET idea_id = 26 WHERE id = 38;

-- India Aadhaar welfare → Primary Healthcare CHW Integration (was Healthcare Worker Employment)
UPDATE international_comparisons SET idea_id = 108 WHERE id = 54;

-- Botswana diamonds/revenues → SARS Capacity Revenue Recovery (was Provincial Health)
UPDATE international_comparisons SET idea_id = 24 WHERE id = 31;

-- Botswana Pula sovereign fund → PPP Reform Social Infrastructure (was Road Accident Fund)
UPDATE international_comparisons SET idea_id = 101 WHERE id = 52;

-- South Korea polytechnics → TVET Artisan Pipeline (was Reading/Literacy)
UPDATE international_comparisons SET idea_id = 51 WHERE id = 8;
