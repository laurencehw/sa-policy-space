-- ============================================================
-- Migration 007b: Remaining policy idea descriptions
-- Batch B: 25 ideas (IDs 30-72)
-- Part of a 100-idea update covering all ideas without
-- formal migration descriptions (all except 003/006 coverage)
-- Generated: 2026-03-24
-- ============================================================

BEGIN;

-- id=30
UPDATE policy_ideas SET
  description = 'The Municipal Fiscal Powers and Functions Amendment Bill (MFPFA), tabled in Parliament in 2024 and endorsed by both the National Treasury and the PC on Finance BRRRs, proposes to standardise the regulation of development charges—fees levied by municipalities on new property developments to recover the cost of bulk infrastructure connections (water, sewer, roads, electricity). Currently, development charge methodology varies enormously across municipalities: some municipalities charge developers nothing and cross-subsidise from rates; others levy charges that bear no relationship to actual infrastructure cost. The Bill introduces a national framework for development charge calculation (based on actual bulk infrastructure cost per connection), removes discretionary waiver powers that have been captured by politically connected developers, and requires municipalities to maintain a development charge reserve fund for bulk infrastructure investment. The PC on Finance BRRRs 2020–2023 repeatedly flag under-charging of development charges as a major cause of municipal infrastructure deficits—well-located urban land development subsidised by the rates base undermines municipal financial sustainability.',
  updated_at = NOW()
WHERE id = 30;

-- id=31
UPDATE policy_ideas SET
  description = 'South Africa''s Cooperative Banks Development Agency (CBDA), established under the Cooperative Banks Act (2007), oversees approximately 40 registered cooperative financial institutions (CFIs) with combined assets under R500 million — tiny relative to the formal banking sector. The reform agenda seeks to grow CFIs in township and rural areas to provide affordable savings, credit, and payment services to the unbanked. Proposals include: an amended Cooperative Banks Act to create a tiered licensing framework with lower capital thresholds for community-level savings groups; SARB supervisory ring-fencing for CFIs below R50 million in assets; blended finance first-loss facilities through the IDC; and integration with the Post Bank''s township payments infrastructure. The FSD Africa and UNCDF have co-funded pilot CFI capacity programmes in KZN and Gauteng townships.',
  updated_at = NOW()
WHERE id = 31;

-- id=33
UPDATE policy_ideas SET
  description = 'The Financial Matters Amendment Act and the Insurance Act (18 of 2017) created a dedicated microinsurance licence category to serve low-income households with simple, affordable products (funeral cover, crop insurance, household contents). The FSCA oversees approximately 12 licensed microinsurers and hundreds of cell captive arrangements. The reform agenda addresses: persistently high expense ratios (>60%) in the microinsurance market; exclusionary fine print in funeral policies; integration with SASSA grant payment infrastructure for premium deduction; and the extension of microinsurance to parametric agricultural products for smallholders. The PC on Finance has raised concerns about the Policyholder Protection Rules (PPR) enforcement and debit order abuse targeting grant recipients. Twin Peaks regulation gives both the Prudential Authority (SARB) and FSCA oversight roles.',
  updated_at = NOW()
WHERE id = 33;

-- id=34
UPDATE policy_ideas SET
  description = 'South Africa''s system of intergovernmental fiscal transfers—governed by the Division of Revenue Act (DoRA), the Intergovernmental Fiscal Relations Act (1997), and the equitable share formula—distributes approximately R900 billion annually between national, provincial, and local government. The equitable share formula for provinces (the largest transfer, R850 billion in 2025/26) has not been fundamentally revised since 2002, and its components—education (weighted by learner numbers), health (weighted by population and poverty), and basic services—no longer align with provincial fiscal needs or service delivery capacity. Key reform proposals from the FFC (Financial and Fiscal Commission): revising the health component to align with actual provincial disease burden (KZN and EC are undercompensated relative to their TB/HIV burden), introducing a conditional infrastructure maintenance grant (ring-fenced from the provincial equitable share to prevent maintenance budget raiding), and strengthening the local government equitable share to reflect the growing service delivery obligations of municipalities. The MTBPS 2025 commits to a comprehensive equitable share formula review to be completed by the 2026 Budget.',
  updated_at = NOW()
WHERE id = 34;

-- id=37
UPDATE policy_ideas SET
  description = 'South Africa''s Integrated Resource Plan (IRP 2023/24) includes 2,500 MW of new nuclear capacity as part of the baseload mix, a policy direction endorsed by Cabinet in 2024 following two decades of contested proposals (the Zuma-era R1 trillion nuclear deal collapsed in 2017 after court rulings and public outcry). The current programme, led by DMRE in consultation with the National Nuclear Energy Executive Coordination Committee (NNEECC), envisages a competitive procurement process for small modular reactors (SMRs) or conventional light-water reactors at sites including Thyspunt (Eastern Cape) and Bantamsklip. The MTBPS 2025 does not allocate direct capital but notes the programme is to be financed through the Eskom balance sheet or a dedicated project vehicle with an independent power producer (IPP) structure. International technology suppliers (Westinghouse, EDF, Rosatom, CGNPC, NuScale, Holtec) have all engaged with the DMRE process. The NNR capacity constraints for new-build oversight (id=48) are the regulatory bottleneck. A government financial guarantee of R100–200 billion would be required for any conventional new-build under current debt structures.',
  updated_at = NOW()
WHERE id = 37;

-- id=40
UPDATE policy_ideas SET
  description = 'The National Energy Regulator of South Africa (NERSA) is constituted as an independent regulator under the National Energy Regulator Act (2004), with jurisdiction over electricity, piped gas, and petroleum pipelines. However, NERSA''s effective independence has been repeatedly questioned: tariff decisions are contested by Eskom and municipalities through courts and political processes, NERSA''s budget is approved through the National Assembly (creating political exposure), and its regulatory methodology for the electricity sector has not been updated to handle a competitive multi-generator market. The ERA Amendment Act (2024) dramatically expands NERSA''s mandate—it must now regulate third-party grid access, license dozens of new generators, and oversee the emerging wholesale electricity market—without a commensurate increase in regulatory staff or funding. The reform proposes: full budget autonomy (funded through licensee fees, not Parliament), a dedicated market regulation division for competitive electricity markets, and independent judicial appointment of NERSA commissioners (removing ministerial discretion). The World Bank and International Energy Agency have both flagged regulatory independence as a key risk to SA''s energy transition credibility.',
  updated_at = NOW()
WHERE id = 40;

-- id=41
UPDATE policy_ideas SET
  description = 'Solar water heaters (SWH) reduce household electricity consumption by 30–40% by substituting electric geysers — one of the largest residential electricity loads. The DMRE''s Solar Water Heater Programme (SWHP) has been running in various forms since 2008, targeting 1 million installations but achieving far fewer due to supply chain, installation quality, and financing constraints. The updated programme model uses an ESCO (Energy Services Company) delivery mechanism with a monthly service fee replacing upfront capital cost. Municipalities and utilities procure installations via competitive tender; Eskom rebates provide fiscal support. The programme targets low-income households (subsidised) and middle-income households (financed). SABS accreditation standards for imported Chinese SWH units address quality failures that plagued earlier rounds. Potential to reduce residential peak demand by 400–600 MW at scale.',
  updated_at = NOW()
WHERE id = 41;

-- id=44
UPDATE policy_ideas SET
  description = 'The Upstream Petroleum Resources Development Act, assented to by President Ramaphosa in November 2024, ends the decades-long legal ambiguity that governed petroleum exploration under the Mineral and Petroleum Resources Development Act (MPRDA). The Act separates the petroleum regime from mining, establishing a dedicated framework administered by the South African Agency for Promotion of Petroleum Exploration and Exploitation (SAAPEE). Key provisions include a 20% free-carry state participation right for PETROSA (the state oil company, formerly PetroSA) and mandatory black persons'' equity participation in exploration and production rights, modelled on the mining sector''s black economic empowerment requirements. The Act covers reconnaissance permits, exploration rights, production rights, and retention permits, providing greater regulatory certainty for international exploration companies. The timing is significant: TotalEnergies, Shell, and other majors have been exploring in the Orange Basin off the Southern African coast, with the Brulpadda and Luiperd fields (operated by TotalEnergies) representing potential multi-billion barrel reserves whose development has been delayed by legislative uncertainty. Gas discoveries in the Karoo and offshore could provide a domestic supply solution to the looming industrial gas shortage.',
  updated_at = NOW()
WHERE id = 44;

-- id=46
UPDATE policy_ideas SET
  description = 'South Africa''s regulated fuel price mechanism, governed by the DMRE, uses a basic fuel price formula based on international benchmarks plus fixed levies and distribution margins. Reform proposals call for partial deregulation of inland retail margins while retaining regulation of the fuel levy and RAF components. The existing single-price model suppresses investment in alternative fuels (LPG, CNG) and new market entrants. The Energy White Paper (2019) and Competition Commission market inquiry (2023) both identified the regulated model as a barrier to efficiency. Parliamentary BRRRs noted the coastal-to-inland cross-subsidy inflates logistics costs for manufacturing and agri-processing. Partial deregulation aligned with the Liquid Fuels Charter is the preferred approach.',
  updated_at = NOW()
WHERE id = 46;

-- id=47
UPDATE policy_ideas SET
  description = 'South Africa has approximately 6,000 derelict and ownerless mines (DOMs) from the gold and coal eras, posing acid mine drainage, sinkhole, and water pollution risks. The DMRE''s DOM Unit faces a rehabilitation backlog requiring an estimated R50 billion. A dedicated fund—capitalised through mining royalty levies, the Mines and Minerals Development Bill, and potential green bond issuance—would address this fiscal liability systematically. Rand Water''s AMD pumping operation costs R2 billion annually, a preventable outlay if upstream rehabilitation proceeds. Parliamentary BRRRs flagged the Western Basin AMD threat to Johannesburg''s water security repeatedly from 2021 to 2024. International models (US Superfund, Canada''s Abandoned Mines programme) inform the fund design.',
  updated_at = NOW()
WHERE id = 47;

-- id=48
UPDATE policy_ideas SET
  description = 'South Africa''s nuclear build programme—Koeberg Unit 3 planning and IRP 2019 allocation of 2,500 MW of new nuclear—requires the National Nuclear Regulator (NNR) to scale technical oversight capacity for construction, not merely operations. Current NNR staffing is calibrated for Koeberg''s existing two units. Cabinet approved the nuclear procurement programme in 2023. Parliamentary Committee on Mineral Resources BRRRs noted the NNR''s budget has not kept pace with the expanded oversight mandate, risking safety gaps. International partnerships with the IAEA and bilateral agreements with France (EDF) and South Korea (KEPCO) are under active negotiation. The reform involves NNR Act amendment, a staffing plan, and budget increase sufficient to hire and retain nuclear engineers.',
  updated_at = NOW()
WHERE id = 48;

-- id=53
UPDATE policy_ideas SET
  description = 'South Africa''s universities and TVET colleges accumulated a qualification certification backlog estimated at 140,000 outstanding certificates as of 2024, with some institutions reporting backlogs extending over five years. Graduates unable to obtain their certificates cannot register with professional bodies (HPCSA, SACAP, ECSA), access formal employment in regulated professions, or demonstrate their qualifications to employers. The backlog arises from: inadequate student records management systems, manual processing of supplementary examination results, incomplete fee payment records blocking certification release, and SAQA registration delays where institutional accreditation is contested. The DBE/DHET digital student records initiative (part of the HEMIS/TVETMIS modernisation programme) is the systemic fix; the immediate relief measure is a one-time backlog clearance programme with dedicated administrative teams, funded through the university administration budget rather than requiring new appropriation. The PC on Higher Education''s BRRR 2023 flagged this as a rights issue: denying graduates their certificates is an infringement of the right to access educational records under PAIA.',
  updated_at = NOW()
WHERE id = 53;

-- id=54
UPDATE policy_ideas SET
  description = 'South Africa''s gross expenditure on research and development (GERD) stands at approximately 0.6% of GDP (2023/24)—well below the National Development Plan''s 1.5% target and the OECD average of 2.7%. Business expenditure on R&D (BERD) is particularly low at 0.3% of GDP, compared to 2.0% in South Korea and 1.2% in Brazil, reflecting limited domestic innovation investment by the private sector and structural dependence on technology licensing from multinationals. The R&D Tax Incentive (Section 11D of the Income Tax Act), which provides a 150% deduction for qualifying R&D expenditure, has not achieved the uplift anticipated at its 2012 introduction: fewer than 200 companies claim the incentive annually, constrained by the narrow definition of qualifying R&D and the complex approval process administered by DSIT. The STI Decadal Plan (id=69) sets a credible path to 1% of GDP by 2027 and 1.5% by 2032. Reforms proposed: broadening the Section 11D definition to include market validation and design activities, creating an R&D voucher scheme for SMMEs (complementing the Innovation Fund, id=68), and establishing a government R&D procurement programme that counts as public GERD. The PC on Science BRRRs note DSIT''s own budget declining in real terms, the opposite of what the Decadal Plan requires.',
  updated_at = NOW()
WHERE id = 54;

-- id=55
UPDATE policy_ideas SET
  description = 'The National Student Financial Aid Scheme''s administration collapse became a national crisis between 2021 and 2024: delayed allowance payments left students unable to pay rent or buy food; a R2.1 billion irregular expenditure finding by the Auditor-General revealed procurement failures in the student accommodation and allowance payment systems; and a Special Investigating Unit (SIU) probe uncovered fraudulent registrations by students, ghost students, and institutions claiming NSFAS funding for enrolled students who had dropped out or never attended. The administration overhaul reform covers: replacing the current bursary management system with an integrated student information system linked to HEMIS and institutional student records, implementing biometric verification for allowance collection, establishing an NSFAS fraud investigative unit within the SIU, and restructuring the NSFAS board and executive management. The MTBPS 2025 notes NSFAS as a fiscal risk entity with qualified audit opinions in three consecutive years. The PC on Higher Education BRRRs 2022–2024 contain over 40 specific recommendations on NSFAS governance that remain partially implemented.',
  updated_at = NOW()
WHERE id = 55;

-- id=56
UPDATE policy_ideas SET
  description = 'South Africa''s Community Education and Training (CET) colleges provide second-chance education for an estimated 3.5 million adults without matric, but enrolments remain under 300,000—far below potential demand. The Second Chance Matric Programme (2017) offers supplementary exams and distance learning for those who failed. The PSET White Paper (2013) envisioned CET as the foundation of a mass adult education system; implementation has been partial. Both programmes are severely underfunded: CET colleges lack infrastructure, qualified educators, and curriculum links to TVET progression pathways. Parliamentary BRRRs noted the absence of articulation between CET, TVET, and university programmes means second-chance learners face dead-end qualifications. Reform requires CET Act amendment, funding model revision, and SAQA articulation framework updates.',
  updated_at = NOW()
WHERE id = 56;

-- id=60
UPDATE policy_ideas SET
  description = 'South Africa''s State-Owned Enterprises operate under a regulatory environment—the Public Finance Management Act (PFMA), BBBEE procurement requirements, the National Treasury Regulations, and Ministerial directives—that creates structural impediments to operational efficiency and private participation. Specific reform targets include: revising Section 54 of the PFMA to reduce ministerial pre-approval requirements for commercial transactions (which delays Eskom, Transnet, and other SOE deals by months), clarifying BBBEE scorecard treatment for SOE-private joint ventures (a barrier to private sector participation in Transnet and PRASA concessions), and harmonising the Public Procurement Act (2023) with SOE-specific procurement needs. The Presidential SOE Council, chaired by the President, coordinates governance reform across the 10 major commercial SOEs. The MTBPS 2025 notes that SOE transfer payments have declined from R40 billion to R28 billion annually as restructuring conditions tighten. The textbook (Chapter 3) identifies the statutory board model (Singapore''s statutory authorities) as the structural reform that could fundamentally change SOE governance dynamics.',
  updated_at = NOW()
WHERE id = 60;

-- id=63
UPDATE policy_ideas SET
  description = 'Denel, South Africa''s state-owned defence and aerospace company, entered a severe financial crisis between 2016 and 2022, driven by state capture-era contract irregularities, mismanagement, and the collapse of orders from state clients and export markets. At peak distress (2021), Denel could not pay salaries for 4,000 employees, defaulted on government-guaranteed bonds, and saw its engineering talent exodus to private sector and foreign defence contractors. The Strategic Equity Partner (SEP) process, initiated in 2023, seeks private investment in Denel''s viable business units (Dynamics: missiles and drones; Optronics: electro-optical systems; LMT: ammunition) while potentially closing or merging unviable units (Aeronautics: no domestic aircraft programme). The MTBPS 2025 allocates R3.4 billion to Denel over the medium term, conditional on the SEP process completion. National security considerations (ITAR restrictions on technology transfer, SA defence industrial sovereignty) complicate any foreign investor acquisition. The PC on Public Enterprises BRRRs 2020–2024 document Denel''s complete institutional collapse and the risk to SANDF procurement capacity if Denel''s strategic capabilities are lost.',
  updated_at = NOW()
WHERE id = 63;

-- id=64
UPDATE policy_ideas SET
  description = 'Alexkor, the state diamond mining company at Alexander Bay, has been entangled in the Richtersveld land restitution claim since 1999. A 2003 Constitutional Court ruling granted the Richtersveld community surface and mineral rights, but the 49% equity settlement has been improperly implemented as Alexkor''s diamond operations collapsed and community trust benefits remain minimal. Safcol (South African Forestry Company) faces restitution claims over commercial forests in Limpopo, Mpumalanga, and KwaZulu-Natal. Both cases represent failure to implement legally settled land claims through workable business models. The reform requires restructuring the Alexkor joint venture, resolving governance between the community trust and mining entity, and processing Safcol community equity models. Parliamentary Committee on Public Enterprises BRRRs flagged both as fiscal risks with governance vacuums.',
  updated_at = NOW()
WHERE id = 64;

-- id=65
UPDATE policy_ideas SET
  description = 'South African Airways, placed into business rescue in December 2019 after accumulating R49 billion in government guarantees and requiring R32 billion in direct bailouts since 2014, resumed operations in September 2021 through a business rescue plan that gave Takatso Consortium a 51% stake. However, the Takatso deal collapsed in 2023 after disagreements over government guarantees, leaving the successor SAA as a wholly state-owned entity again, operating with a R3.5 billion government equity injection and a narrow profitable route network (primarily regional African routes and the Johannesburg–London corridor). The reform agenda requires: concluding an alternative strategic equity partner process (international airline or private equity), reducing the route network to commercially viable core routes, severing all remaining government guarantee obligations so that SAA does not become a contingent liability in future, and developing a clear endpoint for the state''s equity position. The MTBPS 2025 does not allocate further SAA capital, effectively requiring commercial viability or wind-down. The PC on Public Enterprises BRRRs consistently recommend zero further transfers to SAA absent a credible commercial plan.',
  updated_at = NOW()
WHERE id = 65;

-- id=66
UPDATE policy_ideas SET
  description = 'The Technology Innovation Agency (TIA), established under the DSI in 2008, provides bridge funding between academic research and commercial scale-up with an annual budget of approximately R900 million. TIA has supported over 200 companies, but its commercialisation success rate—measured by IP licences, spinouts reaching revenue, and jobs created—is below international benchmarks. Reform involves restructuring TIA''s mandate to focus on fewer, larger bets aligned with DSI''s priority sectors (green hydrogen, mining automation, health biotech), introducing co-investment requirements from industry and VC co-investors, and improving portfolio monitoring. Parliamentary Committee on Science and Innovation BRRRs noted TIA''s administrative overhead absorbs 25–30% of budget and that portfolio attrition rates are high relative to comparators like Israel''s BIRD Foundation.',
  updated_at = NOW()
WHERE id = 66;

-- id=67
UPDATE policy_ideas SET
  description = 'The IPR-PFRD Act (2008), modelled on the US Bayh-Dole Act, governs how IP developed from public R&D funding is commercialised. The National Intellectual Property Management Office (NIPMO) within DSI implements the Act but has been underfunded and understaffed. Key obstacles are mandatory government march-in rights provisions deterring private co-investors, complex disclosure timelines (36 months), and NIPMO''s limited capacity for international patent applications. Reform proposals include streamlining the commercialisation timeline to 12 months, removing automatic government retention for non-national-security IP, and co-funding international patent filing through the NRF''s IP Fund. A NIPMO Amendment Bill was introduced in Parliament in 2023 but not passed. Industry support for reform is strong; government march-in rights are the political sticking point.',
  updated_at = NOW()
WHERE id = 67;

-- id=68
UPDATE policy_ideas SET
  description = 'The South African Innovation Fund (IF), established by the DSIT in 2019 as a blended finance vehicle to commercialise university and CSIR research, completed its pilot phase (R1.4 billion committed to 42 portfolio companies) in 2023. Scale-up to R5 billion by 2027—as recommended by the PC on Science and Technology BRRR 2024—requires: a permanent legislative mandate (the IF currently operates under a company structure rather than a statutory framework), co-investment from the PIC and IDC, stronger deal pipeline from universities (through the Technology Transfer Office network), and a dedicated growth-stage fund for companies that have outgrown the IF''s early-stage focus but are too small for IDC commercial finance. The DSIT''s STI Decadal Plan 2022–2032 (id=69) sets a 1.5% of GDP R&D target, and the Innovation Fund is the vehicle for translating public R&D expenditure into commercial outcomes. South Africa currently commercialises less than 4% of university patents—the OECD average is 18%.',
  updated_at = NOW()
WHERE id = 68;

-- id=69
UPDATE policy_ideas SET
  description = 'South Africa''s STI Decadal Plan, gazetted in 2022, sets 10-year targets across eight priority areas: space, the ocean economy, advanced manufacturing, agriculture, human health, energy, ICT, and mining. The Plan is the most ambitious STI policy framework since the 1996 White Paper. However, it remains largely unfunded: the MTBPS 2025 did not allocate the estimated R50 billion required for full implementation, and DSI''s budget has declined in real terms. Parliamentary Committee on Science and Innovation BRRRs noted the disconnect between the Decadal Plan''s ambition and DSI''s appropriation trajectory. The reform converts the Decadal Plan into a funded mandate through multi-year appropriations, EU Horizon association co-funding, AfDB grants, and revised CSIR/NRF mandates explicitly aligned to Decadal Plan priorities.',
  updated_at = NOW()
WHERE id = 69;

-- id=71
UPDATE policy_ideas SET
  description = 'The CSIR, South Africa''s primary applied research institution with 3,000+ researchers and R3.5 billion in annual revenue, is proposed as the anchor institution for a 10-year foundational digital capabilities programme covering AI model development, cybersecurity, quantum computing, and advanced semiconductor design. The programme mirrors Singapore''s A*STAR and Germany''s Fraunhofer Society, where public research institutes provide industry-connective tissue for digital transformation. The Presidential Commission on the Fourth Industrial Revolution (2019) and DSI''s 4IR Initiative both identified CSIR as the natural lead. Parliamentary Committee on Science and Innovation BRRRs noted CSIR''s external industry revenue has increased but foundational R&D is crowded out by short-term commercialisation pressure, eroding the long-term research pipeline.',
  updated_at = NOW()
WHERE id = 71;

-- id=72
UPDATE policy_ideas SET
  description = 'The NRF funds approximately 30,000 postgraduate students annually but bursary values of R80,000–R120,000 for doctoral students in 2024 are insufficient for urban cost of living and uncompetitive with international programmes, contributing to brain drain. Reform proposals include doubling doctoral bursary values to R180,000–R250,000, introducing industry co-funding requirements for applied research areas (mining, fintech, agri-tech), and linking bursary allocations to DSI Decadal Plan priorities. The NRF Amendment Act (2019) created the framework for industry partnerships; implementation has been partial. Parliamentary Committee on Science BRRRs noted South Africa''s PhD production rate of 45 per million population is below the AU target of 100 per million by 2025, with bursary inadequacy as a cited cause of slow growth.',
  updated_at = NOW()
WHERE id = 72;

COMMIT;