-- ============================================================
-- Migration 007c: Remaining policy idea descriptions
-- Batch C: 25 ideas (IDs 73-102)
-- Part of a 100-idea update covering all ideas without
-- formal migration descriptions (all except 003/006 coverage)
-- Generated: 2026-03-24
-- ============================================================

BEGIN;

-- id=73
UPDATE policy_ideas SET
  description = 'South Africa''s agricultural sector contributes 2.5% of GDP while employing 5.5% of the workforce, yet underperforms its potential in technology adoption. Precision agriculture, digital market linkage platforms, cold chain logistics, and agro-processing value addition are underdeveloped relative to Brazil, Kenya, and the Netherlands. The Agri-Tech cluster reform proposes concentrating agri-tech incubation, R&D, and production in SEZs in the Western Cape (wine and horticulture), Limpopo (tropical fruits), and KwaZulu-Natal (sugar and macadamia). DAFF''s Agri-Parks programme provides partial infrastructure. Parliamentary Committee on Agriculture BRRRs noted the R14 billion agriculture budget is heavily weighted toward land reform rather than productivity enhancement. DTIC''s SEZ framework provides the legal and incentive structure for cluster development.',
  updated_at = NOW()
WHERE id = 73;

-- id=74
UPDATE policy_ideas SET
  description = 'South Africa''s space programme through SANSA has a legacy in Earth observation and space weather monitoring but limited commercial satellite manufacturing or launch services. The DSI Space Economy Roadmap (2017) and STI Decadal Plan target R21 billion in space economy value and 10,000 jobs by 2030. Geographic positioning near optimal orbital inclinations and the residual capability of Denel Spaceteq offer a foundation for a commercial satellite manufacturing hub. Reform involves establishing a commercial space agency framework, amending the Space Affairs Act (1993), and attracting anchor tenants for a proposed satellite manufacturing cluster at the Cape Peninsula. ESA, NASA, and commercial launch provider partnerships (including Starlink ground operations) are identified leverage points. Parliamentary Committee on Science BRRRs noted SANSA''s budget is insufficient for commercial programme development.',
  updated_at = NOW()
WHERE id = 74;

-- id=75
UPDATE policy_ideas SET
  description = 'South Africa is signatory to the CBD and Nagoya Protocol, requiring formal access and benefit-sharing (ABS) frameworks for commercialising indigenous knowledge systems (IKS) in biodiversity products and traditional medicine. The IP Laws Amendment Act (2013) created an IKS database through CIPC, but implementation has been slow. The rooibos ABS agreement (2019), which secured R1.5 million in annual payments to San and Khoikhoi communities, provides a working model. The Hoodia cactus case illustrated biopiracy risks where SA failed to protect community interests. The DSI''s revised IKS Policy (2023) needs legislative backing through the Traditional Knowledge Bill, in draft since 2017. Parliamentary Committee on Trade and Industry BRRRs noted the backlog of IKS protection cases and the absence of a funded NIPMO-equivalent for traditional knowledge management.',
  updated_at = NOW()
WHERE id = 75;

-- id=78
UPDATE policy_ideas SET
  description = 'The Road Accident Fund (RAF), a statutory insurer that compensates victims of road accidents regardless of fault, carries an actuarial liability of R600 billion (2024)—equivalent to 10% of GDP—making it the largest contingent liability on South Africa''s books after Eskom. The RAF is structurally insolvent: fuel levy revenue of R45 billion annually (2025/26) covers only current claims, while the unfunded liability grows by R50–80 billion per year as courts award increasingly large general damages. The RAF Amendment Act and the Road Accident Benefit Scheme (RABS) Bill, proposed since 2014, would replace the tort-based system with a no-fault social insurance model (fixed benefit schedules, income replacement for injured workers, functional rehabilitation rather than lump-sum damages). The reform eliminates the R20 billion in legal fees and disbursements that currently absorb 40% of the RAF''s total payments, redirecting them to claimant benefits. The PC on Transport BRRRs 2021–2024 have unanimously recommended RAF structural reform for a decade, noting that the legal profession''s opposition (protecting a R20 billion annual fee income) is the primary political obstacle. National Treasury''s fiscal risk register classifies RAF as the highest-risk contingent liability.',
  updated_at = NOW()
WHERE id = 78;

-- id=81
UPDATE policy_ideas SET
  description = 'South Africa''s e-toll system on Gauteng freeways was officially discontinued on 12 April 2024, after more than a decade of near-total public non-compliance. Gantries were physically disconnected; the Gauteng Freeway Improvement Project (GFIP) debt of approximately R20 billion is being settled 70% by National Treasury and 30% by the Gauteng Provincial Government. SANRAL''s traditional toll plazas continue to operate nationwide, with tariffs increased by 4.84% effective 1 March 2025. The e-toll episode exposed the fundamental challenge of road funding in South Africa: the fuel levy, historically the primary source of road maintenance revenue, is declining in real terms as vehicles become more fuel-efficient, and faces accelerating long-term erosion as EVs (which pay no fuel levy) gain market share. The Department of Transport is developing a Road Funding Policy that must address: the fiscal gap left by the fuel levy decline, the replacement revenue model for EVs and electric trucks, the equitable contribution of heavy freight vehicles that cause disproportionate road damage, and the feasibility of distance-based charging (a modern tolling concept) without repeating the political failure of e-tolls. The R1 trillion infrastructure programme requires SANRAL to maintain and expand the national road network, but its revenue base is structurally challenged.',
  updated_at = NOW()
WHERE id = 81;

-- id=82
UPDATE policy_ideas SET
  description = 'The Railway Safety Regulator (RSR), established under the National Railway Safety Regulator Act (2002), oversees all railway operators across approximately 23,000 km of track—including Transnet Freight Rail, PRASA, and private industrial railways—but is persistently underfunded relative to its mandate. The RSR has fewer than 200 inspectors for the full network. PRASA train collision incidents (Kempton Park 2018, Cape Town 2019) and Transnet locomotive failure patterns highlighted the RSR''s limited investigative capacity. Reform involves increasing the RSR''s budget, granting independent enforcement powers parallel to the NERSA model, and mandating independent accident investigation through an AIIB-style board separate from the RSR itself. Parliamentary Committee on Transport BRRRs noted the RSR cannot effectively enforce compliance against large state operators like Transnet, which has a self-interest in minimising regulatory intervention.',
  updated_at = NOW()
WHERE id = 82;

-- id=83
UPDATE policy_ideas SET
  description = 'South Africa''s minibus taxi industry transports approximately 15 million passengers daily—two-thirds of all public transport users—through 250,000 vehicles operated by 16,000 taxi associations, generating an estimated R90 billion in annual revenue largely outside the formal financial and regulatory system. Taxi formalisation has been attempted through the Taxi Recapitalisation Programme (TRP, 2006), which paid scrapping allowances for old vehicles, and subsequent digitisation proposals, without achieving meaningful formalisation. The current reform agenda focuses on: mandatory electronic payment integration (the Golden Arrow/Dial-A-Ride model for taxi routes), GPS tracking and route permit digital verification through the National Public Transport Regulator, taxi industry association incorporation as Cooperatives or SOC structures (enabling access to SEFA and SITA procurement), and fare regulation within integrated transport frameworks. The R1.8 billion Taxi Relief Fund (COVID-era) demonstrated that direct financial engagement with the industry is possible. The PC on Transport BRRRs flag ongoing taxi violence (linked to route competition) and the absence of meaningful labour protection for taxi drivers as governance failures. Minibus taxi formalisation is a precondition for effective IPTN integration (id=84).',
  updated_at = NOW()
WHERE id = 83;

-- id=84
UPDATE policy_ideas SET
  description = 'South Africa''s Integrated Public Transport Networks (IPTNs), funded through the Public Transport Network Grant (PTNG), represent the country''s most significant urban mobility investment since apartheid-era planning created spatially fragmented cities. Networks in Johannesburg (Rea Vaya BRT), Cape Town (MyCiTi), George, and Rustenburg are operational; a further 12 cities have approved IPTN plans at various stages of implementation. The policy challenge is integration: BRT trunk lines operate alongside subsidised bus contracts (under the GABS/Autopax frameworks), minibus taxis (the dominant mode serving 65% of users), and Metrorail (PRASA). A unified traveller (smart card) payment system, operational real-time information, and coordinated scheduling remain aspirational rather than operational in most cities. The PTNG allocation for 2025/26 is R11.6 billion, but per-km costs of BRT construction in SA (R70–120 million/km) are among the highest globally. The Minibus Taxi Formalisation (id=83) and PRASA recovery (id=76) are necessary co-investments.',
  updated_at = NOW()
WHERE id = 84;

-- id=85
UPDATE policy_ideas SET
  description = 'South Africa''s 3,900 km coastline, two major ocean trade routes, and five commercial ports give it strategic maritime importance, yet the merchant shipping and maritime industry remains underdeveloped. South Africa has no meaningful cabotage policy, limited maritime training capacity through SAMSA''s SA Maritime Training Academy, and few SA-flagged vessels. Operation Phakisa''s Oceans Economy roadmap and the 2050 Maritime Industry Master Plan identified merchant shipping development as a priority. Reform includes a cabotage policy for coastal trade (reserving coastal cargo for SA-flagged vessels), SAMSA Act amendment to strengthen port state control, and expansion of the Simon''s Town and Durban maritime clusters. Parliamentary Committee on Transport BRRRs noted SAMSA''s budget is insufficient to enforce port state control effectively, undermining safety and competitive standards at SA ports.',
  updated_at = NOW()
WHERE id = 85;

-- id=86
UPDATE policy_ideas SET
  description = 'The Basic Education Laws Amendment (BELA) Act, signed by President Ramaphosa in September 2024 after a decade of parliamentary contestation, introduces three significant changes to the Schools Act (1996): it transfers admissions and language policy decision-making from school governing bodies (SGBs) to provincial education departments (PEDs), making Grade R (pre-Grade 1) compulsory, and expands home education regulations. The admissions and language provisions are the most contested: DA-governed Western Cape and Afrikaans community organisations challenged the Act in the Constitutional Court, arguing that SGB autonomy on language of instruction is constitutionally protected under the right to education in one''s language of choice. Implementation involves: provincial regulatory frameworks for admissions under the new Sections 5A and 6A, a national Grade R expansion plan (additional classrooms and teachers required), and a revised home education regulatory framework. The DBE estimates compulsory Grade R requires an additional 12,000 classrooms and 18,000 teachers nationally. The PC on Basic Education BRRRs 2022–2024 track BELA''s Parliamentary progress and flag the Grade R infrastructure deficit as the binding constraint on compulsory Grade R roll-out.',
  updated_at = NOW()
WHERE id = 86;

-- id=87
UPDATE policy_ideas SET
  description = 'The Constitutional Court-ordered function shift of Early Childhood Development (ECD) from the Department of Social Development (DSD) to the Department of Basic Education (DBE) was completed in 2022, transferring responsibility for approximately 50,000 registered ECD centres serving 1.2 million children under age 6. The function shift transferred R2.5 billion in conditional grants (the ECD Conditional Grant) and the national ECD registration and standards framework. However, the shift has exposed major implementation challenges: an estimated 30,000 of SA''s ECD centres operate below norms and standards (inadequate facilities, unqualified practitioners), the DBE lacks the provincial infrastructure to inspect and support community-based ECD centres that previously fell under DSD social welfare frameworks, and the ECD practitioner qualification and salary question remains unresolved (ECD practitioners earn R2,000–3,500 per month, below any comparable education employee). The National Early Childhood Development Policy (2015) and the ECD Action Plan (2022–2025) provide the strategic framework. The BRRR synthesis from the PC on Basic Education flags ECD centre compliance as the top implementation risk.',
  updated_at = NOW()
WHERE id = 87;

-- id=89
UPDATE policy_ideas SET
  description = 'South Africa produced only 9,000 mathematics pass rates above 60% at Grade 12 level in 2023—an inadequate pipeline for a technology and engineering-dependent economy. The STEM teacher crisis has two dimensions: a quantity deficit (an estimated 15,000 unfilled posts in mathematics and science across public schools) and a quality deficit (many acting mathematics teachers lack subject-matter competency, particularly in rural and township schools). The STEM Teacher Development and Retention Programme proposes: bursary-for-service agreements that fund mathematics and science teacher training in exchange for 5-year deployments to high-need schools, a STEM teacher salary premium (above the ELRC collective agreement baseline) for certified specialists, revitalised subject adviser networks in districts, and partnerships with universities offering secondary mathematics teacher qualifications. The National Education Collaboration Trust (NECT) and teacher training institutions (WITSEd, STADIO) provide existing delivery platforms. Cost estimate: R2.5 billion over 5 years for 5,000 additional qualified STEM teachers.',
  updated_at = NOW()
WHERE id = 89;

-- id=90
UPDATE policy_ideas SET
  description = 'The Accelerated Schools Infrastructure Delivery Initiative (ASIDI), launched in 2011 under the Artisan Development Programme and managed by the DBE through the Education Infrastructure Grant (EIG), was designed to replace all schools built from inappropriate materials (mud, asbestos, wood) and to address the most critical backlogs in sanitation, water, and electricity provision. As of 2024, approximately 800 inappropriate structures remain across Eastern Cape, KwaZulu-Natal, and Limpopo—down from an original list of 3,116—despite R5.6 billion in EIG allocations since 2011. The slow progress (averaging 150–200 schools replaced per year) reflects: procurement failures within provincial education departments, disputes over school sites (particularly in rural areas with traditional authority land), the community disruption of school relocation during construction, and contractor performance failures. The reform proposes: direct DBE management of remaining ASIDI schools (bypassing under-performing provincial implementing agents), a dedicated contractor performance management unit, and an accelerated 3-year completion target. The PC on Basic Education''s BRRRs 2020–2024 document annual slippage on ASIDI targets despite available budget.',
  updated_at = NOW()
WHERE id = 90;

-- id=91
UPDATE policy_ideas SET
  description = 'The National School Nutrition Programme (NSNP) feeds approximately 9 million learners at nearly 20,000 primary and secondary schools daily, representing a R9.8 billion annual budget that is one of South Africa''s most effective social protection programmes: attendance research shows NSNP participation increases school attendance by 8–12% and measurably improves learning outcomes, particularly in the Foundation Phase. However, NSNP procurement—controlled by Provincial Education Departments (PEDs) through conditional grants—is among the most fraud-prone in government: the Auditor-General''s 2023 report found irregular expenditure exceeding R1.5 billion across three provinces, including ghost schools, inflated food prices, and payments to non-compliant service providers. The procurement reform proposes: centralised NSNP food category price benchmarking by National Treasury, mandatory use of the CSD (Central Supplier Database) with a nutrition-focused supplier filter, co-location of NSNP procurement with DAFF''s agri-processing supplier development programme to source from small-scale farmers, and SASSA cross-verification to exclude schools with inflated learner numbers. The BRRR synthesis identifies NSNP fraud as fiscally recoverable (savings of R600 million–R1 billion annually).',
  updated_at = NOW()
WHERE id = 91;

-- id=92
UPDATE policy_ideas SET
  description = 'South Africa''s constitution recognises 11 official languages, yet most public schools transition to English or Afrikaans as the language of instruction by Grade 4, despite robust international evidence that children learn to read and comprehend most effectively in their mother tongue. The DBE''s Language in Education Policy (LiEP, 1997) mandates mother-tongue-based multilingual education (MTBMLE) in the Foundation Phase but implementation has been inconsistent, particularly in Nguni and Sotho language groups. Scaling up MTBMLE requires qualified teachers in all official languages at Foundation Phase level, graded reader materials in all 11 languages, and provincial language policy enforcement mechanisms. South Africa''s PIRLS 2021 last-place ranking among 57 countries is directly linked to inadequate mother-tongue literacy instruction.',
  updated_at = NOW()
WHERE id = 92;

-- id=93
UPDATE policy_ideas SET
  description = 'Approximately 5-7 million South African learners travel more than 5 km to their nearest school, yet the country lacks a nationally funded, consistently implemented learner transport programme. The DBE''s Learner Transport Policy (2015) provides a framework but funding is a provincial competence, resulting in wide inter-provincial variation: some provinces provide subsidies while others provide none. Irregular or absent transport contributes to absenteeism, dropout, and gender-based safety risks for girls. The PC on Basic Education''s BRRRs consistently flagged learner transport as a critical equity gap, particularly in rural Eastern Cape, Limpopo, and KwaZulu-Natal. A national conditional grant with standardised norms and minimum service standards is the proposed reform.',
  updated_at = NOW()
WHERE id = 93;

-- id=94
UPDATE policy_ideas SET
  description = 'South Africa''s Education White Paper 6 (2001) committed to a full-service inclusive education system, but implementation has lagged severely. There are approximately 460 special schools nationally serving children with moderate-to-severe barriers to learning, but these schools are overcrowded and under-resourced. The DBE''s plan to convert 30% of ordinary schools to ''full-service schools'' — equipped to accommodate learners with mild-to-moderate barriers to learning — has stalled at under 10% national conversion. Key gaps include shortage of specialised educators, lack of assistive devices and accessible infrastructure, and inadequate inter-departmental coordination with the Department of Social Development. Amendments to the South African Schools Act to mandate reasonable accommodation are under consideration.',
  updated_at = NOW()
WHERE id = 94;

-- id=95
UPDATE policy_ideas SET
  description = 'South Africa has approximately 2,700 micro-schools with fewer than 100 learners each, predominantly in rural areas with declining populations. These schools often cannot offer Grades 10-12 subjects, lack functioning laboratories or libraries, and struggle to attract qualified teachers. The DBE''s rationalisation policy — providing financial incentives and transport subsidies for consolidating learners into better-resourced nearby schools — has been politically contentious as communities resist closures. National Treasury''s MTEF baseline reviews have repeatedly identified micro-school rationalisation as a fiscal efficiency opportunity, and evidence on learning outcomes in micro-schools versus consolidated institutions has renewed interest in voluntary consolidation paired with guaranteed learner transport.',
  updated_at = NOW()
WHERE id = 95;

-- id=96
UPDATE policy_ideas SET
  description = 'The Property Management Trading Entity (PMTE) within DPWI manages approximately 83,000 immovable state assets valued at over R100 billion, including offices, warehouses, police stations, courts, and vacant land, yet operates at a chronic deficit because large portions of the portfolio are underutilised, poorly maintained, or yield below-market rentals from user departments. National Treasury spending reviews have identified the PMTE portfolio as a significant unrealised fiscal asset. Key reforms under review include disposing of non-strategic assets, commercialising well-located land parcels for affordable housing, enforcing accurate user department lease payments, and implementing a government-wide facilities management system. The AGSA has persistently flagged irregular expenditure, incomplete asset registers, and audit backlogs in the PMTE as governance concerns.',
  updated_at = NOW()
WHERE id = 96;

-- id=97
UPDATE policy_ideas SET
  description = 'The Department of Public Works and Infrastructure (DPWI) has received qualified or adverse audit opinions from the AGSA for multiple consecutive years, reflecting systemic failures in financial management, procurement, and consequence management. The department manages over R100 billion in infrastructure programmes — including EPWP, capital works, and government leases — yet has struggled to maintain accurate asset registers, resolve irregular expenditure findings, and take disciplinary action against officials implicated in procurement irregularities. DPWI''s enterprise renewal programme — covering BAS and LOGIS financial system implementation and supply chain management overhaul — is under review by SCOPA. Active referrals to the SIU where criminality is suspected are central to the consequence management component.',
  updated_at = NOW()
WHERE id = 97;

-- id=98
UPDATE policy_ideas SET
  description = 'The Expanded Public Works Programme (EPWP) has created over 14 million work opportunities since 2004, primarily in labour-intensive construction, environmental care, and social sector activities, but has been criticised for offering short-term, low-wage employment with minimal skills transfer and for susceptibility to political patronage at municipal level. Reform proposals include linking EPWP participation to formal artisan training under TVET college or SETA frameworks, establishing minimum training hours and certification requirements per project, and shifting the programme toward infrastructure maintenance where community-based workers can develop durable skills. The PC on Public Works'' BRRRs flag inconsistent reporting and absence of post-EPWP employment outcome data as persistent governance gaps.',
  updated_at = NOW()
WHERE id = 98;

-- id=99
UPDATE policy_ideas SET
  description = 'The Infrastructure Delivery Management System (IDMS), developed by National Treasury in partnership with DPWI, provides a standardised framework for managing government construction projects from inception to close-out. Despite being policy-mandated since 2015, IDMS adoption across national and provincial departments remains below 40%, contributing to the chronic project delays, cost overruns, and maintenance failures documented in parliamentary oversight. This reform requires: mandatory IDMS use for all projects above R30 million, a dedicated pool of registered professional project managers (PMs) deployed through DPWI''s Property Management Trading Entity (PMTE), digital project dashboards visible to parliamentary oversight committees, and consequence management for officials who bypass IDMS controls. The BRRR synthesis identified infrastructure project under-expenditure—returning R5–8 billion in capital budgets annually due to planning failures—as a fiscally neutral reform opportunity: better execution of existing budgets rather than more funding. CIDB (Construction Industry Development Board) registration requirements for implementing agents are the enforcement mechanism.',
  updated_at = NOW()
WHERE id = 99;

-- id=100
UPDATE policy_ideas SET
  description = 'South Africa''s public infrastructure — schools, hospitals, courts, police stations, and government offices — suffers chronic underfunding of maintenance estimated by DPWI at R1 billion annually in deferred costs. When capital budgets are under pressure, departments routinely cut maintenance first, accelerating deterioration of state assets. National Treasury and DPWI are developing a Maintenance Delivery Improvement Programme that would ring-fence a minimum maintenance allocation (proposed at 1-1.5% of asset replacement value per year) in departmental budgets, enforce it through conditional grant conditions, and track compliance through infrastructure condition indices. The Government Immovable Asset Management Act (GIAMA) provides the statutory basis for asset condition reporting but enforcement has been weak.',
  updated_at = NOW()
WHERE id = 100;

-- id=101
UPDATE policy_ideas SET
  description = 'National Treasury''s PPP Unit administers South Africa''s public-private partnership framework under Treasury Regulation 16, which requires extensive feasibility studies, value-for-money assessments, and multi-stage National Treasury approval. While this oversight protects public finances, the process has been criticised as too slow and costly — particularly for smaller social infrastructure PPPs covering schools, health centres, and correctional facilities — with fewer than 40 PPP agreements reaching financial close since 2000. DPWI and National Treasury are reviewing streamlined approval pathways for social infrastructure PPPs below a defined threshold, an off-balance-sheet framework for municipal-level PPPs, and better alignment with the Infrastructure Fund''s blended finance model established in 2020.',
  updated_at = NOW()
WHERE id = 101;

-- id=102
UPDATE policy_ideas SET
  description = 'The South African government owns or leases approximately 83,000 properties through the PMTE, representing one of the country''s largest institutional electricity consumers, with energy costs estimated at R4-6 billion annually. Mandatory green building standards for new government construction and major refurbishments — aligned with the Green Star SA rating system administered by the Green Building Council of South Africa (GBCSA) — would reduce state energy costs, signal market leadership, and deliver co-benefits in water efficiency and occupant health. DPWI''s Green Building Framework (2022) sets aspirational targets but lacks binding standards or enforcement mechanisms. A Ministerial Determination under the Government Immovable Asset Management Act (GIAMA) could make Green Star compliance mandatory for all new government buildings above a defined cost threshold.',
  updated_at = NOW()
WHERE id = 102;

COMMIT;