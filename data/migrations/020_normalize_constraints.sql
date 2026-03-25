-- Normalize duplicate binding constraint values to canonical forms.
-- Merges synonym variants so the themes page shows clean categories.

-- corruption → corruption_governance
UPDATE policy_ideas SET binding_constraint = 'corruption_governance'
WHERE binding_constraint = 'corruption';

-- digital → digital_infrastructure
UPDATE policy_ideas SET binding_constraint = 'digital_infrastructure'
WHERE binding_constraint = 'digital';

-- land, land_reform → land_housing
UPDATE policy_ideas SET binding_constraint = 'land_housing'
WHERE binding_constraint IN ('land', 'land_reform');

-- regulation → regulatory_burden
UPDATE policy_ideas SET binding_constraint = 'regulatory_burden'
WHERE binding_constraint = 'regulation';
