-- ============================================================
-- Combined reference: all remaining policy idea descriptions
-- Mirrors 007a-007d migrations; apply those in sequence instead
-- Generated: 2026-03-24
-- ============================================================

BEGIN;

-- id=1
UPDATE policy_ideas SET
  description = 'The Copyright Amendment Bill (CAB), passed by Parliament in 2022 but returned unsigned after President Ramaphosa declined assent citing AGOA-related IP concerns raised by the US USTR, is South Africa''s most contested intellectual property reform in two decades. The bill introduces a flexible fair use doctrine (replacing the closed fair dealing provisions of the Copyright Act 98 of 1978), creates a digital copyright framework for online platforms, and establishes exceptions for education, research, and persons with disabilities in line with the Marrakesh Treaty. The AGOA complication: the USTR identified the CAB''s fair use provisions as potentially inconsistent with the TRIPS Agreement three-step test, threatening preferential market access if signed. The PC on Trade BRRRs 2022–2024 document the tension between educational access advocates requiring fair use for digital learning and creative industry stakeholders (SAMRO, publishers) concerned about revenue loss. A revised CAB must satisfy TRIPS Article 13 while preserving meaningful educational fair use and implementing Marrakesh disability access commitments. The DTI and DIRCO are managing the diplomatic and legislative tracks in parallel.',
  updated_at = NOW()
WHERE id = 1;

-- id=2
UPDATE policy_ideas SET
  description = 'The Competition Commission launched its Online Intermediation Platforms Market Inquiry (OIPMI) in 2021, investigating market power in digital platforms including online food delivery (Uber Eats, Mr D Food), e-commerce (Takealot/Makro), app stores (Apple, Google), and online classifieds. Interim remedies issued in 2023 include mandatory listing of rival products on dominant platforms, prohibition on parity pricing clauses, and data access rights for third-party sellers. The final report (2024) recommends structural remedies modelled on the EU Digital Markets Act — including mandatory data portability, interoperability requirements, and algorithm transparency obligations. The Digital Platforms Competition Framework extends buyer power regulations (introduced in the Competition Amendment Act 2018 for agri-food markets) to digital platform markets. The PC on Trade BRRRs note the inquiry''s significance for SMME market access: over 60% of South African SMMEs report digital platforms as their primary sales channel, making platform governance a small business policy issue as much as a competition one. App store commission rates of 15–30% are specifically flagged as an excessive pricing concern under Section 8 of the Competition Act.',
  updated_at = NOW()
WHERE id = 2;

-- id=3
UPDATE policy_ideas SET
  description = 'The African Growth and Opportunity Act (AGOA) provides duty-free access to the US market for approximately 1,800 South African product categories. SA''s AGOA exports—concentrated in vehicles, citrus, wine, and minerals—were valued at USD 2.8 billion in 2023. AGOA''s current authorisation expires in September 2025, and renewal on favourable terms requires SA to demonstrate compliance with eligibility criteria including market openness, worker rights, and IP protection. The AGOA Retention Strategy, led by DIRCO and DTIC, involves diplomatic engagement with the USTR, addressing US concerns about SA''s IP regulatory approach (Copyright Amendment Bill) and its non-alignment stance on Russia. Simultaneously, the Post-AGOA Diversification Strategy develops contingency plans for EU (TDCA/SADC EPA), UK (SACUM-UK EPA), and AfCFTA alternatives. The PC on Trade''s BRRR 2024 flagged both the urgency of AGOA retention and the structural dependence on preferential access as a long-term vulnerability for SA exporters.',
  updated_at = NOW()
WHERE id = 3;

-- id=4
UPDATE policy_ideas SET
  description = 'The African Continental Free Trade Area (AfCFTA), in force since 2021, creates a market of 1.4 billion people and a combined GDP of USD 3.4 trillion. For South Africa, AfCFTA offers a structural opportunity to diversify exports beyond minerals and into manufactured goods, agri-processing, and services—where SA has comparative advantages. Implementation bottlenecks include: non-tariff barriers (divergent standards, customs procedures), infrastructure deficits at border crossings, the slow ratification of AfCFTA protocols on investment, competition, and intellectual property, and the limited capacity of ITAC and SARS to process expanded trade flows. The DTIC''s AfCFTA Action Plan (2023) identifies 10 priority sectors and 47 specific NTB reduction actions. Linking to the logistics reform agenda (Transnet, PRASA), border infrastructure investment, and the Guided Trade Initiative under AfCFTA are the near-term operational priorities. The IMF estimates AfCFTA full implementation could boost SA GDP by 1.5% annually by 2035.',
  updated_at = NOW()
WHERE id = 4;

-- id=5
UPDATE policy_ideas SET
  description = 'The South African Electric Vehicles White Paper (2023), led by the DTIC in consultation with NAACAM, NAAMSA, and the automotive OEMs (Toyota, VW, BMW, Ford, Isuzu), charts a managed transition of the domestic automotive sector from internal combustion engine (ICE) to electric vehicle production. SA''s automotive sector employs 110,000 direct workers and 440,000 in the supply chain, contributing 4.9% of GDP and R210 billion in exports annually under AGOA and TDCA preferential access. The White Paper proposes: extending the APDP (Automotive Production and Development Programme) to Phase 3 with EV-specific investment allowances, developing an EV charging infrastructure rollout plan in partnership with municipalities, establishing a battery cell assembly facility (linked to the Critical Minerals Beneficiation Strategy, id=45), and creating an EV skills transition programme through MERSETA. The critical policy tension is managing the transition: ICE vehicle exports to the US (under AGOA) remain the industry''s main revenue source through 2030, while EV platform investment decisions by global OEMs must be secured by 2025–2026 for 2030+ production. The PC on Trade BRRRs 2023–2024 flag the EV White Paper implementation timeline as behind schedule.',
  updated_at = NOW()
WHERE id = 5;

-- id=6
UPDATE policy_ideas SET
  description = 'South Africa''s Hydrogen Society Roadmap (2021) and the Green Hydrogen Commercialisation Strategy (2023) aim to leverage the country''s exceptional solar and wind resources, its PGM reserves (platinum as electrolyser catalyst), and its existing industrial gas infrastructure to position SA as a green hydrogen exporter and domestic industrial decarbonisation leader. The strategy identifies three near-term project clusters: green hydrogen for direct reduction ironmaking in the Northern Cape (linked to ArcelorMittal SA''s decarbonisation plans), green ammonia for fertiliser production (replacing imported grey ammonia), and green hydrogen export to the EU via the SA-Germany Hydrogen Partnership (signed 2023). The Presidential Hydrogen Commission, established under Operation Vulindlela, coordinates across DMRE, DTIC, DSIT, and DBSA. Fiscal context: R2.4 billion in catalytic funding from the JETP partnerships is earmarked for hydrogen demonstration projects. The main constraint is electrolyser cost (currently USD 800–1,200/kW) and green electricity price, both declining rapidly.',
  updated_at = NOW()
WHERE id = 6;

-- id=7
UPDATE policy_ideas SET
  description = 'The Steel and Metal Fabrication Master Plan (2021–2030), developed under the DTIC Masterplans process in partnership with Arcelor Mittal SA, Columbus Stainless, and the Steel and Engineering Industries Federation of Southern Africa (SEIFSA), aims to stabilise the domestic steel industry, retain industrial capacity, and develop downstream fabrication sectors. The master plan introduces safeguard duties on steel imports (activated by ITAC in 2023), local procurement designations for public infrastructure projects, and a Steel Development Fund to support energy efficiency and competitiveness upgrades in the sector. The context is challenging: Arcelor Mittal SA announced the closure of its Longs division in 2024 (affecting 3,500 workers), citing energy costs, cheap Chinese imports, and infrastructure bottlenecks at Transnet. The Energy Bounce-Back scheme (id=20) directly addresses energy cost competitiveness for steel producers. The master plan''s success depends on simultaneous progress in energy reform, logistics, and procurement localisation, making it one of the most dependency-intensive items in the reform agenda.',
  updated_at = NOW()
WHERE id = 7;

-- id=8
UPDATE policy_ideas SET
  description = 'The R-CTFL Master Plan (2019–2030), a multi-party social compact between DTIC, organised labour (SACTWU), retailers (SACCI/RFI), and manufacturers, targets doubling the sector''s contribution to GDP and employment by 2030 through a combination of import controls, localisation commitments from retailers, and productivity-linked investment support. The master plan''s central mechanism is voluntary retailer commitments to source 65% of designated product categories locally by 2030 (up from 44% in 2019), facilitated by a designated products list under the Preferential Procurement Regulations. SARS anti-dumping investigations against Chinese and Bangladesh textile imports are complementary. The PC on Trade BRRRs flagged under-performance on retailer localisation commitments and noted that customs fraud (under-invoicing of imports) undermines the economic case for local procurement. The sector employs approximately 120,000 workers, concentrated in the Eastern Cape and KwaZulu-Natal.',
  updated_at = NOW()
WHERE id = 8;

-- id=9
UPDATE policy_ideas SET
  description = 'South Africa''s Special Economic Zones programme, established under the SEZ Act (2014) and administered by DTIC, encompasses 11 designated zones including Coega, OR Tambo, East London IDZ, and the embattled Nkomazi SEZ. The programme offers investors tax concessions (15% corporate tax vs 27%), customs duty relief, employment incentives, and one-stop-shop regulatory services. However, uptake has been uneven: established zones (Coega IDZ, East London IDZ) attract significant investment, while newer zones like Nkomazi remain largely unoccupied despite years of infrastructure investment and preparation. The PC on Trade BRRR 2024 cited governance failures at Nkomazi, unresolved traditional leader land disputes, and inadequate utilities as root causes. The reform proposes: rationalising the portfolio to 6–8 high-performing zones, strengthening the SEZ Advisory Board, mandating performance contracts with annual investment and job targets, and linking SEZ infrastructure investment to the IDMS framework to improve project execution. The MTBPS 2025 allocates R4.2 billion to SEZ infrastructure over the MTEF period.',
  updated_at = NOW()
WHERE id = 9;

-- id=10
UPDATE policy_ideas SET
  description = 'South Africa''s poultry industry — employing approximately 36,000 workers directly and another 30,000 in feed, hatcheries, and processing — is under sustained pressure from imports of bone-in chicken portions, primarily from Brazil and the EU. ITAC investigations confirmed dumping margins of 13–62% on EU imports, leading to provisional anti-dumping duties in 2022 and final determinations in 2023. The Poultry Master Plan (2019–2023, under review), a social compact between DTIC, Astral Foods, Rainbow Chicken, SARI (SA Poultry Association), and AMCU/FAWU, targeted a 25% reduction in imports and 26,000 additional jobs — partially met. The 2025 review focuses on: extending and deepening anti-dumping duties, addressing feed cost competitiveness (yellow maize and soya meal pricing affected by drought and import logistics), expanding cold chain infrastructure in rural areas, and accelerating halal certification to open the African export market. Zimbabwe, Zambia, and Mozambique represent significant near-term export opportunities as AfCFTA implementation proceeds. The PC on Agriculture BRRRs 2023–2024 flag avian influenza biosecurity and small-scale poultry producer exclusion from master plan benefits as gaps requiring attention.',
  updated_at = NOW()
WHERE id = 10;

-- id=11
UPDATE policy_ideas SET
  description = 'South Africa''s regulatory environment imposes disproportionate compliance costs on small and medium enterprises. Before the World Bank discontinued Doing Business, SA ranked poorly on starting a business, paying taxes (27 annual payments vs. OECD average of 11), and enforcing contracts (average 600 days). The SMME Regulatory Burden Reduction reform — coordinated by the Presidency''s Operation Vulindlela unit with the DSBD — targets the highest-friction touchpoints: business registration (CIPC BizPortal digitisation, targeting 1-day company registration), tax compliance (SARS SME relief packages and turnover tax simplification for firms below R1 million turnover), municipal licensing (SPLUMA compliance rationalisation), and labour law compliance costs (CCMA access for small employers). The Presidency''s Red Tape Reduction impact assessment (2024) identified an estimated 12 million regulatory-hours per year lost by SMMEs to compliance administration — equivalent to 6,000 full-time workers doing nothing but paperwork. BizPortal, live since 2020, processed fewer than 20% of new business registrations by 2024 due to poor SARS-CIPC system integration. The reform also proposes a single SMME compliance certificate valid across municipalities, reducing the multi-municipal registration burden for mobile businesses.',
  updated_at = NOW()
WHERE id = 11;

-- id=12
UPDATE policy_ideas SET
  description = 'Following the Competition Amendment Act 2018''s introduction of buyer power provisions for designated sectors (initially agri-food), the Competition Commission and DTIC proposed extending buyer power regulations to digital platform markets in 2024. The framework targets three platform categories: online marketplaces (where dominant platforms impose extractive commission structures on third-party sellers — Takealot charges 6–30% depending on category), app stores (where 15–30% Apple/Google commissions are under global regulatory scrutiny), and payment platforms (where interchange fee structures disproportionately affect SMME financial inclusion). South Africa''s competition law framework — recognised as among the most progressive in the Global South — already includes complex merger assessment, excessive pricing provisions (Section 8), and abuse of dominance remedies. The Digital Platforms Framework builds on Online Intermediation Platforms Market Inquiry findings (id=2) and aligns with EU Digital Markets Act standards, positioning SA as a regulatory reference for African digital markets governance. The SMME Development Committee (NCOP) flagged that high platform commissions reduce SMME e-commerce viability, directly linking digital competition policy to employment outcomes.',
  updated_at = NOW()
WHERE id = 12;

-- id=13
UPDATE policy_ideas SET
  description = 'The National Lotteries Commission (NLC), which distributes approximately R3 billion annually from lottery proceeds to charitable, sports, and arts organisations, has been subject to sustained parliamentary and media scrutiny since 2019 for systemic governance failures. The Special Investigating Unit (SIU) investigation completed in 2023 identified R3.1 billion in irregular, fruitless, and wasteful expenditure across the NLC distribution portfolio — including grants to non-existent NGOs, politically connected beneficiaries, and construction projects with no charitable purpose. The NLC Amendment Act (under parliamentary development since 2022) proposes: mandatory public disclosure of all grants above R1 million, an independent NLC board with publicly nominated trustees replacing Ministerial appointments, a ring-fenced arts and culture fund with sector-governed distribution, and criminal referrals for implicated officials through the NPA. The PC on Trade BRRRs 2022–2024 consistently rank NLC among the worst-governed entities in its oversight portfolio. The reform is simultaneously a governance imperative and an arts sector recovery issue: legitimate arts and cultural organisations were excluded from NLC grants by politically connected intermediaries during the critical COVID-19 recovery period.',
  updated_at = NOW()
WHERE id = 13;

-- id=14
UPDATE policy_ideas SET
  description = 'South Africa''s localisation policy, formalised through the Preferential Procurement Regulations (2022) and the Public Procurement Act (2023), designates specific product categories for mandatory local procurement in government contracts. Designated products—including buses, rolling stock, set-top boxes, clothing, canned vegetables, and construction materials—must be sourced domestically when government institutions procure above threshold values. The programme is one of the most powerful industrial policy instruments available to government: state procurement at R1.3 trillion annually (including SOEs) represents approximately 20% of GDP. The reform agenda focuses on: expanding the designation list to include medium-voltage switchgear, solar panels, steel structures, and pharmaceutical active ingredients; strengthening ITAC''s local supplier assessment capacity to issue designations faster; closing compliance gaps where institutions report local procurement but subcontract to importers; and linking designations to SEDA and IDC supplier development programmes to build supplier capacity ahead of designation. The PC on Trade BRRRs 2021–2024 document widespread non-compliance, particularly in SOE procurement, and recommend mandatory reporting with consequence management for non-compliant institutions.',
  updated_at = NOW()
WHERE id = 14;

-- id=15
UPDATE policy_ideas SET
  description = 'The Equity Equivalent Investment Programme (EEIP), established under the B-BBEE Codes of Good Practice, allows multinationals that cannot undertake direct empowerment ownership (typically due to global stock exchange constraints) to make prescribed investments in skills development, supplier development, or enterprise development as a proxy for ownership points. Current approved EEIPs include Microsoft''s Skills to Succeed initiative, Ford''s enterprise supplier development fund, and pharmaceutical company R&D commitments. The DTIC''s EEIP Expansion proposes: sector-specific EEIP frameworks for fintech, mining services, and agro-processing; raising the minimum investment threshold (currently benchmarked at 25% of South African net value); establishing mandatory outcome monitoring with independent verification; and linking EEIP to technology transfer and skills development funding to ensure additionality beyond what companies would do commercially anyway. The reform addresses the widespread criticism that BBBEE compliance has become a formulaic checklist exercise rather than a genuine transformation instrument. The PC on Trade BRRRs note that EEIP approval backlogs at the DTIC (averaging 18 months) deter multinationals from applying, reducing transformation investment that could flow voluntarily.',
  updated_at = NOW()
WHERE id = 15;

-- id=16
UPDATE policy_ideas SET
  description = 'South Africa''s Fourth Industrial Revolution (4IR) strategy, launched by President Ramaphosa''s Presidential Commission on 4IR in 2019 and operationalised through DSIT''s 4IR Strategy (2022), aims to position SA as a competitive digital economy through targeted investment in artificial intelligence, big data, cloud computing, robotics, and IoT capabilities. The skills dimension—the 4IR Digital Skills Pipeline—is coordinated by DHET and the SETAs (particularly MICT SETA and EWSETA), targeting 1 million digital skills graduates by 2030 across three tiers: digital literacy for workers, applied digital skills for technicians, and advanced digital skills for engineers and data scientists. Specific programmes include the Coding and Robotics curriculum (rolled out to Grades 3–7 from 2023), the National Digital and Future Skills Strategy, and partnerships with TECH4SA, WeThinkCode, and uMsinitihi for developer pipeline programmes. The PC on Science and Technology BRRRs identify the absence of a dedicated 4IR skills budget line and the coordination failure between DSIT, DHET, and MICT SETA as the primary implementation gaps. The textbook (Chapter 5) identifies digital skills as the binding human capital constraint for South Africa''s participation in global value chains.',
  updated_at = NOW()
WHERE id = 16;

-- id=17
UPDATE policy_ideas SET
  description = 'The International Trade Administration Commission (ITAC) administers South Africa''s trade remedy system — anti-dumping, countervailing, and safeguard measures — under the International Trade Administration Act (2002). The system is under-resourced relative to its mandate: investigations average 18–24 months (against the WTO-compliant target of 12), the import surveillance unit has fewer than 15 analysts for a R1.7 trillion import base, and the SARS customs data interface is poorly integrated, causing delays in price comparison and injury determination. The modernisation reform proposes: an ITAC Capacity Enhancement Programme funded through a small levy on trade remedies collected; a real-time import surveillance system using HS code monitoring with automated price threshold alerts; integration of SARS trade microdata into ITAC''s price comparison database; and a 6-month fast-track procedure for critical industry investigations (steel, poultry, cement, chemicals). The PC on Trade BRRRs 2023–2024 note that ITAC is the enforcement backbone of every sector master plan but lacks the resources to sustain enforcement. BRICS+ trade expansion complicates the system: tariff remedy actions against BRICS partner imports require diplomatic calibration alongside technical trade law application.',
  updated_at = NOW()
WHERE id = 17;

-- id=18
UPDATE policy_ideas SET
  description = 'The Automotive Production and Development Programme (APDP), which replaced the Motor Industry Development Programme (MIDP) in 2013, uses a production incentive (R400–600 per locally-produced vehicle) and assembly allowance (duty credit certificates for component imports offsetting 30% of import duty) to support domestic vehicle assembly and component manufacturing competitiveness. APDP Phase 2 enhancements (2021–2035) extend the core production incentive, introduce a new component manufacturer rebate to deepen local content, and add a volume assembly allowance for manufacturers above 50,000 units per year. The programme''s total fiscal cost is approximately R12 billion per year in foregone customs duty and direct incentives, supporting an industry that generates R210 billion in export revenue. ITAC administers the duty credit mechanism, while DTIC manages the investment incentive. The BRRR synthesis from the PC on Trade flags the APDP''s role in retaining Toyota''s Prospecton plant investment and Ford''s Silverton expansion (R15.8 billion committed), but notes that the EV transition (id=5) requires APDP Phase 3 design to begin immediately, as current APDP incentives are ICE-platform-agnostic and may not optimally incentivise EV investment.',
  updated_at = NOW()
WHERE id = 18;

-- id=19
UPDATE policy_ideas SET
  description = 'South Africa assumed the BRICS chairmanship in 2023 and hosted the Johannesburg Summit that expanded the bloc to BRICS+ with Saudi Arabia, UAE, Ethiopia, Iran, Egypt, and Argentina. The trade facilitation agenda under SA''s chairmanship prioritised: local currency settlement frameworks to reduce USD dependency in intra-BRICS trade, New Development Bank (NDB, headquartered in Shanghai) expanded rand-denominated lending for infrastructure, and BRICS+ standards harmonisation for mutual recognition of product certifications and SPS measures. The MTBPS 2025 notes that BRICS+ trade accounts for 24% of SA''s total trade but 35% of mineral export value — making BRICS+ a strategically irreplaceable commercial relationship. The South African Reserve Bank''s Project Khokha 2 explored CBDC (Central Bank Digital Currency) interoperability as the settlement infrastructure. The PC on Finance BRRRs flag a structural tension: deepening BRICS+ engagement (including the Russia relationship) complicates SA''s AGOA retention, FATF greylisting exit, and diplomatic standing with the EU. Alternative payment systems development must be calibrated not to trigger secondary sanctions exposure or correspondent banking withdrawal by Western financial institutions.',
  updated_at = NOW()
WHERE id = 19;

-- id=20
UPDATE policy_ideas SET
  description = 'The Energy Bounce-Back Loan Guarantee Scheme and related self-generation incentives enable businesses to install rooftop solar, battery storage, and gas backup capacity with government-backed financing and accelerated depreciation allowances. Introduced in the 2023 Budget as a R9 billion tax incentive programme and expanded under Operation Vulindlela Phase I, the policy shifts generation responsibility partly to the private sector while Eskom''s grid is stabilised. Firms that install renewable capacity reduce their dependence on load-shedding schedules, cutting downtime costs estimated at R20 billion per month across the economy. The scheme is administered through the commercial banking sector under SARB oversight and links directly to the Electricity Regulation Amendment Act (ERA, signed August 2024), which removed the licensing threshold for embedded generation. Industrial energy users—especially in manufacturing, mining, and agriculture—are the primary beneficiaries, with the DTI tracking uptake through the industrial energy cadastre.',
  updated_at = NOW()
WHERE id = 20;

-- id=22
UPDATE policy_ideas SET
  description = 'The Two-Pot Retirement System, implemented on 1 September 2024, fundamentally restructured South Africa''s retirement savings architecture by dividing all new pension contributions into two components: one-third into an accessible "savings pot" (from which a single withdrawal is permitted per tax year, minimum R2,000) and two-thirds into a "retirement pot" (accessible only at retirement or emigration). The reform addressed the longstanding tension between South Africa''s low household savings rate and the economic hardship that historically drove members to preserve fund withdrawals on retrenchment (the primary cause of inadequate retirement outcomes). In the first four months of implementation, SARS and the National Treasury received R10.6 billion in withdrawal tax revenue from 2.1 million fund member withdrawals—indicating the scale of latent demand and the fiscal windfall from the transition. The reform was developed under the Pension Funds Act (amended by the Revenue Laws Amendment Act 2023) and required extraordinary coordination between FSCA, SARS, National Treasury, and all registered pension and provident funds. The PC on Finance BRRRs 2022–2024 document the legislative journey and note the retirement pot''s long-term adequacy challenge: low income workers contributing only to the savings pot across short working lives will face severe retirement income shortfalls.',
  updated_at = NOW()
WHERE id = 22;

-- id=26
UPDATE policy_ideas SET
  description = 'South Africa spends approximately R280 billion annually on social grants (2025/26), including the Social Relief of Distress (SRD) grant (R110 per day for 9 million recipients), child support grants (R530 per month for 13 million children), old age pensions, and disability grants. The fiscal cost of the SRD grant alone—introduced as a COVID-19 measure in 2020 and retained due to mass unemployment—is R35 billion per year. The Inclusive Growth Spending Review, proposed in the 2024 Budget and commissioned within the Medium-Term Expenditure Framework process, evaluates whether the social protection budget is optimally structured to simultaneously reduce poverty (short-term) and unemployment (long-term). Specifically: could a portion of the SRD grant budget be redirected to employment programmes (EPWP, Jobs Fund) without leaving vulnerable people worse off? The evidence from international social protection research suggests that conditionality (linking grants to training or job search) works in countries with functioning labour markets but has negligible effects in high-unemployment contexts. The textbook (Chapter 8) notes that South Africa''s grant system is fiscally large, well-targeted, and poverty-reducing but has no direct channel to labour market activation. The MTBPS 2025 commits to resolving the SRD grant''s legal status by 2026/27.',
  updated_at = NOW()
WHERE id = 26;

-- id=27
UPDATE policy_ideas SET
  description = 'The Land and Agricultural Development Bank (Land Bank) entered a debt standstill in 2020 after a R5 billion guarantee call triggered a liquidity crisis. Government provided R10 billion in recapitalisation between 2021 and 2024, restructured the loan book, and replaced board and management. The strategic refocus targets a shift from commercial farmer financing (previously 85% of the book) toward emerging Black farmers, smallholders, and agri-processing enterprises under the DALRRD''s land reform programme. The Land Bank Amendment Act (2023) clarified its development mandate and SARB exemption status. Key challenges: non-performing loan legacy, procurement of agricultural insurance, and integration with Blended Finance instruments (USAID, DFI co-funding). Parliament''s PC on Agriculture has monitored the turnaround, noting improved liquidity but ongoing NPL concerns.',
  updated_at = NOW()
WHERE id = 27;

-- id=28
UPDATE policy_ideas SET
  description = 'South Africa''s Carbon Tax Act (2019) introduced a carbon price starting at R127 per tonne CO₂ equivalent (2019), escalating under a schedule to reach R600–800 per tonne by 2035 (Phase 2, beginning 2026). The current effective price—after multiple allowances (process emissions, trade exposure, carbon budget compliance allowances)—is significantly below headline rates, averaging approximately R160–200 per tonne for most large emitters in 2024/25. Phase 2 implementation, which begins in January 2026, reduces allowances and raises the effective carbon price substantially, with revenue implications estimated at R28–35 billion annually by 2030 for SARS. The critical policy design question is revenue use: the 2019 Act hypothecated carbon tax revenue through the electricity levy reduction (offsetting consumer electricity costs), but this offset mechanism expires and Phase 2 revenue must be directed toward the Just Energy Transition Investment Plan, Eskom coal plant closure fund, and SMME energy transition support (id=123). The PC on Finance BRRRs 2023–2024 flag the disconnect between carbon tax ambition and the absence of a clear revenue recycling framework for Phase 2. Industrial sectors (steel, cement, chemicals) have submitted exemption requests that will be adjudicated by SARS and DMRE.',
  updated_at = NOW()
WHERE id = 28;

-- id=29
UPDATE policy_ideas SET
  description = 'South Africa was placed on the FATF Grey List in February 2023 following deficiencies in anti-money laundering, counter-terrorist financing, and proliferation financing frameworks. An inter-agency Action Plan (National Treasury, FIC, SAPS, NPA, SARB) addresses 22 action items across six priority areas. The NCOP''s Select Committee on Security and Justice plays a monitoring role, particularly for the provincial implementation of AML/CFT obligations on Designated Non-Financial Businesses and Professions (DNFBPs: attorneys, accountants, estate agents, car dealers). Key legislative reforms include the General Laws Amendment Act (2022) and the Protected Disclosures Amendment Act. FATF on-site assessment in late 2024 determined progress sufficient for grey list exit, expected in mid-2025. Asset forfeiture, beneficial ownership registers (CIPC), and suspicious transaction reporting volumes are the key performance indicators.',
  updated_at = NOW()
WHERE id = 29;

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

-- id=103
UPDATE policy_ideas SET
  description = 'DPWI and other national departments own significant well-located urban land — including former military bases, unused state hospitals, and surplus government offices — that is not being used productively. Releasing these parcels for affordable housing, mixed-use development, or social infrastructure could dramatically reduce the cost of urban land for low-income housing programmes without requiring expropriation. Operation Vulindlela identified public land release as a Phase I priority but progress has been slow due to inter-departmental coordination failures, disputes over land valuations, and competing departmental claims. A centralised Land Release Coordinating Committee with National Treasury, DPWI, DHS, and DTIC representation, backed by a Cabinet directive with implementation deadlines, is the proposed governance mechanism.',
  updated_at = NOW()
WHERE id = 103;

-- id=104
UPDATE policy_ideas SET
  description = 'The National Health Insurance Act (signed June 2023) establishes the legal framework for a single-payer health financing system that will pool public and private healthcare funding, contract accredited health service providers, and guarantee universal access to a defined package of services. The NHI Fund is to be operationalised in phases: Phase 1 (2023–2026) focuses on registering health users and providers, establishing governance structures, and piloting primary care contracting in selected districts. Full implementation, including mandatory enrolment and the transfer of private medical scheme members, is envisioned post-2030. Costing remains deeply contested: National Treasury estimates put the full NHI at R200–300 billion annually (current combined public and private health spending is R650 billion), but critics argue the model requires R450+ billion given expanded benefits and population. The World Bank, IMF, and rating agencies have flagged NHI fiscal risk as a sovereign concern. The PC on Health BRRRs 2023–2024 note that Phase 1 implementation is behind schedule on provider accreditation and ICT system procurement. This idea''s reform requirement is essentially: develop a credible, costed, phased implementation plan that can survive actuarial scrutiny before Phase 2 commitments are locked in.',
  updated_at = NOW()
WHERE id = 104;

-- id=105
UPDATE policy_ideas SET
  description = 'The US President''s Emergency Plan for AIDS Relief (PEPFAR) has invested approximately USD 6.5 billion in South Africa''s HIV/AIDS response since 2004, currently providing around USD 650 million annually (roughly R12 billion) to support antiretroviral treatment for 5.5 million people, community health worker programmes, laboratory networks, and civil society organisations. The Trump administration''s 2025 executive order initiating a review of all PEPFAR programming created an acute fiscal risk for South Africa''s health system: approximately 2 million patients on PEPFAR-supported ART programmes, 15,000 community health workers employed through PEPFAR-funded NGOs, and 47 PEPFAR-supported laboratory facilities face potential disruption. The DOH''s PEPFAR Transition Plan (2024–2027) proposes phased domestic absorption of the HIV programme into the NHI conditional grant framework, using HIV/AIDS conditional grant increase of R8 billion over three years to absorb the highest-priority programmes. International Development Finance from GFATM (Global Fund) and EU development partners provides potential bridge financing. This reform intersects directly with CHW formalisation (id=108) and NHI implementation (id=104).',
  updated_at = NOW()
WHERE id = 105;

-- id=106
UPDATE policy_ideas SET
  description = 'South Africa produces approximately 5,000 medical graduates, 14,000 nursing graduates, and 3,000 allied health graduates annually from public universities, yet an estimated 20,000–30,000 qualified health professionals are unemployed or underemployed due to frozen posts in provincial health departments. The contradiction—a country with catastrophic health worker shortages (doctor-to-population ratio of 0.9 per 1,000 vs. WHO recommended 2.5) that simultaneously has qualified but unemployed health workers—is a consequence of provincial health budget constraints and headcount freezes imposed under fiscal consolidation. The reform proposes: a national healthcare worker employment guarantee (funded through the NHI conditional grant and an emergency health workforce allocation of R5 billion per year), priority placement in rural and under-served districts, and a community service extension for doctors and nurses from 1 year to 2 years to expand rural coverage. The PC on Health BRRRs 2022–2024 document that Eastern Cape alone has 8,000 funded but vacant health posts, suggesting the problem is partly administrative (salary budget available but HR processes failing). PEPFAR transition (id=105) makes healthcare worker absorption more urgent by 2026.',
  updated_at = NOW()
WHERE id = 106;

-- id=108
UPDATE policy_ideas SET
  description = 'South Africa''s primary healthcare (PHC) platform—comprising 3,500 public health facilities plus approximately 72,000 community health workers (CHWs) deployed through the Ward-Based PHC Outreach Teams (WBPHCOT) model—is the structural foundation for NHI. This reform consolidates the CHW programme as a formal, paid tier of the health system, implements the integrated patient registration system (IPRS) across all PHC facilities, and deploys the digital health record system (HPRS) to enable continuity of care. The PEPFAR funding transition (id=105) makes CHW formalisation urgent: an estimated 15,000 CHWs employed through PEPFAR-funded NGOs face retrenchment as US funding winds down, creating a cliff in community-level HIV/TB service delivery. The PC on Health BRRRs 2022–2024 repeatedly flagged CHW contractualisation and the absence of a national employment framework as the central gap. Cost estimates: R8–12 billion annually for full CHW formalisation, partially offset by reduced hospital admissions.',
  updated_at = NOW()
WHERE id = 108;

-- id=109
UPDATE policy_ideas SET
  description = 'South Africa''s mental health system is severely under-resourced: fewer than 20 psychiatrists per million people (WHO recommends 1 per 10,000), 95% of mental health funding allocated to acute psychiatric hospitals rather than community-based care, and an estimated 75% of people with diagnosable mental health conditions receiving no treatment. The Life Esidimeni tragedy (2017), in which 144 mentally ill patients died after the Gauteng DOH terminated psychiatric care contracts and transferred patients to unregistered NGOs, exposed the catastrophic consequences of mental health service failures. The Mental Health Care Act Amendment (under preparation since 2020) proposes: community care mandates for provincial health departments, a minimum psychiatric bed ratio per district, recognition of community-based mental health workers as a formal health cadre, and a dedicated Mental Health Conditional Grant (currently mental health is unfunded within the PHC grant). The 2025 MTBPS does not include a dedicated mental health appropriation, making the structural reform dependent on the NHI implementation framework. The PC on Health BRRRs identify Life Esidimeni docket follow-up and provincial psychiatric bed capacity as the two most repeated mental health recommendations.',
  updated_at = NOW()
WHERE id = 109;

-- id=110
UPDATE policy_ideas SET
  description = 'South Africa''s tobacco control framework has not been substantively updated since the Tobacco Products Control Act (1993), despite the global proliferation of electronic nicotine delivery systems (ENDS), heated tobacco products, and waterpipes. The Tobacco Products and Electronic Delivery Systems Control Bill — providing for plain packaging, comprehensive advertising bans, and regulation of ENDS products — was tabled in 2018 and approved by Cabinet in 2022 but has been delayed by industry lobbying, jurisdictional disputes between the Departments of Health and Trade, Industry and Competition, and concerns about tax revenue implications. South Africa is a signatory to the WHO Framework Convention on Tobacco Control (FCTC), creating an international obligation to enact these measures. The PC on Health''s BRRRs consistently flagged the Bill''s stalled progress as a public health governance failure.',
  updated_at = NOW()
WHERE id = 110;

-- id=111
UPDATE policy_ideas SET
  description = 'Seven of South Africa''s nine provincial health departments received qualified audit opinions from the Auditor-General in 2023/24, reflecting persistent failures in financial management, supply chain governance, and infrastructure maintenance. The cumulative effect—medicine stockouts, equipment breakdowns, staff non-payment, and facility collapse—falls disproportionately on the 84% of South Africans dependent on public health. The Provincial Health Department Turnaround Programme (modelled on National Treasury''s Municipal Finance Improvement Programme for local government) deploys specialist financial management, supply chain, and HR teams to the three worst-performing provinces (Eastern Cape, Limpopo, North West) with a 2-year intensive support mandate. The PC on Health BRRRs 2022–2024 document the cyclical nature of provincial health crises: the same departments that were placed under Section 100 interventions in 2011–2013 are again in distress. NHI implementation (id=104) requires a stable provincial health infrastructure as its foundation—without turnaround, NHI will formalise dysfunction rather than reform it.',
  updated_at = NOW()
WHERE id = 111;

-- id=112
UPDATE policy_ideas SET
  description = 'The Competition Commission''s Health Market Inquiry (HMI), which reported in September 2019 after five years of investigation, found that South Africa''s private healthcare market is characterised by systemically high prices driven by concentrated hospital group power, inadequate price transparency, and a medical scheme system that fails to effectively represent patient interests against providers. The HMI''s 140+ recommendations include: mandatory multi-funder contracting (hospital groups cannot negotiate individually with each medical scheme), a National Reference Price List (NRPL) setting benchmark tariffs for all procedures, compulsory quality reporting by all private hospitals and specialists, and a new market conduct regulator for the healthcare sector. Implementation has been slow: the NRPL has been delayed by legal challenges from private hospital groups and specialist associations (HASA, SAMA), and the Council for Medical Schemes (CMS) lacks enforcement capacity. The MTBPS 2025 notes that private healthcare costs constitute 45% of total health spending despite serving only 16% of the population—a resource allocation that NHI implementation must address structurally. The PC on Health BRRRs 2021–2024 consistently flag HMI implementation delays as a governance failure.',
  updated_at = NOW()
WHERE id = 112;

-- id=113
UPDATE policy_ideas SET
  description = 'The African Medicines Agency (AMA) was established under the African Union framework and opened its headquarters in Yaoundé, Cameroon in 2021 after South Africa ratified the AMA Treaty. SAHPRA (South African Health Products Regulatory Authority) — one of Africa''s most technically sophisticated medicines regulators — is positioned as a reference regulatory authority for the AMA framework, able to provide registration reliance mechanisms that allow other African countries to benefit from SAHPRA''s rigorous reviews. SAHPRA''s 2025-2030 Strategic Plan and 2025/26 Annual Performance Plan outline priorities including: implementing a fully risk-based assessment approach, reducing registration backlogs (critical for NHI benefit package design), strengthening post-market surveillance, and combating the proliferation of counterfeit pharmaceuticals and medical devices. On 30 September 2025, South Africa launched a National Action Plan on Substandard and Falsified Medical Products in partnership with WHO. SAHPRA is also refining its eCTD dossier submission standards and labelling requirements to align with international ICH guidelines, critical for attracting pharmaceutical manufacturers to register in South Africa as a gateway to African markets. The AMA-SAHPRA relationship represents South Africa''s most concrete contribution to African health system integration under the AU Agenda 2063 framework.',
  updated_at = NOW()
WHERE id = 113;

-- id=115
UPDATE policy_ideas SET
  description = 'National Treasury Instruction 3 of 2021/22 mandated that all national and provincial departments reserve 30% of all procurement contracts for Small, Medium, and Micro Enterprises (SMMEs), township enterprises, and cooperatives—an estimated R120 billion per year in procurement that should flow to small businesses. However, compliance monitoring reveals that most departments meet the target on paper by disaggregating existing contracts and awarding sub-components to SMME subcontractors, without genuinely transferring the supply chain relationship or management capacity. The reform proposes: a reclassification of SMME procurement compliance to require direct prime contracts (not subcontracts) for the 30%, mandatory Supplier Development Plans where large contractors are awarded above-threshold contracts, BizPortal integration with CSD to make SMME registration and procurement participation seamless, and monthly compliance reporting to the PC on Small Business Development. The DSBD''s SMME Barometer (2024) estimates that only 18% of the 30% target is achieved through genuine prime SMME contracts. The Jobs Fund impact evaluation (2023) found that supply chain SMME development has the highest employment multiplier of any DSBD programme.',
  updated_at = NOW()
WHERE id = 115;

-- id=116
UPDATE policy_ideas SET
  description = 'The Small Enterprise Finance Agency (SEFA), a subsidiary of the IDC, provides development finance to SMMEs and cooperatives through direct loans and wholesale lending via microfinance intermediaries. Its R2.5 billion annual deployment has been criticised by the PC on Small Business Development for: over-concentration in working capital (short-term) loans rather than growth capital (equipment, premises, expansion), excessive concentration in Gauteng (55% of portfolio) relative to provincial SMME distributions, high non-performing loan rates (above 30% in several years), and insufficient linkage with the SEDA business support ecosystem. The mandate refocus reform proposes: a 40% minimum allocation to manufacturing and agro-processing (sectors with multiplier effects), dedicated provincial deployment targets aligned with the SMME policy, a non-performing loan recovery strategy that preserves lending capacity, and a blended finance partnership with the Jobs Fund to de-risk equity investments in high-growth SMMEs. The SMME Equity Fund (proposed in the 2024 Budget) would complement SEFA''s debt offering.',
  updated_at = NOW()
WHERE id = 116;

-- id=118
UPDATE policy_ideas SET
  description = 'South Africa''s cannabis and hemp sector sits at the intersection of agricultural development, industrial policy, public health regulation, and criminal justice reform. The regulatory landscape has been shifting rapidly: hemp was recognised as an agricultural crop in 2022, since when the Department of Agriculture has issued 2,031 cultivation permits. In December 2025, the permissible THC threshold for hemp plants was raised from 0.2% to 2%, significantly expanding the range of commercially viable cultivars. The Hemp and Cannabis Commercialisation Policy is expected to reach Cabinet for approval and public comment by April 2026. An Overarching Cannabis Bill — consolidating the Cannabis for Private Purposes Act (2024), commercial cultivation, manufacturing, and research regulations — is being drafted across DTIC, DAF, DoH, and DoJCD for presentation to Parliament by mid-2027. SAHPRA administers medicinal cannabis licensing. The Department of Trade, Industry and Competition''s National Cannabis Master Plan identifies export of medicinal cannabis to the EU, UK, and US as a priority revenue opportunity, with South Africa''s climate and soil conditions competitive with established producers in Colombia and Morocco. Provincial recognition frameworks for traditional cannabis growers — particularly in the Eastern Cape and KwaZulu-Natal — address social equity in the sector''s formalisation.',
  updated_at = NOW()
WHERE id = 118;

-- id=119
UPDATE policy_ideas SET
  description = 'The Small Enterprise Development Agency (SEDA) operates a network of over 50 enterprise development centres providing business advisory, training, and incubation services across South Africa, but a 2024 DSBD performance review found that services are perceived as generic, insufficiently linked to market demand, and inaccessible in deep rural areas and townships. Reform proposals include transitioning from generic advisory to sector-specialist hubs covering agri-processing, ICT, tourism, and the creative economy; deploying digital service delivery for basic advisory functions to extend geographic reach; and establishing outcome-based performance contracts for SEDA tied to measurable enterprise growth and job creation metrics. The PC on Small Business Development''s BRRRs repeatedly flagged SEDA''s high administration spend (over 40% of budget) versus actual enterprise impact.',
  updated_at = NOW()
WHERE id = 119;

-- id=120
UPDATE policy_ideas SET
  description = 'South Africa''s cooperative development programme, administered by the DSBD through the Cooperatives Incentive Scheme (CIS) and SEDA incubation, has disbursed hundreds of millions in grants since the Cooperatives Act (2005) yet produced few sustainable, scaled cooperative enterprises — a DSBD evaluation found an 80-90% failure rate within five years. The proposed outcome-based redesign replaces upfront capital grants with patient development capital linked to revenue milestones, restricts support to cooperatives in sectors with demonstrated market demand (particularly construction, waste, and community services), and mandates technical skills development alongside financial support. The IDC''s cooperative financing window provides a model for scaling to smaller entities under DSBD''s remit.',
  updated_at = NOW()
WHERE id = 120;

-- id=121
UPDATE policy_ideas SET
  description = 'South Africa''s informal economy employs an estimated 2.8-3.2 million workers predominantly in retail, food vending, and household services, but operates largely outside the formal regulatory and tax system. SARS''s Turnover Tax regime for businesses below R1 million annual turnover has seen slow uptake due to administrative complexity, while municipal trading infrastructure — market stalls, ablution facilities, electricity connections — is chronically inadequate in most townships and CBDs. The DSBD''s Informal Economy Policy Framework (2019) and Operation Vulindlela''s work on the spatial economy identify informal economy formalisation as an untapped labour market and fiscal resource. This reform combines SARS simplification with COGTA/SALGA-driven municipal infrastructure investment to lower the cost of formalisation.',
  updated_at = NOW()
WHERE id = 121;

-- id=122
UPDATE policy_ideas SET
  description = 'The Enterprise and Supplier Development (ESD) element of BBBEE scorecards requires corporations rated above Level 5 to invest 3% of net profit after tax in developing black-owned suppliers and enterprises. Estimated annual ESD investment of R8–12 billion from complying corporations represents a major but poorly managed private sector development finance flow: much ESD spend is directed toward single-year grants, soft-skills training, or preferential procurement clauses that expire with the scorecard cycle, rather than toward multi-year supplier relationship development. The Corporate Linkage Programme reform proposes: restructuring ESD codes to require multi-year supplier development contracts (minimum 3 years), integration of ESD suppliers with the SEDA Supplier Development Hubs and IDC''s SME Finance programme, mandatory ESD supplier registration on the Central Supplier Database to create a bankable track record, and a DTI-administered ESD impact measurement framework (currently ESD is self-reported with minimal verification). The PC on Trade BRRRs identify ESD as the BBBEE element with the largest gap between scorecard compliance and developmental impact.',
  updated_at = NOW()
WHERE id = 122;

-- id=123
UPDATE policy_ideas SET
  description = 'South Africa''s Just Energy Transition (JET) Investment Plan commits R1.5 trillion over 20 years to transition away from coal, creating significant commercial opportunities in renewable energy installation, energy efficiency retrofitting, battery storage, and green manufacturing. Most of these opportunities require upfront capital that small and medium enterprises cannot easily access through commercial banks, which apply standard credit criteria penalising early-stage energy companies. The DSBD, in coordination with the Small Enterprise Finance Agency (SEFA), is developing a dedicated JET-SMME Finance Facility providing blended first-loss instruments, technical assistance grants, and revenue-based financing. The facility would complement the International Partners Group''s $8.5 billion JET-IP commitments, which are directed primarily at large infrastructure.',
  updated_at = NOW()
WHERE id = 123;

-- id=133
UPDATE policy_ideas SET
  description = 'South Africa''s climate vulnerability — floods affecting Eastern Cape, KwaZulu-Natal and North West annually — exposes a broken emergency housing response system. The Emergency Housing Response Fund (EHRF) is administered at provincial level, with chronic underspending (provinces fail to access it) and allegations of political discrimination in allocations. Temporary Residential Units (TRUs) provided after disasters have become de facto permanent structures of poor quality. The DHS proposed centralising the EHRF in 2025, arguing that national administration would improve speed of response, quality control, and accountability. Parliamentary committee endorsed the principle while calling for stronger pre-positioning, provincial readiness protocols, and a cap on TRU duration with guaranteed transition to permanent housing.',
  updated_at = NOW()
WHERE id = 133;

-- id=134
UPDATE policy_ideas SET
  description = 'Community Residential Units (CRUs) are state-owned affordable rental housing for low-income households earning R0–R3,500 per month — the segment below the FLISP/First Home Finance threshold. Many CRU buildings transferred from councils to the state are in disrepair and undermanaged. The DHS has advocated expanding CRU supply through new construction and rehabilitation of existing stock in well-located urban areas, pairing supply with professional property management. Social housing institutions (SHIs) are well-placed to manage CRUs under a performance contract model. Committee discussions highlighted the need to avoid creating new informal settlements near CRU projects and the importance of proximity to economic opportunity in site selection.',
  updated_at = NOW()
WHERE id = 134;

-- id=135
UPDATE policy_ideas SET
  description = 'The Housing Consumer Protection Act (HCPA), enacted in 2024 to replace the Housing Consumers Protection Measures Act of 1998, creates a strengthened regulatory framework for the home building industry. Key provisions include mandatory enrolment of new homes with NHBRC, a new home warranty scheme, improved redress for defective construction, and enhanced consumer disclosure requirements. As of June 2025, the DHS was still finalising the implementing regulations. Full rollout requires aligning NHBRC''s inspection capacity, integrating the CIDB contractor grading register, and training municipalities on new approval conditions. The sector welcomes clearer rules but there are concerns about compliance cost for smaller affordable housing contractors.',
  updated_at = NOW()
WHERE id = 135;

-- id=136
UPDATE policy_ideas SET
  description = 'South Africa''s housing legislative framework is fragmented across at least nine statutes, including the Housing Act (1997), Social Housing Act (2008), National Housing Code, and various sector-specific measures. The Department has been developing a comprehensive National Human Settlements Bill since 2023 that would consolidate this framework, update definitions, align with the Constitution''s section 26 obligations, and provide a unified subsidy architecture. The bill addresses subsidy portability, mixed-income development standards, and the legal status of different housing typologies. Parliamentary committee engagement has been cautious, with members concerned that consolidation does not dilute rights-based protections or reduce departmental accountability.',
  updated_at = NOW()
WHERE id = 136;

-- id=137
UPDATE policy_ideas SET
  description = 'The Property Practitioners Regulatory Authority (PPRA) replaced the Estate Agency Affairs Board (EAAB) following the Property Practitioners Act (2019). Its mandate covers licensing, education, consumer protection, and transformation in the property sector. Committee oversight has repeatedly flagged PPRA governance failures, delayed fidelity fund certificate issuance (paralyzing property transactions), and the backlog in processing transformation and ownership requirements under the Act. Reform priorities include: (i) digitising the fidelity fund certificate process, (ii) implementing the mandatory BEE compliance provisions, (iii) improving PPRA governance and audit outcomes, and (iv) expanding the PPRA''s consumer redress capacity for property transaction disputes.',
  updated_at = NOW()
WHERE id = 137;

-- id=138
UPDATE policy_ideas SET
  description = 'The Housing Development Agency (HDA) is South Africa''s primary state vehicle for identifying, acquiring, holding, and releasing land and buildings for human settlements development. A May 2025 Presidential Proclamation mandated the SIU to investigate HDA following allegations of inflating land prices in multiple provinces, corrupt contractor appointment, and misappropriation of public funds. The Committee has called for consequence management, governance reforms, and a review of the HDA''s mandate to focus on strategic land assembly rather than project implementation. HDA''s CEO was suspended in 2026. Resolving governance dysfunction at HDA is a prerequisite for its expanded role in the abandoned buildings programme and broader urban land assembly.',
  updated_at = NOW()
WHERE id = 138;

-- id=139
UPDATE policy_ideas SET
  description = 'The Integrated Residential Development Programme (IRDP) was designed to create mixed-income neighbourhoods combining fully subsidised, partially subsidised, and market-rate housing — moving beyond the monolithic RDP township model. In practice, IRDP projects have largely defaulted to fully subsidised delivery due to weak demand for market-rate plots in peripheral locations and developers'' preference for greenfield private projects. Committee oversight shows persistent delivery delays, contractor non-performance, and beneficiary list fraud. Reform proposals focus on: (i) requiring IRDP sites to include minimum 30% market-rate units, (ii) improving location decisions to near economic nodes, (iii) linking land release decisions to transport corridors, and (iv) integrating IRDP with the UISP in peri-urban areas where informal settlements adjoin serviced land.',
  updated_at = NOW()
WHERE id = 139;

COMMIT;