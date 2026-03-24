-- Migration 013: Feasibility ratings for IDs 1–20
-- These 20 ideas were seeded from the dependency_graph.json before feasibility ratings
-- were systematically assigned. Ratings calibrated against GNU dynamics, legislative
-- progress, and Operation Vulindlela priority tracking (1=lowest, 5=highest).
-- ─────────────────────────────────────────────────────────────────────────────────────

BEGIN;

-- ID 1: Copyright Amendment Bill — 3 presidential referrals; politically complex
UPDATE policy_ideas SET feasibility_rating = 3 WHERE id = 1 AND feasibility_rating IS NULL;
-- ID 2: Competition Commission OIPMI — inquiry ongoing, process well-established
UPDATE policy_ideas SET feasibility_rating = 3 WHERE id = 2 AND feasibility_rating IS NULL;
-- ID 3: AGOA — depends on US Congressional renewal; external dependency
UPDATE policy_ideas SET feasibility_rating = 3 WHERE id = 3 AND feasibility_rating IS NULL;
-- ID 4: AfCFTA — multilateral complexity; SA ratification complete but implementation slow
UPDATE policy_ideas SET feasibility_rating = 3 WHERE id = 4 AND feasibility_rating IS NULL;
-- ID 5: EV White Paper — DTIC-led, OEM investment decisions imminent; Operation Vulindlela
UPDATE policy_ideas SET feasibility_rating = 3 WHERE id = 5 AND feasibility_rating IS NULL;
-- ID 6: Green Hydrogen — long lead time, infrastructure-intensive; early-stage
UPDATE policy_ideas SET feasibility_rating = 3 WHERE id = 6 AND feasibility_rating IS NULL;
-- ID 7: Steel Master Plan — social compact signed; implementation gaps but momentum
UPDATE policy_ideas SET feasibility_rating = 3 WHERE id = 7 AND feasibility_rating IS NULL;
-- ID 8: R-CTFL Master Plan — social compact in place; ITAC enforcement improving
UPDATE policy_ideas SET feasibility_rating = 3 WHERE id = 8 AND feasibility_rating IS NULL;
-- ID 9: SEZ Reform — Amendment Bill in progress; investor-led boards politically feasible
UPDATE policy_ideas SET feasibility_rating = 3 WHERE id = 9 AND feasibility_rating IS NULL;
-- ID 10: Poultry Anti-Dumping — ITAC mechanism well-established; industry compact signed
UPDATE policy_ideas SET feasibility_rating = 4 WHERE id = 10 AND feasibility_rating IS NULL;
-- ID 11: SMME Regulatory Burden — Ombud enacted; BizPortal operational; top OV priority
UPDATE policy_ideas SET feasibility_rating = 4 WHERE id = 11 AND feasibility_rating IS NULL;
-- ID 12: Digital Platforms — OIPMI ongoing; Competition Act tools available
UPDATE policy_ideas SET feasibility_rating = 3 WHERE id = 12 AND feasibility_rating IS NULL;
-- ID 13: NLC Governance — Amendment Bill cross-party supported; board reconstitution possible
UPDATE policy_ideas SET feasibility_rating = 3 WHERE id = 13 AND feasibility_rating IS NULL;
-- ID 14: Localisation — Public Procurement Act 2024 enacted; OCPO implementation underway
UPDATE policy_ideas SET feasibility_rating = 4 WHERE id = 14 AND feasibility_rating IS NULL;
-- ID 15: BBBEE EEIP — existing programme; B-BBEE Commission can expand via guidelines
UPDATE policy_ideas SET feasibility_rating = 4 WHERE id = 15 AND feasibility_rating IS NULL;
-- ID 16: 4IR Digital Skills — Presidential Commission report done; corporate partnerships active
UPDATE policy_ideas SET feasibility_rating = 4 WHERE id = 16 AND feasibility_rating IS NULL;
-- ID 17: Anti-Dumping Modernisation — administrative reform; ITAC/SARS coordination feasible
UPDATE policy_ideas SET feasibility_rating = 4 WHERE id = 17 AND feasibility_rating IS NULL;
-- ID 18: APDP Phase 3 — DTIC-OEM compact in active negotiation; auto sector strategically vital
UPDATE policy_ideas SET feasibility_rating = 4 WHERE id = 18 AND feasibility_rating IS NULL;
-- ID 19: BRICS+ Trade — DIRCO-led; geopolitically sensitive but administratively feasible
UPDATE policy_ideas SET feasibility_rating = 3 WHERE id = 19 AND feasibility_rating IS NULL;
-- ID 20: Energy Bounce-Back — scheme already operational; scale-up administratively feasible
UPDATE policy_ideas SET feasibility_rating = 4 WHERE id = 20 AND feasibility_rating IS NULL;

COMMIT;
