-- Re-tag trade-related ideas from regulatory_burden/logistics/energy → trade_openness
-- These ideas from the Trade, Industry and Competition committee are primarily about
-- trade policy, not regulation or energy per se.

UPDATE policy_ideas SET binding_constraint = 'trade_openness'
WHERE id IN (3, 4, 7, 10, 17, 19)
  AND source_committee = 'Trade, Industry and Competition';

-- 3:  AGOA Retention and Post-AGOA Trade Diversification
-- 4:  AfCFTA Implementation and Intra-African Trade Expansion
-- 7:  Steel and Metal Fabrication Master Plan (industrial trade policy)
-- 10: Poultry Industry Anti-Dumping and Local Production Expansion
-- 17: Anti-Dumping and Import Surveillance Modernisation
-- 19: BRICS+ Trade Facilitation and Alternative Payment Systems
