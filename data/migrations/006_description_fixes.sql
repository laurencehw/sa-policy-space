-- ============================================================
-- Migration 006: Description Fixes — Mismatch Correction + Factual Errors
-- Generated: 2026-03-24
-- Root cause: supabase_housing_enrichment.sql ran UPDATE statements
--   targeting IDs 125–132, which in production held Operation Vulindlela
--   Phase II ICT/water/immigration ideas (not housing ideas).
--   Additionally, supabase_2025_update_migration.sql used
--   ON CONFLICT DO UPDATE to overwrite ID 124's description with
--   SARB Inflation Target content, despite a different idea title.
-- This migration:
--   1. Restores correct descriptions for IDs 124–132
--   2. Fixes factual errors in IDs 59, 61, 79
--      (Transnet rail access regulations finalised Dec 2024;
--       Eskom debt relief extended to 2028/29)
-- Note: The MTBPS date ("13 November 2025") and the "700,000 hijacked
--   buildings" figure appear in descriptions that are replaced by this
--   migration and are therefore corrected implicitly.
-- ============================================================

BEGIN;

-- ============================================================
-- PART 1: DESCRIPTION MISMATCH FIXES (IDs 124–132)
-- All are Operation Vulindlela / SONA 2026 reforms
-- ============================================================

-- id=124: IMT Spectrum Auction Completion (ICASA)
UPDATE policy_ideas SET
  description = 'The 2024 ICASA spectrum auction allocated high-demand spectrum across five frequency bands (700 MHz, 800 MHz, 2.6 GHz, 3.5 GHz, and 26 GHz) to South Africa''s mobile operators, raising approximately R14.4 billion in licence fees — a landmark revenue event and the culmination of a decade-long process delayed by litigation, regulatory disputes, and COVID-19. The allocation provides the spectral backbone needed for 5G rollout in urban centres and affordable LTE coverage in underserved rural areas. Operation Vulindlela identified spectrum release as a critical digital economy enabler: spectrum undersupply had kept mobile data costs among the highest in Africa. Licence conditions include roll-out obligations requiring 30% rural coverage within five years. ICASA must now monitor compliance, operationalise secondary spectrum trading mechanisms to allow efficient reallocation as technology evolves, and conduct a follow-on auction for the remaining digital-dividend spectrum freed by the analogue switch-off. As of early 2026, operators have received their licences and are deploying 5G infrastructure in major metropolitan areas.',
  responsible_department = 'ICASA / Department of Communications and Digital Technologies',
  updated_at = NOW()
WHERE id = 124;

-- id=125: Digital TV Migration and Analogue Switch-Off
UPDATE policy_ideas SET
  description = 'South Africa''s transition from analogue to digital terrestrial television (DTT) using the DVB-T2 standard is among the most persistently delayed policy deliverables in post-apartheid infrastructure history — originally planned for 2011, it has been deferred multiple times due to procurement disputes, an encoding policy impasse, and contested set-top box (STB) subsidies. The analogue switch-off (ASO) matters beyond broadcasting: completing it frees the "digital dividend" spectrum in the 694–862 MHz range, low-band frequencies essential for affordable rural mobile broadband and central to 5G coverage economics. SENTECH manages DTT signal distribution; the SABC and e.tv are the primary transitioning broadcasters. An estimated 3.5–5 million qualifying low-income households require state-subsidised STBs. A 2023 settlement resolved the encoding policy dispute. As of early 2026, the ASO has been completed in some regions but not nationally. Full completion would unlock additional spectrum for the 700 MHz band auction, directly expanding rural connectivity and reducing mobile data prices for underserved communities.',
  responsible_department = 'SENTECH / Department of Communications and Digital Technologies',
  updated_at = NOW()
WHERE id = 125;

-- id=126: Rapid Deployment Policy for Telecommunications Infrastructure
UPDATE policy_ideas SET
  description = 'South Africa''s Rapid Deployment Policy (RDP) for electronic communications infrastructure, issued under the Electronic Communications Act, is designed to reduce the time and cost of obtaining wayleave rights, municipal construction approvals, and environmental authorisations for towers, fibre ducts, and small cells. Historically, mobile operators and ISPs faced 18–36 month approval timelines, with municipalities levying inconsistent and excessive fees that deterred rural rollout. The Electronic Communications Amendment Act and subsequent ICASA facilities leasing regulations (updated 2024) provide for deemed consent, standardised wayleave fees, and mandatory co-location on towers and access to dark fibre to prevent infrastructure duplication. Operation Vulindlela Phase II identified RDP enforcement at local government level as a priority: fibre connectivity has expanded rapidly in urban South Africa but rural coverage gaps persist because wayleave disputes at municipal level continue to stall projects. Operationalising the RDP requires DCDT to monitor and enforce municipal compliance, digitalise the wayleave application process, and provide technical guidance to smaller municipalities lacking the regulatory capacity to process applications within statutory timelines.',
  responsible_department = 'Department of Communications and Digital Technologies / ICASA',
  updated_at = NOW()
WHERE id = 126;

-- id=127: Water-Use Licence Reform: Streamlining the Application System
UPDATE policy_ideas SET
  description = 'South Africa''s water-use licensing process — administered by the Department of Water and Sanitation (DWS) under the National Water Act (1998) — is a severe administrative bottleneck constraining agricultural expansion, mining, and industrial investment. Licence applications routinely take 3–7 years to process; the backlog at DWS exceeded 4,000 applications as of 2024. Investors in irrigation development, aquaculture, and water-intensive manufacturing face years of regulatory uncertainty before they can break ground. Operation Vulindlela identified water-use licence reform as a Phase II priority, targeting: full digitalisation of the National Water Resource System (NWRS) application platform; delegation of lower-risk licensing decisions to Catchment Management Agencies (CMAs); and introduction of deemed-approval provisions for applications meeting defined minimum criteria within 90 days. As of early 2026, DWS has made partial progress on NWRS digitisation and CMA delegation in the Breede-Gouritz and Inkomati-Usuthu catchments, but the overall backlog and processing turnaround have not materially improved. Resolving the backlog is a prerequisite for unlocking investment in agriculture and green hydrogen production, both of which require assured water-use authorisation.',
  responsible_department = 'Department of Water and Sanitation',
  updated_at = NOW()
WHERE id = 127;

-- id=128: Raw Water Pricing Strategy Reform
UPDATE policy_ideas SET
  description = 'South Africa''s raw water pricing — the charges levied by DWS for water abstracted from state water schemes (dams, reservoirs, and inter-basin transfer infrastructure) and supplied to municipalities, industries, and agriculture — is managed through the Water Trading Entity (WTE), a dedicated fund within DWS. The existing pricing structure has been criticised for systematic under-recovery of operating and capital costs, leading to infrastructure maintenance underfunding and financially unsustainable schemes across the Vaal, Orange, and Crocodile systems. The Raw Water Pricing Strategy reform, aligned with the National Water and Sanitation Master Plan, aims to introduce cost-reflective tariffs that recover full operating and maintenance costs while providing transparent cross-subsidies for poor households and smallholder farmers. Key elements include: a water charges system calibrated to volume, supply reliability class, and water quality; differentiated tariffs by use category; and a cost-recovery model that enables DWS to fund ongoing infrastructure rehabilitation. Municipalities — as the largest consumers of scheme water — are the primary stakeholders, and tariff increases require careful sequencing with bulk and retail tariff reform at local government level to avoid affordability shocks.',
  responsible_department = 'Department of Water and Sanitation',
  updated_at = NOW()
WHERE id = 128;

-- id=129: National Water Resources Infrastructure Agency (NWRIA) Establishment
UPDATE policy_ideas SET
  description = 'The National Water Resources Infrastructure Agency (NWRIA) is proposed as a dedicated state entity to own, operate, and develop South Africa''s bulk national water infrastructure — including 314 major dams, the Lesotho Highlands Water Project transfer tunnels, and inter-basin transfer schemes such as the Vaal–Orange system. Currently these functions sit within DWS''s Water Trading Entity (WTE), which lacks a separate balance sheet, independent governance, and the commercial mandate needed to raise development finance for new infrastructure. The NWRIA concept is modelled on the rationale that produced NTCSA in the electricity sector: a national infrastructure authority with ring-fenced revenue, an independent board, and the ability to borrow against regulated asset value without crowding out the DWS operational budget. The Water and Sanitation Amendment Bill provides the legislative basis. A separately capitalised NWRIA could potentially mobilise R50–100 billion in development finance institution and bond market funding to address the R900 billion+ investment gap identified in the National Water and Sanitation Master Plan. As of early 2026, the Bill has been tabled in Parliament but not yet enacted; institutional design details — particularly the transition of WTE assets and staff — remain under development within DWS.',
  responsible_department = 'Department of Water and Sanitation',
  updated_at = NOW()
WHERE id = 129;

-- id=130: National Rail Policy White Paper: Third-Party Access Framework
UPDATE policy_ideas SET
  description = 'The National Rail Policy White Paper, adopted by Cabinet in March 2022, establishes South Africa''s long-term framework for structural reform of the rail sector — transitioning from Transnet''s vertically integrated monopoly model toward a network access regime in which the track infrastructure is separated from train operations and open access is enabled for competitive private operators across both freight and passenger networks. The policy commits to: appointing a rail infrastructure manager to oversee track access; establishing the Economic Regulation of Transport Act (EROT Act, 2024) framework with the Transport Economic Regulator setting access prices; and enabling concession arrangements for passenger rail corridors. PRASA''s long-term concession model is also addressed. As of early 2026, the freight component has advanced further than passenger: third-party access regulations were finalised in December 2024, with 11 private rail operators now operating on Transnet corridors under Operation Vulindlela Phase II. Full track-operations separation within Transnet — the most structurally significant element of the White Paper — has not yet been implemented and represents the medium-term reform target requiring an amendment to the Legal Succession to the South African Transport Services Act.',
  responsible_department = 'Department of Transport / Transnet / Transport Economic Regulator',
  updated_at = NOW()
WHERE id = 130;

-- id=131: Critical Skills List Update and Visa Fast-Track
UPDATE policy_ideas SET
  description = 'South Africa''s Critical Skills Visa allows holders of qualifications in designated scarce-skills occupations to enter and reside in SA without a prior job offer — simplifying the immigration pathway for professionals the economy urgently needs. The Critical Skills List (CSL), promulgated under the Immigration Act, had not been substantively updated from 2014 until Operation Vulindlela identified visa reform as a priority. The revised CSL gazetted in 2022 expanded qualifying occupation categories and removed administrative barriers, including the requirements that made occupation-specific exemptions difficult to obtain. However, processing times for Critical Skills Visas remained 6–12 months on average, and biometric capture backlogs at DHA offices abroad created bottlenecks for approved applicants. Operation Vulindlela Phase II committed to reducing the Critical Skills Visa turnaround to 4–8 weeks and implementing a dedicated fast-track lane for priority skills categories. As of early 2026, DHA has implemented processing improvements and piloted a trusted-employer programme allowing pre-certified companies to recruit foreign professionals with expedited approvals. In-demand categories include engineering, ICT, medical specialists, and energy transition skills — all identified as binding constraints on infrastructure delivery and private investment.',
  responsible_department = 'Department of Home Affairs / Operation Vulindlela',
  updated_at = NOW()
WHERE id = 131;

-- id=132: e-Visa System Rollout for Tourism and Business
UPDATE policy_ideas SET
  description = 'South Africa''s e-visa system — enabling online visa applications without requiring in-person biometric capture at a DHA mission for initial applications — is intended to substantially reduce the friction that has suppressed tourism and business visitor arrivals. South Africa''s visa competitiveness has been constrained by slow processing times, limited DHA diplomatic mission presence in high-growth source markets (China, India, Southeast Asia), and the absence of a digital application pathway. The National Tourism Sector Strategy targets restoring visitor numbers toward the 2019 pre-COVID baseline of 15 million arrivals annually; tourism contributes approximately 2.9% of GDP directly and supports over 700,000 jobs. Operation Vulindlela Phase II committed to implementing e-visas as a priority reform. As of early 2026, the e-visa system has been launched for a limited set of nationalities and visa categories, but DHA has encountered technical and procurement challenges in scaling the platform. Implementation is linked to upgrades of the Home Affairs National Identification System (HANIS), the National Immigration Information System (NIIS), and planned e-gate deployments at OR Tambo, Cape Town, and King Shaka international airports. Expanding e-visa eligibility to the 10 highest-volume source markets would generate an estimated 1–2 million additional annual arrivals.',
  responsible_department = 'Department of Home Affairs / SA Tourism',
  updated_at = NOW()
WHERE id = 132;

-- ============================================================
-- PART 2: FACTUAL ERROR CORRECTIONS
-- ============================================================

-- id=59: Transnet Freight Rail and Port Private Sector Participation
-- Fix: "rail third-party access regulations remain draft" → finalised Dec 2024, 11 operators
UPDATE policy_ideas SET
  description = 'Transnet''s freight rail volumes declined from 230 million tonnes in 2013 to under 150 million tonnes by 2024, driven by infrastructure deterioration, cable theft, and operational dysfunction. Port container throughput at Durban — Africa''s busiest port — ranks among the slowest globally by vessel turnaround time. The reform programme involves awarding third-party access rights on the iron ore and coal export corridors, concessioning terminal operations at major ports to private operators, and establishing an independent economic regulator for ports and rail (EROT). The World Bank estimates that logistics inefficiency costs SA approximately 4–6% of GDP annually. Third-party access regulations for freight rail were finalised in December 2024, with 11 private operators approved to operate on specified Transnet corridors under Operation Vulindlela Phase II — a structural shift from 2022 when no private operators had network access. Chrome and manganese exporters in the Northern Cape and North West are primary early beneficiaries. Port concessioning at Durban and Ngqura container terminals remains the key outstanding deliverable; productivity at Durban (approximately 23 crane moves per hour against a global benchmark of 35+) is the principal logistics cost constraint.',
  updated_at = NOW()
WHERE id = 59;

-- id=61: Eskom Debt Relief Conditions and Restructuring Framework
-- Fix: "over three years" → extended to 2028/29; update implementation status
UPDATE policy_ideas SET
  description = 'As part of the 2023 Eskom debt relief package, National Treasury assumed R254 billion of Eskom''s approximately R400 billion debt burden over a multi-year period extending to 2028/29, subject to strict conditions including restructuring milestones, cost reduction targets, and renewable energy procurement progress. The restructuring framework requires Eskom to separate its balance sheets for generation, transmission, and distribution; implement asset performance improvements; and achieve agreed EBITDA targets. Failure to meet conditions could trigger accelerated repayment provisions. The debt relief is the largest contingent liability management operation in South African fiscal history and directly affects the sovereign''s debt trajectory. As of early 2026, tranches have been transferred on schedule and the programme runs to 2028/29 per the revised Treasury framework. Eskom''s Energy Availability Factor improvement from approximately 58% in 2023 to approximately 69% by 2025 demonstrates progress against restructuring milestones. Coal plant availability and cost reduction targets remain challenging as the ageing fleet continues to underperform design parameters, and the Cabinet-approved unbundling of Eskom into separate generation, transmission (NTCSA), and distribution entities is the structural counterpart to the debt relief conditionality.',
  updated_at = NOW()
WHERE id = 61;

-- id=79: Freight Rail Third-Party Access and Transnet Separation
-- Fix: "draft access regulations have been published but not finalised" → finalised Dec 2024, 11 operators
UPDATE policy_ideas SET
  description = 'Third-party access to Transnet''s freight rail network is essential for competitive private rail operations, but structural separation of track ownership from operations has not yet occurred. The reform involves gazetted third-party access regulations specifying access charges, capacity allocation rules, and dispute resolution mechanisms for private operators seeking to run trains on Transnet''s corridors — particularly the manganese, chrome, and general freight networks. The Transnet Freight Rail (TFR) separation from Transnet''s port and pipeline businesses (Transnet Port Terminals, Transnet Pipelines) would clarify the network''s financial structure and enable an independent track access authority. Private operators — including mining houses — are willing to invest in locomotives if regulatory certainty exists. Third-party access regulations were finalised in December 2024, with 11 private rail operators now operating on the Transnet freight network under Operation Vulindlela Phase II — a landmark structural shift from 2022 when no private operators had network access. Chrome and manganese exporters in the Northern Cape and North West are primary beneficiaries. Full institutional separation of TFR''s track management from train operations remains incomplete and is the medium-term structural target required to realise the National Rail Policy White Paper''s competitive market vision.',
  updated_at = NOW()
WHERE id = 79;

COMMIT;
