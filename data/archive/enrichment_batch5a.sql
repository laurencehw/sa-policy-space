-- ============================================================
-- Enrichment Batch 5a: 30 policy ideas
-- IDs: 1,2,5,10,11,12,13,14,15,16,17,18,19,22,26,27,28,29,30,31,33,34,36,37,38,39,40,41,43,44
-- Generated: 2026-03-23
-- ============================================================

-- id=1: Copyright Amendment Bill — Fair Use and Digital Access Reform
UPDATE policy_ideas SET
  description = 'The Copyright Amendment Bill introduces a fair use exception modelled on US doctrine, replacing SA''s narrow fair dealing provisions in the Copyright Act 98 of 1978. The Bill permits use of copyrighted works for education, research, commentary, and digital access without licensing fees, a change that could dramatically reduce costs for universities, libraries, and e-learning platforms. DALRO and publishers have opposed the Bill, citing revenue loss; accessibility advocates and CODA argue the current regime entrenches information poverty. The Bill was returned by President Ramaphosa in 2020 and 2023 for constitutional revision. A revised version addressing WIPO treaty obligations and the performers'' rights provisions is under preparation by the DTIC. Implementation requires alignment with WIPO Copyright Treaty and WIPO Performances and Phonograms Treaty ratification.',
  key_quote = 'Access to knowledge is not a luxury — the Copyright Amendment Bill is central to building a knowledge economy that includes rather than excludes. — DTIC Portfolio Committee, BRRR 2024',
  responsible_department = 'Department of Trade, Industry and Competition / CIPC',
  feasibility_note = 'Low-medium: Bill twice returned by President; constitutional and WIPO compliance concerns unresolved. Political will exists but legal redrafting is slow. No fiscal cost.',
  updated_at = datetime('now')
WHERE id = 1;

-- id=2: Competition Commission Digital Markets Inquiry
UPDATE policy_ideas SET
  description = 'The Competition Commission''s Digital Markets Inquiry (DMI), launched under Section 43B of the Competition Act, investigates competition dynamics in South Africa''s online intermediation platforms — including e-commerce, app stores, online advertising, and search. The inquiry draws on global precedents (EU Digital Markets Act, CMA pro-competition regime) to assess whether platform gatekeepers engage in self-preferencing, data misuse, or exploitative terms vis-à-vis dependent businesses. The Commission''s Online Intermediation Platforms Market Inquiry (2021–2023) established precedents with Google and Takealot; the expanded DMI deepens this work. Findings could result in imposed interoperability obligations, data portability requirements, or structural remedies. The inquiry feeds into proposed amendments to the Competition Act''s Chapter 3 dominance provisions, with a digital-specific regulatory layer.',
  key_quote = 'Platform gatekeeping is the defining competition challenge of the 2020s — the Commission''s inquiry positions SA ahead of most African regulators. — Competition Commission Annual Report 2024',
  responsible_department = 'Competition Commission / Department of Trade, Industry and Competition',
  feasibility_note = 'High: Commission has clear statutory basis under Competition Act Section 43B. Interim findings binding on firms via consent orders. Legislative amendments may be needed for ex ante obligations.',
  updated_at = datetime('now')
WHERE id = 2;

-- id=5: EV White Paper — Managed Automotive Transition
UPDATE policy_ideas SET
  description = 'The EV White Paper, gazetted by DTIC in 2023, outlines SA''s strategy for transitioning the automotive sector from internal combustion engine (ICE) to electric vehicle production. SA hosts seven OEM assemblers (Toyota, BMW, Ford, Volkswagen, Mercedes-Benz, Isuzu, Nissan) producing ~600,000 vehicles annually for export under the APDP. The White Paper proposes production incentives for EV assembly, localisation requirements for battery components, and a skills transition programme for the ~120,000 direct sector workers. It links to the APDP Phase 2 framework (running to 2035) and the emerging Green Hydrogen Commercialisation Strategy. Key risks include the EU''s CBAM for automotive supply chains and the dominance of Chinese OEMs in the global EV market. The White Paper also calls for public EV charging infrastructure under NERSA oversight.',
  key_quote = 'The automotive sector must be a beachhead for EV industrialisation — missing this window would cost SA its most sophisticated export manufacturing base. — DTIC EV White Paper, 2023',
  responsible_department = 'Department of Trade, Industry and Competition / DMRE / National Treasury',
  feasibility_note = 'Medium: White Paper published; incentive design in progress. EU CBAM timelines create urgency. Union engagement (NUMSA) critical for worker transition provisions.',
  updated_at = datetime('now')
WHERE id = 5;

-- id=10: Poultry Industry Anti-Dumping and Local Production Expansion
UPDATE policy_ideas SET
  description = 'South Africa''s poultry industry — the largest agricultural employer, with ~100,000 direct jobs — faces sustained pressure from dumped imports, primarily cheap chicken portions from the EU (under Economic Partnership Agreements) and from Brazil. ITAC has imposed anti-dumping duties in multiple rounds, but the poultry lobby argues that EPA tariff concessions undermine protection. The reform agenda involves ITAC investigations to maintain and extend definitive anti-dumping measures, renegotiation of EPA poultry schedules with the EU, and DALRRD support for local feed, veterinary, and processing infrastructure. Parliamentary Portfolio Committees on Agriculture and Trade have endorsed the Poultry Sector Master Plan, signed in 2019 and revised in 2022, which sets investment, employment, and localisation targets to 2030. Feed costs (maize, soya) remain a structural vulnerability.',
  key_quote = 'Every tonne of dumped chicken undermines jobs in Limpopo and the Eastern Cape — anti-dumping is not protectionism, it is levelling the playing field. — Agri-SA, PC on Agriculture BRRR 2023',
  responsible_department = 'Department of Trade, Industry and Competition / ITAC / DALRRD',
  feasibility_note = 'Medium: ITAC has anti-dumping powers; EPA renegotiation is diplomatically complex with the EU. Poultry Master Plan provides coordination framework. Fiscally modest.',
  updated_at = datetime('now')
WHERE id = 10;

-- id=11: SMME Regulatory Burden Reduction
UPDATE policy_ideas SET
  description = 'South Africa''s SMME sector — estimated at 2.5 million enterprises providing ~28% of employment — faces disproportionate regulatory compliance costs: business registration, municipal licenses, UIF/PAYE administration, zoning approvals, and SARS obligations. The DSBD''s SMME and Cooperative Development Strategy targets a 50% reduction in compliance costs by 2030. Instruments include the Companies and Intellectual Property Commission (CIPC) online registration system, the SMME Ombud established under the National Small Enterprise Amendment Act (2023), and the Business Licensing Reform streamlining municipal approval processes. The World Bank Doing Business indicators have consistently ranked SA poorly on starting a business and dealing with construction permits. Reforms require co-ordination across national, provincial, and municipal spheres, making implementation uneven.',
  key_quote = 'A street trader spends more time on compliance than on selling — regulatory simplification is the cheapest job-creation policy available. — SMME Ombud Annual Report 2024',
  responsible_department = 'Department of Small Business Development / DTIC / National Treasury / COGTA',
  feasibility_note = 'Medium: SMME Ombud operational; CIPC digitisation advanced. Municipal layer is the bottleneck — COGTA coordination weak. No significant fiscal cost.',
  updated_at = datetime('now')
WHERE id = 11;

-- id=12: Digital Platforms Competition Framework (Buyer Power Regulations)
UPDATE policy_ideas SET
  description = 'Large digital platforms — e-commerce marketplaces, app stores, and online advertising networks — exercise buyer power over dependent suppliers, app developers, and advertisers in ways the current Competition Act does not adequately address. The proposed Digital Platforms Competition Framework would create ex ante obligations for designated gatekeepers: interoperability, data portability, non-discrimination rules, and prohibitions on self-preferencing. It draws on the Competition Commission''s Online Intermediation Platforms inquiry findings (2023) and the EU Digital Markets Act framework. Proposed amendments to the Competition Act would add a new chapter on digital platforms, designate gatekeepers by market capitalisation and user thresholds, and empower the Commission to impose remedies without proving abuse. The reform also intersects with the POPIA data governance framework administered by the Information Regulator.',
  key_quote = 'Platform self-preferencing and data advantages create moats that ordinary competition law cannot breach in real time — ex ante rules are necessary. — Competition Commission DMI Interim Report 2023',
  responsible_department = 'Competition Commission / Department of Trade, Industry and Competition / Information Regulator',
  feasibility_note = 'Medium: Statutory amendment required. Commission has investigative capacity; legislative drafting timeline uncertain. Aligns with global regulatory trend.',
  updated_at = datetime('now')
WHERE id = 12;

-- id=13: National Lotteries Commission Governance Overhaul
UPDATE policy_ideas SET
  description = 'The National Lotteries Commission (NLC) distributes approximately R3 billion annually in grants to NPOs, charities, and arts organisations from lottery proceeds. A series of SIU investigations (2020–2023) found systemic corruption in grant disbursements: inflated invoices, ghost beneficiaries, politically connected intermediaries, and failure to verify project completion. The NLC board was dissolved and reconstituted multiple times. The reform agenda includes amendments to the Lotteries Act to strengthen board independence, mandatory e-procurement for grants, a public grant register, and enhanced AGSA audit powers. The DTIC is the oversight department; the PC on Trade and Industry has called for criminal referrals and asset forfeiture proceedings. Parliamentary hearings in 2023–2024 documented losses of over R500 million in irregular grants.',
  key_quote = 'The NLC has become a patronage machine — lottery funds meant for civil society have been systematically looted while the regulator watched. — PC on Trade and Industry, BRRR 2023',
  responsible_department = 'Department of Trade, Industry and Competition / NLC / SIU',
  feasibility_note = 'Medium: SIU recoveries underway; board reconstituted. Legislative amendments to Lotteries Act require Parliamentary cycle. Political will present but governance culture change slow.',
  updated_at = datetime('now')
WHERE id = 13;

-- id=14: Localisation and Designation Policy for Public Procurement
UPDATE policy_ideas SET
  description = 'The Localisation Policy designates specific product categories for preferential or exclusive procurement from South African manufacturers, using the Preferential Procurement Policy Framework Act (PPPFA) and Public Procurement Act (2024) as vehicles. Designated sectors include textile and clothing, furniture, buses, solar panels, canned vegetables, and steel products. The DTI''s localisation targets aim to raise local content in public procurement from ~30% to ~70% across designated categories by 2030, supporting an estimated 10,000 direct manufacturing jobs per R1 billion in local spend. The policy faces WTO GPA and AGOA compatibility questions; SA is not a GPA signatory, providing flexibility. Implementation bottlenecks include verification of local content claims (SABS testing), capacity of B-BBEE-compliant local suppliers, and municipal compliance with national designation notices.',
  key_quote = 'Designation is the most direct industrial policy tool available — every rand of public procurement is an opportunity to build local productive capacity. — DTIC Localisation Summit 2023',
  responsible_department = 'National Treasury / Department of Trade, Industry and Competition / SABS',
  feasibility_note = 'Medium-high: Public Procurement Act (2024) strengthens framework. Key risk is supply-side capacity and price competitiveness of local producers. WTO risks manageable given SA''s non-GPA status.',
  updated_at = datetime('now')
WHERE id = 14;

-- id=15: BBBEE Equity Equivalent Investment Programme (EEIP) Expansion
UPDATE policy_ideas SET
  description = 'The Equity Equivalent Investment Programme (EEIP) allows multinational companies operating in SA to meet BBBEE ownership requirements through qualifying investments — skills development, supplier development, enterprise support — rather than direct equity transfer to black shareholders. First introduced under the BBBEE Codes of Good Practice in 2017, the EEIP has had limited take-up due to complex approval processes and narrow qualifying investment criteria. The proposed expansion would broaden qualifying investments to include R&D, digital infrastructure, and renewable energy projects in designated townships and rural areas, streamline the DTIC approval pathway, and introduce automatic qualification thresholds. This addresses the concern that multinational disinvestment or HQ relocation is partly driven by BBBEE compliance costs incompatible with group ownership structures.',
  key_quote = 'EEIP expansion is the most practical route to attracting FDI while advancing transformation — equity transfer requirements that trigger disinvestment serve no one. — B-BBEE Commission Annual Report 2023',
  responsible_department = 'Department of Trade, Industry and Competition / B-BBEE Commission',
  feasibility_note = 'Medium-high: Administrative reform; no legislation required. DTIC can amend EEIP guidelines. Stakeholder alignment (BEE lobby, multinationals) is the key political constraint.',
  updated_at = datetime('now')
WHERE id = 15;

-- id=16: 4IR and Digital Skills Pipeline
UPDATE policy_ideas SET
  description = 'South Africa''s Fourth Industrial Revolution (4IR) and Digital Economy Strategy targets the development of 1 million digitally skilled workers by 2030, focusing on coding, data science, AI, cloud computing, and cybersecurity. The strategy is anchored in the SA Digital and Future Skills Strategy (2020) and aligns with SETA reform under the Skills Development Amendment Act. Key institutions include the MICT SETA, merSETA, and the 52 TVET colleges being retooled with ICT labs. The DHET and DSACI co-lead implementation; the Presidential Youth Employment Intervention (PYEI) includes a digital corps component. The Human Resource Development Council coordinates alignment between SETA levies, NSF disbursements, and industry certification frameworks (Microsoft, AWS, Google certifications). Fibre connectivity at schools underpins the pipeline.',
  key_quote = 'A young South African with Python skills and internet access can participate in the global digital economy — our job is to build that pathway at scale. — DSACI 4IR Strategy 2023',
  responsible_department = 'Department of Higher Education and Training / DSACI / DTIC / MICT SETA',
  feasibility_note = 'Medium: Fragmented across multiple departments and SETAs. SETA reform critical for coherent levy deployment. Connectivity infrastructure a prerequisite. Long pipeline — 5–10 year horizon.',
  updated_at = datetime('now')
WHERE id = 16;

-- id=17: Anti-Dumping and Import Surveillance Modernisation
UPDATE policy_ideas SET
  description = 'ITAC (International Trade Administration Commission) is SA''s anti-dumping and trade remedies authority under the International Trade Administration Act. Its capacity to investigate and impose remedies has been criticised as slow (average investigation >18 months vs. WTO 12-month guideline), under-resourced, and vulnerable to legal challenges by foreign exporters. Modernisation proposals include: ITAC budget increase and senior economist recruitment; automated import surveillance using SARS customs data to flag abnormal price and volume trends; accelerated provisional measures for serious injury cases; and harmonisation of SA anti-dumping methodology with SACU partners. Sectors seeking reform include steel, paper and pulp, poultry, textiles, and chemicals. The DTIC oversees ITAC; the PC on Trade has repeatedly raised capacity concerns in BRRRs.',
  key_quote = 'Every month of delay in an anti-dumping investigation is a month of market share lost for domestic producers — ITAC''s capacity gap has real industrial costs. — ITAC Annual Report 2023',
  responsible_department = 'Department of Trade, Industry and Competition / ITAC / SARS',
  feasibility_note = 'Medium-high: Primarily administrative and budgetary. No legislative change required for most reforms. SARS data-sharing agreement needed for surveillance system.',
  updated_at = datetime('now')
WHERE id = 17;

-- id=18: Automotive Production and Development Programme (APDP Phase 2) Enhancement
UPDATE policy_ideas SET
  description = 'The Automotive Production and Development Programme (APDP), running to 2035, provides production incentives (vehicle assembly allowance, component manufacturer support, productive asset allowance) to SA''s seven OEM assemblers and their Tier 1 suppliers. APDP Phase 2 targets production of 1% of global vehicle output (~1 million vehicles/year by 2035) and R200 billion in new investment. Enhancements under discussion include: higher production incentive rates for EVs and hybrid vehicles to align with the EV White Paper; localisation multipliers for battery and electronics components; and an APDP development component to bring Black-owned Tier 2 suppliers into the supply chain. The programme is administered by the DTIC''s Auto Industry desk; National Treasury provides the fiscal framework through the Customs and Excise Act rebate schedule. The sector contributes ~4.9% of GDP and 30% of manufactured exports.',
  key_quote = 'APDP is the backbone of SA''s most successful industrial policy — the Phase 2 enhancements must pull the sector toward the EV future rather than lock it into the ICE past. — NAAMSA Annual Review 2024',
  responsible_department = 'Department of Trade, Industry and Competition / National Treasury / NAAMSA',
  feasibility_note = 'High: Administratively established; APDP is SA''s most mature industrial programme. EV enhancement requires fiscal modelling. OEM buy-in secured through Automotive Masterplan.',
  updated_at = datetime('now')
WHERE id = 18;

-- id=19: BRICS+ Trade Facilitation and Alternative Payment Systems
UPDATE policy_ideas SET
  description = 'Following SA''s BRICS chairmanship (2023) and the Johannesburg Declaration admitting six new BRICS+ members (UAE, Ethiopia, Egypt, Iran, Argentina rescinded, Saudi Arabia), the reform agenda includes expanding bilateral trade settlement in local currencies, exploring the mBridge cross-border CBDC platform, and deepening BRICS New Development Bank (NDB) project finance for SA infrastructure. The SARB has been cautious given secondary sanctions risk from BRICS members under US sanctions. Trade facilitation proposals include: harmonised customs procedures for BRICS+ partners; sector-specific trade agreements with India, China, and the UAE; and SA port designation as the African logistics hub for BRICS+ supply chains. DIRCO leads politically; SARB and National Treasury manage the monetary sovereignty and sanctions compliance dimension.',
  key_quote = 'SA must leverage BRICS+ membership to diversify export markets and reduce dollar dependence — but financial integration must not compromise SWIFT access. — SARB Governor, PC on Finance 2024',
  responsible_department = 'DIRCO / SARB / National Treasury / DTIC',
  feasibility_note = 'Low-medium: Geopolitical complexity high; sanctions risk real. NDB project finance is concrete and actionable. Currency settlement pilots possible but scale limited by rand liquidity.',
  updated_at = datetime('now')
WHERE id = 19;

-- id=22: Two-Pot Pension System — Retirement Savings Architecture Reform
UPDATE policy_ideas SET
  description = 'The Two-Pot Retirement System, implemented on 1 September 2024 under the Revenue Laws Amendment Act (2024), divides pension contributions into a savings pot (one-third of contributions, withdrawable once per tax year) and a retirement pot (two-thirds, preserved until retirement). A vested pot preserves pre-September 2024 accumulations under old rules. The reform addresses the SA-specific problem of high pre-retirement cash-out rates (>90% of members previously withdrew full benefits on resignation), which left most workers with inadequate retirement savings. SARS administers the savings pot withdrawal tax; fund administrators (insurers, umbrella funds) bear implementation costs. The reform reduces income tax at retirement by building preserved capital, but generates short-term PAYE revenue from withdrawal taxes. National Treasury estimated R5 billion in withdrawal tax revenue in the first year.',
  key_quote = 'Two-pot is the most significant structural reform to retirement savings in a generation — the challenge now is implementation quality and preventing leakage from the savings pot. — FSCA, PC on Finance 2024',
  responsible_department = 'National Treasury / FSCA / SARS',
  feasibility_note = 'High: Implemented since September 2024. SARS and FSCA operational. Ongoing risk is fund administrator capacity and member communication quality.',
  updated_at = datetime('now')
WHERE id = 22;

-- id=26: Inclusive Growth Spending Review — Reprioritising Social Grants vs. Employment
UPDATE policy_ideas SET
  description = 'South Africa spends approximately R280 billion annually on social grants (SASSA), reaching ~19 million beneficiaries, including the R370/month SRD grant introduced during COVID-19 and extended through 2026. The Inclusive Growth Spending Review, recommended by the Presidential Economic Advisory Council, proposes reprioritising within the social protection envelope toward labour-activation programmes: expanded public employment (EPWP, CWP), youth wage subsidies, and skills vouchers. The SRD grant''s conditionality and linkage to employment pathways is contested; the Basic Income Grant debate frames the political economy. National Treasury''s medium-term fiscal framework notes that social protection is 57% of non-interest expenditure growth since 2019, crowding out infrastructure and economic services. The IMF and World Bank have noted SA''s unusually high social grant share relative to peer middle-income countries.',
  key_quote = 'Grants keep people alive — employment programmes give them a future. Both matter, but the balance has shifted too far from investment toward consumption. — PEAC Policy Note 2024',
  responsible_department = 'National Treasury / Department of Social Development / DPSA / DSBD',
  feasibility_note = 'Low: High political sensitivity; SRD has de facto Basic Income Grant constituency. Reallocation within fiscal envelope requires coalition agreement. Medium-term horizon at best.',
  updated_at = datetime('now')
WHERE id = 26;

-- id=27: Land Bank Recapitalisation and Agricultural Finance Refocus
UPDATE policy_ideas SET
  description = 'The Land and Agricultural Development Bank (Land Bank) entered a debt standstill in 2020 after a R5 billion guarantee call triggered a liquidity crisis. Government provided R10 billion in recapitalisation between 2021 and 2024, restructured the loan book, and replaced board and management. The strategic refocus targets a shift from commercial farmer financing (previously 85% of the book) toward emerging Black farmers, smallholders, and agri-processing enterprises under the DALRRD''s land reform programme. The Land Bank Amendment Act (2023) clarified its development mandate and SARB exemption status. Key challenges: non-performing loan legacy, procurement of agricultural insurance, and integration with Blended Finance instruments (USAID, DFI co-funding). Parliament''s PC on Agriculture has monitored the turnaround, noting improved liquidity but ongoing NPL concerns.',
  key_quote = 'Land Bank''s recapitalisation is not a bailout — it is an investment in the agricultural transformation the economy requires. — DALRRD, BRRR 2024',
  responsible_department = 'Department of Agriculture, Land Reform and Rural Development / National Treasury',
  feasibility_note = 'Medium: Recapitalisation complete; operational recovery underway. Development mandate shift requires cultural and credit assessment changes. NPL resolution is the outstanding risk.',
  updated_at = datetime('now')
WHERE id = 27;

-- id=28: Carbon Tax Phase 2 Implementation and Revenue Use
UPDATE policy_ideas SET
  description = 'South Africa''s Carbon Tax Act (2019) set a starting rate of R120/tCO₂e with generous allowances reducing effective rates to ~R10–30/tonne. Phase 2 (2026 onwards) raises the rate trajectory toward R640/tCO₂e by 2030 as allowances phase out, consistent with the NDC commitments under the Paris Agreement. Revenue use is contested: the current recycling mechanism (electricity levy offset, energy efficiency incentives) is fiscally neutral but provides little direct transition support. Proposals include: a dedicated Just Energy Transition fund from carbon revenue; tax relief for low-income households facing energy price increases; and R&D incentives for green technology. The DFFE and National Treasury co-administer; SARS collects. The Carbon Offset Administration System (COAS) enables registered offset purchases to reduce liability.',
  key_quote = 'A carbon price that is politically survivable but environmentally ineffective is the worst outcome — Phase 2 must deliver a credible signal for investment decisions. — National Treasury Carbon Tax Review 2024',
  responsible_department = 'National Treasury / Department of Forestry, Fisheries and the Environment / SARS / DMRE',
  feasibility_note = 'Medium: Phase 2 legislatively set; rate increases politically sensitive given energy cost pressures. Revenue recycling design the critical unresolved question. JET partnership provides international fiscal support.',
  updated_at = datetime('now')
WHERE id = 28;

-- id=29: AML/CFT Implementation Monitoring — NCOP and Provincial Layer
UPDATE policy_ideas SET
  description = 'South Africa was placed on the FATF Grey List in February 2023 following deficiencies in anti-money laundering, counter-terrorist financing, and proliferation financing frameworks. An inter-agency Action Plan (National Treasury, FIC, SAPS, NPA, SARB) addresses 22 action items across six priority areas. The NCOP''s Select Committee on Security and Justice plays a monitoring role, particularly for the provincial implementation of AML/CFT obligations on Designated Non-Financial Businesses and Professions (DNFBPs: attorneys, accountants, estate agents, car dealers). Key legislative reforms include the General Laws Amendment Act (2022) and the Protected Disclosures Amendment Act. FATF on-site assessment in late 2024 determined progress sufficient for grey list exit, expected in mid-2025. Asset forfeiture, beneficial ownership registers (CIPC), and suspicious transaction reporting volumes are the key performance indicators.',
  key_quote = 'Grey list exit is not the end — it is the floor. Sustainable AML/CFT compliance requires institutional culture change, not just legislative boxes ticked. — FIC Annual Report 2024',
  responsible_department = 'National Treasury / Financial Intelligence Centre / SAPS / NPA / SARB',
  feasibility_note = 'High: FATF Action Plan operational; grey list exit achieved/imminent 2025. Risk is maintaining compliance momentum post-exit. CIPC beneficial ownership register requires ongoing data quality work.',
  updated_at = datetime('now')
WHERE id = 29;

-- id=30: Municipal Fiscal Powers and Functions Amendment Bill
UPDATE policy_ideas SET
  description = 'South Africa''s 257 municipalities derive revenue from property rates (governed by the Municipal Property Rates Act), service charge surcharges, and RSC levy replacements. The Municipal Fiscal Powers and Functions Amendment Bill proposes to rationalise these revenue instruments, remove anomalies in property category definitions, introduce a tourism levy framework, and clarify surcharge limits on water and electricity. The Bill also addresses the fiscal cliff facing smaller municipalities that rely almost entirely on equitable share grants while lacking own-revenue capacity. The FFC''s fiscal incapacity findings show that 163 municipalities could not fund basic services from own revenue by 2023. National Treasury and COGTA co-sponsor; the SA Local Government Association (SALGA) has raised concerns about the surcharge cap provisions that could constrain metropolitan revenue.',
  key_quote = 'Municipal fiscal sustainability cannot be achieved by grant dependence alone — own-revenue capacity must be built or the system will continue to collapse. — FFC Submission to PC on COGTA, 2024',
  responsible_department = 'National Treasury / COGTA / SALGA',
  feasibility_note = 'Medium: Bill drafted; Parliamentary cycle required. Politically contested between metros (revenue maximisation) and National Treasury (fiscal discipline). Fiscally important but slow-moving.',
  updated_at = datetime('now')
WHERE id = 30;

-- id=31: Cooperative Banks Development and Township Financial Inclusion
UPDATE policy_ideas SET
  description = 'South Africa''s Cooperative Banks Development Agency (CBDA), established under the Cooperative Banks Act (2007), oversees approximately 40 registered cooperative financial institutions (CFIs) with combined assets under R500 million — tiny relative to the formal banking sector. The reform agenda seeks to grow CFIs in township and rural areas to provide affordable savings, credit, and payment services to the unbanked. Proposals include: an amended Cooperative Banks Act to create a tiered licensing framework with lower capital thresholds for community-level savings groups; SARB supervisory ring-fencing for CFIs below R50 million in assets; blended finance first-loss facilities through the IDC; and integration with the Post Bank''s township payments infrastructure. The FSD Africa and UNCDF have co-funded pilot CFI capacity programmes in KZN and Gauteng townships.',
  key_quote = 'A stokvels economy worth R50 billion operates outside any regulatory protection — cooperative banking is the bridge between informal savings culture and formal financial inclusion. — CBDA Annual Report 2023',
  responsible_department = 'National Treasury / SARB / CBDA / Department of Trade, Industry and Competition',
  feasibility_note = 'Medium: Legislative reform of Cooperative Banks Act needed. SARB capacity for CFI supervision limited. Blended finance mechanisms available. Scale challenge: CFI growth is organic and slow.',
  updated_at = datetime('now')
WHERE id = 31;

-- id=33: Financial Matters Amendment — Insurance Sector and Microinsurance
UPDATE policy_ideas SET
  description = 'The Financial Matters Amendment Act and the Insurance Act (18 of 2017) created a dedicated microinsurance licence category to serve low-income households with simple, affordable products (funeral cover, crop insurance, household contents). The FSCA oversees approximately 12 licensed microinsurers and hundreds of cell captive arrangements. The reform agenda addresses: persistently high expense ratios (>60%) in the microinsurance market; exclusionary fine print in funeral policies; integration with SASSA grant payment infrastructure for premium deduction; and the extension of microinsurance to parametric agricultural products for smallholders. The PC on Finance has raised concerns about the Policyholder Protection Rules (PPR) enforcement and debit order abuse targeting grant recipients. Twin Peaks regulation gives both the Prudential Authority (SARB) and FSCA oversight roles.',
  key_quote = 'Funeral cover is the most widely held financial product in SA — its integrity is the foundation of mass market financial inclusion. — FSCA Market Conduct Report 2024',
  responsible_department = 'National Treasury / FSCA / Prudential Authority (SARB)',
  feasibility_note = 'Medium-high: Regulatory framework established. Key gap is enforcement of PPR and combating debit order abuse. No new legislation required; supervisory intensity the lever.',
  updated_at = datetime('now')
WHERE id = 33;

-- id=34: Intergovernmental Fiscal Framework Review — Equitable Share Formula
UPDATE policy_ideas SET
  description = 'The equitable share is the main unconditional grant transferring national revenue to provinces (R764 billion in 2025/26) and municipalities (R110 billion), allocated by formula under the Division of Revenue Act (DoRA). The provincial equitable share formula uses demographic, education, health, poverty, and institutional components; it has not been comprehensively reviewed since 2012. The Financial and Fiscal Commission (FFC) has recommended updating the formula to better reflect: cost-of-service-delivery differentials between provinces; the growing share of conditional grants outside the formula; and the underfunding of rural municipalities relative to service delivery mandates. A formula review requires National Treasury, FFC, provincial treasuries, and COGTA agreement — politically complex given the zero-sum redistribution implications. The 2025 MTBPS signals a review process beginning in 2026.',
  key_quote = 'A formula unchanged for a decade while SA''s demographic and fiscal landscape has shifted is a formula misallocating resources — review is long overdue. — FFC Recommendations Report 2024',
  responsible_department = 'National Treasury / Financial and Fiscal Commission / COGTA',
  feasibility_note = 'Low-medium: Politically very difficult — every formula change creates winners and losers among provinces. FFC provides technical legitimacy but political consensus is the bottleneck. Multi-year process.',
  updated_at = datetime('now')
WHERE id = 34;

-- id=36: Koeberg Nuclear Power Plant Long-Term Operation Extension
UPDATE policy_ideas SET
  description = 'Koeberg Nuclear Power Station, SA''s only nuclear plant (1,860 MW), reached the end of its original 40-year design life in 2024–2025. Eskom applied for a 20-year long-term operation (LTO) licence extension, which the National Nuclear Regulator (NNR) granted in principle in 2022 subject to safety upgrades and steam generator replacement. New steam generators — procured from Framatome (France) — were installed in Units 1 and 2 during outages in 2023–2024. Koeberg provides approximately 4–5% of SA''s total electricity generation at ~2.5 c/kWh, one of the cheapest available sources. The LTO extension avoids the loss of 1,860 MW of baseload capacity during the critical post-load-shedding stabilisation period. NERSA rate treatment and the fuel procurement contract with NECSA (domestic fuel assembly) are key regulatory dimensions.',
  key_quote = 'Koeberg''s extended life buys SA a decade of affordable baseload power — abandoning it prematurely would be one of the most costly energy decisions ever made. — Eskom CEO, PC on Energy 2024',
  responsible_department = 'Department of Mineral Resources and Energy / Eskom / NNR / NERSA',
  feasibility_note = 'High: NNR licence extension granted; steam generators installed. Operational risk is ongoing maintenance and fuel procurement. Fiscally positive — avoids costly replacement capacity.',
  updated_at = datetime('now')
WHERE id = 36;

-- id=37: Nuclear New Build Programme — 2,500 MW New Nuclear Sites
UPDATE policy_ideas SET
  description = 'The Integrated Resource Plan (IRP) 2023 includes 2,500 MW of new nuclear capacity from the 2030s, down from the 9,600 MW target in the controversial 2016 nuclear deal with Russia (declared unlawful by the Western Cape High Court in 2017). The current programme seeks a technology-neutral procurement, with SMR (small modular reactor) options now included alongside conventional large-scale PWR designs. International vendors include EDF (France), Rosatom (Russia), KHNP (South Korea), and NuScale/GE-Hitachi (USA/Canada). DMRE initiated a nuclear new build Request for Information in 2023. Financing remains the critical unresolved constraint — large nuclear at R300–500 billion is beyond Eskom''s balance sheet without sovereign guarantees or DFI concessional finance. Site preparation at Thyspunt (Eastern Cape) is the most advanced. Public opposition and civil society litigation have accompanied each nuclear procurement attempt.',
  key_quote = 'The question is not whether SA needs nuclear, but whether we can afford it and govern the procurement — both remain open. — Energy Expert Panel, DMRE IRP Review 2023',
  responsible_department = 'Department of Mineral Resources and Energy / Eskom / National Treasury / NNR',
  feasibility_note = 'Low-medium: IRP target set but financing, procurement, and timeline unresolved. SMR technology not yet commercially proven at scale. Political economy includes strong pro- and anti-nuclear constituencies.',
  updated_at = datetime('now')
WHERE id = 37;

-- id=38: NERSA Municipal Tariff Rationalization and Cost-Reflective Pricing
UPDATE policy_ideas SET
  description = 'Municipalities that distribute electricity (approximately 185 licensed distributors, mostly metros) buy bulk power from Eskom at regulated tariffs and resell at surcharges to fund municipal services — in some cases adding 30–50% above Eskom rates. NERSA''s Municipal Tariff Guideline Circulars have tried to limit surcharges, but enforcement is weak and surcharge methodologies are inconsistent across municipalities. The reform agenda proposes: mandatory cost-reflective tariff methodology for all municipal distributors; NERSA compliance reviews with enforcement sanctions; phased elimination of cross-subsidies between user categories (residential, commercial, industrial); and transparency requirements on tariff composition. High municipal tariffs have driven large industrial users toward embedded generation, reducing municipal revenue — a negative feedback loop threatening distribution viability.',
  key_quote = 'Industrial users leaving the municipal grid to escape punitive tariffs take their cross-subsidy with them — tariff rationalisation is urgent before the spiral worsens. — NERSA Electricity Distribution Industry Task Team, 2024',
  responsible_department = 'NERSA / COGTA / National Treasury / Eskom',
  feasibility_note = 'Medium: NERSA has guideline-setting powers but enforcement is limited. Municipalities guard tariff autonomy under the Constitution. Requires COGTA-NERSA coordination framework with legislative backing.',
  updated_at = datetime('now')
WHERE id = 38;

-- id=39: Integrated Energy Plan Update — Gas and Energy Diversification
UPDATE policy_ideas SET
  description = 'The Integrated Energy Plan (IEP) is SA''s long-term energy demand and supply forecast, providing the strategic context for the IRP (electricity) and Gas Master Plan. The IEP 2023 update incorporates: LNG import infrastructure at Richards Bay and Coega for gas-to-power and industrial use; expanded renewable energy capacity beyond IRP targets; and a transition pathway for coal-dependent provinces (Mpumalanga, Limpopo). Gas diversification is driven by the projected decline of Sasol''s Mozambique Pande/Temane gas supply post-2026 and the need for peaking capacity as variable renewables grow. The IEP links to the Gas Amendment Bill (LNG regulatory framework), the ACER African Clean Energy Pipeline, and SA''s JET Investment Plan. DMRE coordinates; Transnet provides port infrastructure; NERSA regulates gas transmission tariffs.',
  key_quote = 'Gas is the essential complement to renewables — without flexible generation, variable solar and wind cannot fully replace coal baseload. — DMRE IEP 2023',
  responsible_department = 'Department of Mineral Resources and Energy / Transnet / NERSA',
  feasibility_note = 'Medium: IEP gazetted; Gas Amendment Bill in Parliament. LNG terminal investment requires private sector commitment (RLTC, Total, ENI). Mozambique gas supply risk adds urgency.',
  updated_at = datetime('now')
WHERE id = 39;

-- id=40: NERSA Institutional Independence and Regulatory Capacity
UPDATE policy_ideas SET
  description = 'The Electricity Regulation Amendment Act (ERA, signed August 2024) restructures SA''s electricity regulatory architecture: NERSA retains transmission and distribution regulation; a new Transmission System Operator (TSO, ring-fenced from Eskom) takes over grid operations; and an Independent Market Operator (IMO) will manage the competitive generation market. NERSA''s institutional independence has historically been compromised by DMRE ministerial directives and Eskom''s dominant position in tariff hearings. The reform agenda includes: a multi-year tariff methodology (MYPD) with clear NERSA autonomy from ministerial override; increased NERSA funding through regulatory levies rather than DMRE appropriation; and technical capacity building in renewable energy and market design. The Competition Commission''s energy market inquiry (2015–2020) identified NERSA''s regulatory weakness as a structural barrier to IPP investment.',
  key_quote = 'A regulator that can be overridden by its minister is not independent — NERSA reform is the institutional precondition for a competitive electricity market. — Competition Commission Energy Market Inquiry, 2020',
  responsible_department = 'NERSA / Department of Mineral Resources and Energy / National Treasury',
  feasibility_note = 'Medium-high: ERA Act provides legislative basis. TSO and IMO establishment underway. Risk is DMRE political resistance to genuine independence and Eskom legacy influence.',
  updated_at = datetime('now')
WHERE id = 40;

-- id=41: Solar Water Heater Programme — Mass Residential Rollout
UPDATE policy_ideas SET
  description = 'Solar water heaters (SWH) reduce household electricity consumption by 30–40% by substituting electric geysers — one of the largest residential electricity loads. The DMRE''s Solar Water Heater Programme (SWHP) has been running in various forms since 2008, targeting 1 million installations but achieving far fewer due to supply chain, installation quality, and financing constraints. The updated programme model uses an ESCO (Energy Services Company) delivery mechanism with a monthly service fee replacing upfront capital cost. Municipalities and utilities procure installations via competitive tender; Eskom rebates provide fiscal support. The programme targets low-income households (subsidised) and middle-income households (financed). SABS accreditation standards for imported Chinese SWH units address quality failures that plagued earlier rounds. Potential to reduce residential peak demand by 400–600 MW at scale.',
  key_quote = 'A subsidised geyser replacement programme is among the cheapest demand-side interventions available — R3,000 per household vs. R30,000 per kW of new generation. — Eskom DSM Evaluation 2023',
  responsible_department = 'Department of Mineral Resources and Energy / Eskom / COGTA',
  feasibility_note = 'Medium-high: Programme model proven; ESCO financing addresses upfront cost barrier. Scale requires municipal procurement capacity and SABS-certified supply chain at volume.',
  updated_at = datetime('now')
WHERE id = 41;

-- id=43: Gas Amendment Bill — LNG Import Infrastructure and City Gas
UPDATE policy_ideas SET
  description = 'The Gas Amendment Bill (passed 2024) updates the Gas Act (2001) to create a regulatory framework for LNG imports, city gas distribution networks, and the emerging gas-to-power market. Key provisions include: a new LNG import terminal licence category; NERSA regulation of LNG regas and transmission tariffs; a city gas reticulation framework enabling municipalities to distribute piped gas for cooking and heating; and updated safety standards for compressed natural gas (CNG) vehicles. LNG import projects at Richards Bay (Karpowership, Metgas), Coega (Sunrise LNG), and Saldanha Bay (proposed) are the primary investee projects. The Bill removes a key regulatory gap that had deterred private LNG investment. DMRE oversees; NERSA regulates; Transnet provides port infrastructure. Gas-to-power under the Gas Independent Power Producers Procurement Programme (GIPPP) requires the Bill''s passage.',
  key_quote = 'The Gas Amendment Bill is not about gas — it is about giving SA the flexible generation it needs to make a renewable energy future work. — DMRE, PC on Energy 2023',
  responsible_department = 'Department of Mineral Resources and Energy / NERSA / Transnet / National Ports Authority',
  feasibility_note = 'High: Bill passed 2024. Implementation requires LNG terminal investment decisions and NERSA tariff methodology. GIPPP procurement can proceed. Supply diversification reduces Sasol dependence.',
  updated_at = datetime('now')
WHERE id = 43;

-- id=44: Upstream Petroleum Resources Development Bill
UPDATE policy_ideas SET
  description = 'The Upstream Petroleum Resources Development (UPRD) Bill separates oil and gas upstream regulation from the Mineral and Petroleum Resources Development Act (MPRDA), creating a dedicated legislative framework for exploration and production. SA''s offshore gas discoveries (TotalEnergies'' Brulpadda and Luiperd blocks in the Outeniqua Basin, with 1+ trillion cubic feet of recoverable gas) have been stranded by regulatory uncertainty. The UPRD Bill introduces: a Petroleum Agency SA (PASA) mandate for licence administration; a fiscal regime (royalties, profit petroleum) competitive with Mozambique and Namibia; a community development obligation for offshore blocks; and a gas-to-power linkage obligation requiring gas to serve domestic energy demand before export. After years of delay, the Bill was introduced to Parliament in 2024. Successful passage would unlock an estimated R100–200 billion in offshore investment over 10 years.',
  key_quote = 'Brulpadda and Luiperd sit unexploited while SA suffers load-shedding — the UPRD Bill is the key that unlocks a domestic gas future. — TotalEnergies SA, PC on Mineral Resources 2024',
  responsible_department = 'Department of Mineral Resources and Energy / PASA / National Treasury',
  feasibility_note = 'Medium: Bill introduced 2024; Parliamentary passage expected 2025. Fiscal regime design (royalty rates, community obligations) is the contested dimension. Environmental authorisation for offshore blocks remains a parallel process.',
  updated_at = datetime('now')
WHERE id = 44;
