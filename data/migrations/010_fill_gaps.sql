-- Migration 010: Add economic_impact_estimate and source_url to policy_ideas
-- Generated: 2026-03-24
-- Note: ALTER TABLE statements are idempotent-safe only on fresh DBs.
-- If columns already exist (e.g. from a partial run), skip these two lines.

ALTER TABLE policy_ideas ADD COLUMN economic_impact_estimate TEXT;
ALTER TABLE policy_ideas ADD COLUMN source_url TEXT;

UPDATE policy_ideas SET economic_impact_estimate = 'R5-15bn in digital economy activity unlocked over 5 years; 0.1-0.2% GDP contribution from creative industries and platform licensing', source_url = 'https://www.dtic.gov.za/economic-sectors-employment/intellectual-property' WHERE id = 1;

UPDATE policy_ideas SET economic_impact_estimate = '0.2-0.5% GDP gain from competitive pricing in digital markets; estimated R20-50bn consumer savings over 5 years', source_url = 'https://www.compcom.co.za/digital-markets-inquiry/' WHERE id = 2;

UPDATE policy_ideas SET economic_impact_estimate = 'R15-30bn annual export revenues at risk if AGOA lapses; retention sustains 60,000-80,000 apparel and auto-component jobs', source_url = 'https://www.thedtic.gov.za/trade-and-export-south-africa/agoa/' WHERE id = 3;

UPDATE policy_ideas SET economic_impact_estimate = '0.5-1.5% GDP uplift over 10 years from intra-African trade expansion; R50-150bn in additional SA exports', source_url = 'https://www.thedtic.gov.za/trade-and-export-south-africa/africa/african-continental-free-trade-area/' WHERE id = 4;

UPDATE policy_ideas SET economic_impact_estimate = '0.2-0.4% GDP contribution from localised EV assembly; 15,000-25,000 new manufacturing jobs by 2030', source_url = 'https://www.thedtic.gov.za/sectors-and-procurement/sectors/automotive/' WHERE id = 5;

UPDATE policy_ideas SET economic_impact_estimate = 'R300bn+ investment pipeline over 10 years; 0.3-0.8% GDP contribution at full commercial scale; 25,000-50,000 direct and indirect jobs', source_url = 'https://www.energy.gov.za/files/green_hydrogen/SA-Hydrogen-Society-Roadmap.pdf' WHERE id = 6;

UPDATE policy_ideas SET economic_impact_estimate = '0.1-0.3% GDP from retained steel capacity; 120,000 direct steel-sector jobs protected; R10-20bn avoided import substitution cost', source_url = 'https://www.thedtic.gov.za/sectors-and-procurement/sectors/metals-and-machinery/' WHERE id = 7;

UPDATE policy_ideas SET economic_impact_estimate = '0.1-0.2% GDP from clothing and textile industry stabilisation; 120,000 formal jobs preserved; R8-15bn in retained domestic production', source_url = 'https://www.thedtic.gov.za/sectors-and-procurement/sectors/clothing-textiles-footwear/' WHERE id = 8;

UPDATE policy_ideas SET economic_impact_estimate = '0.2-0.5% GDP from SEZ-anchored foreign direct investment; R50-100bn in capital formation over 5 years; 30,000-60,000 new jobs', source_url = 'https://www.sez.org.za/' WHERE id = 9;

UPDATE policy_ideas SET economic_impact_estimate = 'R4-8bn annual protection of domestic poultry sector; 35,000 jobs preserved; effective anti-dumping margins reduce import surge by 30-40%', source_url = 'https://www.itac.org.za/' WHERE id = 10;

UPDATE policy_ideas SET economic_impact_estimate = '0.2-0.5% GDP from SMME productivity gains; estimated R30-60bn in unlocked SMME output; 100,000-200,000 formalisation-driven job entries', source_url = 'https://www.gov.za/about-government/government-programmes/smme-development' WHERE id = 11;

UPDATE policy_ideas SET economic_impact_estimate = '0.1-0.3% GDP from reduced platform rents to consumers and SMEs; R10-25bn in annual consumer surplus gains from competitive pricing', source_url = 'https://www.compcom.co.za/digital-economy/' WHERE id = 12;

UPDATE policy_ideas SET economic_impact_estimate = 'R2-5bn in lottery funds redirected to high-impact social programmes; fiscal governance saving from reduced leakage and corruption', source_url = 'https://www.nlcsa.org.za/' WHERE id = 13;

UPDATE policy_ideas SET economic_impact_estimate = '0.1-0.3% GDP from domestic procurement multipliers; R20-40bn annually channelled to local producers via public procurement set-asides', source_url = 'https://www.thedtic.gov.za/economic-sectors-employment/localisation/' WHERE id = 14;

UPDATE policy_ideas SET economic_impact_estimate = 'R10-20bn in new equity equivalent investments; 5,000-10,000 qualifying black-owned supplier enterprises created over 5 years', source_url = 'https://www.thedtic.gov.za/economic-sectors-employment/broad-based-black-economic-empowerment/' WHERE id = 15;

UPDATE policy_ideas SET economic_impact_estimate = '0.3-0.7% GDP long-run from digital skills premium; R50-100bn in avoided skills import costs; 200,000-400,000 youth placed in tech roles over 10 years', source_url = 'https://www.thedtic.gov.za/economic-sectors-employment/4ir/' WHERE id = 16;

UPDATE policy_ideas SET economic_impact_estimate = 'R5-10bn in domestic industry protected annually from unfair imports; 20,000-30,000 manufacturing jobs preserved in steel, poultry, and footwear sectors', source_url = 'https://www.itac.org.za/trade-remedies/anti-dumping' WHERE id = 17;

UPDATE policy_ideas SET economic_impact_estimate = 'R800bn+ in automotive production value to 2035; 0.4-0.8% GDP contribution; 110,000 direct automotive jobs sustained', source_url = 'https://www.thedtic.gov.za/sectors-and-procurement/sectors/automotive/apdp/' WHERE id = 18;

UPDATE policy_ideas SET economic_impact_estimate = '0.1-0.3% GDP from alternative payment corridors reducing transaction costs by 20-40%; R5-15bn in annual remittance and trade finance savings', source_url = 'https://www.dirco.gov.za/brics/' WHERE id = 19;

UPDATE policy_ideas SET economic_impact_estimate = '0.3-0.7% GDP by eliminating loadshedding drag on industrial output; R30-60bn in avoided business continuity losses annually', source_url = 'https://www.energy.gov.za/files/energy/energy-bounce-back.pdf' WHERE id = 20;

UPDATE policy_ideas SET economic_impact_estimate = 'Estimated R15-25bn annual saving from reduced correspondent banking compliance costs; sovereign credit upgrade translates to 50-100bps lower government borrowing rates', source_url = 'https://www.fatf-gafi.org/en/countries/detail/South-Africa.html' WHERE id = 21;

UPDATE policy_ideas SET economic_impact_estimate = 'R30-60bn in accessible savings mobilised in first 3 years; improved long-term retirement adequacy for 10M+ formal sector workers', source_url = 'https://www.treasury.gov.za/legislation/bills/2022/two-pot-retirement-system.pdf' WHERE id = 22;

UPDATE policy_ideas SET economic_impact_estimate = 'Debt/GDP stabilisation below 75% saves an estimated R50-100bn in annual debt service by 2030; 0.5-1.0% GDP growth dividend from restored investor confidence', source_url = 'https://www.treasury.gov.za/documents/national%20budget/2025/review/FullBR.pdf' WHERE id = 23;

UPDATE policy_ideas SET economic_impact_estimate = 'R50-80bn in additional tax revenue annually from improved compliance; 0.3-0.5% GDP fiscal space unlocked for growth-enhancing expenditure', source_url = 'https://www.sars.gov.za/about/strategic-overview/' WHERE id = 24;

UPDATE policy_ideas SET economic_impact_estimate = 'R100-200bn in additional infrastructure financing mobilised over 5 years via PPPs and blended finance; 0.3-0.6% GDP infrastructure investment uplift', source_url = 'https://www.treasury.gov.za/organisation/ppp/' WHERE id = 25;

UPDATE policy_ideas SET economic_impact_estimate = 'Reallocation of R20-40bn annually from passive transfers to active labour market programmes; 0.2-0.4% GDP from improved employment multipliers', source_url = 'https://www.treasury.gov.za/documents/national%20budget/2025/review/FullBR.pdf' WHERE id = 26;

UPDATE policy_ideas SET economic_impact_estimate = 'R10-20bn in additional agricultural lending capacity; supports 50,000-80,000 small farmers; 0.1-0.2% GDP agricultural sector stabilisation', source_url = 'https://www.landbank.co.za/about-us/our-mandate' WHERE id = 27;

UPDATE policy_ideas SET economic_impact_estimate = 'Revenue-neutral short-term; R10-20bn in carbon tax receipts redirected to green transition; 0.1-0.2% GDP carbon-linked growth costs offset by green investments', source_url = 'https://www.treasury.gov.za/documents/national%20budget/2025/review/FullBR.pdf' WHERE id = 28;

UPDATE policy_ideas SET economic_impact_estimate = 'Maintains FATF exit dividend: R15-25bn annual savings in correspondent banking costs; ongoing benefit to sovereign credit rating', source_url = 'https://www.gov.za/about-government/government-programmes/anti-money-laundering' WHERE id = 29;

UPDATE policy_ideas SET economic_impact_estimate = 'R5-15bn in additional municipal own-revenue over 5 years from expanded fiscal powers; reduces central fiscal transfer dependence by 5-10%', source_url = 'https://www.treasury.gov.za/legislation/bills/municipal-fiscal-powers.aspx' WHERE id = 30;

UPDATE policy_ideas SET economic_impact_estimate = 'R5-10bn in new township deposits mobilised; financial inclusion gains for 2-3M unbanked township residents; 0.1% GDP from formalised micro-savings', source_url = 'https://www.prudentialauthority.co.za/Regulatory-Framework/Cooperative-Banks' WHERE id = 31;

UPDATE policy_ideas SET economic_impact_estimate = 'R50-100bn in infrastructure investment from GEPF mandate reallocation; 0.2-0.4% GDP infrastructure contribution; pension fund returns preserved at market rates', source_url = 'https://www.gepf.co.za/about-gepf/investment-strategy/' WHERE id = 32;

UPDATE policy_ideas SET economic_impact_estimate = 'R5-15bn in expanded microinsurance market; 5-8M low-income households newly covered; reduced household financial vulnerability', source_url = 'https://www.fsca.co.za/Regulatory%20Frameworks/Pages/Microinsurance.aspx' WHERE id = 33;

UPDATE policy_ideas SET economic_impact_estimate = 'R15-30bn in improved local government service delivery capacity from revised equitable share allocation; reduces municipal fiscal distress in 50+ at-risk municipalities', source_url = 'https://www.treasury.gov.za/documents/division%20of%20revenue/' WHERE id = 34;

UPDATE policy_ideas SET economic_impact_estimate = '1.0-2.0% GDP growth unlocked by ending systematic loadshedding; R100-200bn annual GDP loss from power cuts eliminated', source_url = 'https://www.energy.gov.za/IRP/irp-update-2023-2030.pdf' WHERE id = 35;

UPDATE policy_ideas SET economic_impact_estimate = 'R30-50bn in avoided replacement cost; 900MW baseload capacity maintained; 0.2-0.4% GDP from grid stability contribution', source_url = 'https://www.eskom.co.za/eskom-divisions/gx/koeberg-nuclear-power-station/' WHERE id = 36;

UPDATE policy_ideas SET economic_impact_estimate = 'R200-400bn in capital investment over 20 years; 0.5-1.0% GDP baseload supply contribution; 10,000-20,000 construction and operation jobs', source_url = 'https://www.energy.gov.za/nuclear/new-build-programme.php' WHERE id = 37;

UPDATE policy_ideas SET economic_impact_estimate = 'R10-20bn annually in municipal revenue optimisation; reduces cross-subsidies and improves Eskom cost recovery by R5-10bn annually', source_url = 'https://www.nersa.org.za/tariff-applications/' WHERE id = 38;

UPDATE policy_ideas SET economic_impact_estimate = '0.2-0.4% GDP from gas diversification reducing energy supply risk; R50-100bn in LNG infrastructure investment mobilised', source_url = 'https://www.energy.gov.za/IEP/Integrated-Energy-Plan-2024.pdf' WHERE id = 39;

UPDATE policy_ideas SET economic_impact_estimate = '0.1-0.3% GDP from improved regulatory certainty; estimated R20-40bn in private energy investment unlocked by credible independent regulation', source_url = 'https://www.nersa.org.za/about-nersa/' WHERE id = 40;

UPDATE policy_ideas SET economic_impact_estimate = 'R5-10bn in avoided electricity costs for 500,000 households; 0.05-0.1% GDP demand reduction freeing up supply capacity', source_url = 'https://www.energy.gov.za/files/ee/ee_solar_water_heater.html' WHERE id = 41;

UPDATE policy_ideas SET economic_impact_estimate = '0.5-1.5% GDP from competitive electricity market reducing industrial power costs by 15-25%; R50-100bn in new generation investment mobilised', source_url = 'https://www.nersa.org.za/electricity-regulation-act/' WHERE id = 42;

UPDATE policy_ideas SET economic_impact_estimate = '0.2-0.4% GDP from LNG gas feedstock for industrial use; R80-150bn in gas infrastructure investment over 10 years', source_url = 'https://www.energy.gov.za/files/gas/gas-amendment-bill.pdf' WHERE id = 43;

UPDATE policy_ideas SET economic_impact_estimate = 'R100-300bn in upstream oil and gas investment over 15 years; 0.3-0.8% GDP contribution at full production; 20,000-40,000 energy sector jobs', source_url = 'https://www.energy.gov.za/files/petroleum/upstream-petroleum-resources-development-bill.pdf' WHERE id = 44;

UPDATE policy_ideas SET economic_impact_estimate = 'R50-150bn in value-added beneficiation revenue over 10 years; 0.3-0.7% GDP above raw mineral exports; 15,000-30,000 processing jobs', source_url = 'https://www.dmre.gov.za/mineral-resources/critical-minerals' WHERE id = 45;

UPDATE policy_ideas SET economic_impact_estimate = 'R5-15bn annual consumer and industrial fuel savings from partial deregulation; reduces transport cost component of CPI by 0.3-0.5 percentage points', source_url = 'https://www.energy.gov.za/files/petroleum/fuel-price-regulation-reform.pdf' WHERE id = 46;

UPDATE policy_ideas SET economic_impact_estimate = 'R10-25bn in environmental liability resolved; prevents R50-100bn in long-term groundwater and land remediation costs from derelict mines', source_url = 'https://www.dmre.gov.za/mineral-resources/mine-rehabilitation' WHERE id = 47;

UPDATE policy_ideas SET economic_impact_estimate = 'Enables R200-400bn nuclear new build; regulatory capacity investment of R500m-1bn delivers 100x return on major nuclear programme', source_url = 'https://www.nnr.co.za/about-nnr/' WHERE id = 48;

UPDATE policy_ideas SET economic_impact_estimate = '0.3-0.8% GDP from grid integration of 15,000+ MW new renewable capacity; R200-400bn in private renewable investment enabled by transmission expansion', source_url = 'https://www.energy.gov.za/files/electricity/renewable-energy-grid-integration.pdf' WHERE id = 49;

UPDATE policy_ideas SET economic_impact_estimate = '0.2-0.5% GDP long-run from expanded graduate labour supply; R20-40bn in additional human capital formation annually; 100,000 additional annual graduates over 10 years', source_url = 'https://www.nsfas.org.za/content/about.html' WHERE id = 50;

UPDATE policy_ideas SET economic_impact_estimate = '0.1-0.3% GDP from artisan skills pipeline; 50,000-80,000 qualified artisans per year addressing critical trades shortage; R10-20bn in skills premium wages', source_url = 'https://www.dhet.gov.za/TVET%20Colleges/Pages/default.aspx' WHERE id = 51;

UPDATE policy_ideas SET economic_impact_estimate = 'R5-10bn in redirected SDA levy funds to higher-impact training; 0.1-0.2% GDP from improved workforce productivity matching', source_url = 'https://www.dhet.gov.za/SETAs/Pages/default.aspx' WHERE id = 52;

UPDATE policy_ideas SET economic_impact_estimate = 'R3-8bn in delayed earnings restored to 500,000+ qualified graduates; unlocks human capital utilisation and reduces brain drain', source_url = 'https://www.dhet.gov.za/University%20Education/Pages/University-Certification-Backlog.aspx' WHERE id = 53;

UPDATE policy_ideas SET economic_impact_estimate = '0.2-0.5% GDP long-run from reaching 1.5% R&D/GDP target; R20-40bn in additional innovation-driven GDP; aligns SA with upper-middle income country R&D norms', source_url = 'https://www.dst.gov.za/index.php/resource-center/dst-documents/annual-reports' WHERE id = 54;

UPDATE policy_ideas SET economic_impact_estimate = 'R2-5bn in annual NSFAS leakage recovered; improves fund adequacy for 1M+ genuine beneficiaries without additional fiscal cost', source_url = 'https://www.nsfas.org.za/content/news/nsfas-fraud-prevention.html' WHERE id = 55;

UPDATE policy_ideas SET economic_impact_estimate = '0.1-0.2% GDP from second-chance education reducing NEET youth by 10-15%; R10-20bn in lifetime earnings gains for 200,000-400,000 participants', source_url = 'https://www.dhet.gov.za/Community-Education-Training/Pages/default.aspx' WHERE id = 56;

UPDATE policy_ideas SET economic_impact_estimate = 'Enables R300bn+ green transition industries; 30,000-60,000 green-sector artisan jobs requiring reskilling; 0.2-0.4% GDP from energy transition manufacturing capacity', source_url = 'https://www.dhet.gov.za/Skills%20Development/Pages/Energy-Transition-Skills.aspx' WHERE id = 57;

UPDATE policy_ideas SET economic_impact_estimate = '0.5-1.5% GDP from reliable electricity supply; R100-200bn in annual GDP losses from loadshedding eliminated; privatisation unlocks R200-500bn in asset value', source_url = 'https://www.eskom.co.za/eskom-divisions/gx/restructuring/' WHERE id = 58;

UPDATE policy_ideas SET economic_impact_estimate = '0.3-0.8% GDP from logistics cost reduction; R50-100bn annual logistics cost savings; port dwell time reduction of 30-50% unlocks R20-40bn in trade competitiveness', source_url = 'https://www.transnet.net/BusinessWithTransnet/PSP/Pages/Transnet-Private-Sector-Participation.aspx' WHERE id = 59;

UPDATE policy_ideas SET economic_impact_estimate = 'R20-40bn in SOE procurement savings from policy flexibility; enables R50-100bn in private sector co-investment in SOE infrastructure', source_url = 'https://www.gov.za/documents/public-finance-management-act-soe-policy' WHERE id = 60;

UPDATE policy_ideas SET economic_impact_estimate = 'R254bn Eskom debt restructuring reduces contingent fiscal liability; saves R20-40bn in annual debt service; conditional on operational reforms delivering efficiency gains', source_url = 'https://www.treasury.gov.za/documents/national%20budget/2025/review/FullBR.pdf' WHERE id = 61;

UPDATE policy_ideas SET economic_impact_estimate = 'Enables R200-400bn renewable energy grid; 0.3-0.6% GDP from grid expansion enabling new generation capacity; 15,000-25,000 infrastructure construction jobs', source_url = 'https://www.energy.gov.za/files/electricity/ntcsa-capitalisation.pdf' WHERE id = 62;

UPDATE policy_ideas SET economic_impact_estimate = 'R10-30bn in defence industrial capacity preserved; prevents R5-10bn annual defence capability gap costs; 4,000-8,000 high-skilled defence engineering jobs', source_url = 'https://www.denel.co.za/about-denel/' WHERE id = 63;

UPDATE policy_ideas SET economic_impact_estimate = 'R2-10bn in land claim resolution; removes legal uncertainty inhibiting R5-15bn in downstream agricultural and mining investment', source_url = 'https://www.gov.za/about-government/contact-directory/entities/alexkor-soc-limited' WHERE id = 64;

UPDATE policy_ideas SET economic_impact_estimate = 'R5-15bn in annual fiscal savings from ending state aviation subsidies; commercial viability requires R2-4bn restructuring investment to break even by year 3', source_url = 'https://www.gov.za/about-government/contact-directory/entities/south-african-airways' WHERE id = 65;

UPDATE policy_ideas SET economic_impact_estimate = 'R5-10bn in accelerated IP commercialisation; 200-500 new technology spin-offs per year; 0.05-0.1% GDP from innovation ecosystem multiplier', source_url = 'https://www.tia.org.za/about-tia' WHERE id = 66;

UPDATE policy_ideas SET economic_impact_estimate = 'R5-15bn in accelerated R&D commercialisation revenues; 500-1,000 new IP licences per year; reduces knowledge transfer delays by 2-3 years', source_url = 'https://www.gov.za/documents/intellectual-property-rights-publicly-financed-research-and-development-act' WHERE id = 67;

UPDATE policy_ideas SET economic_impact_estimate = 'R3-8bn in venture financing for 100-200 high-growth startups per year; 5,000-10,000 tech economy jobs; 0.05-0.1% GDP from scaled innovation fund', source_url = 'https://www.innovationfund.co.za/' WHERE id = 68;

UPDATE policy_ideas SET economic_impact_estimate = '0.2-0.5% GDP long-run from reaching 1.5% R&D/GDP; R25-50bn annual innovation-linked GDP at full implementation of decadal plan', source_url = 'https://www.dst.gov.za/index.php/resource-center/dst-documents/white-papers' WHERE id = 69;

UPDATE policy_ideas SET economic_impact_estimate = '0.3-0.8% GDP contribution from green hydrogen R&D outputs commercialised; enables R300bn+ export revenue by 2035 at full scale', source_url = 'https://www.energy.gov.za/files/green_hydrogen/GH2-RD-Programme.pdf' WHERE id = 70;

UPDATE policy_ideas SET economic_impact_estimate = 'R5-10bn in digital economy productivity gains; provides foundational research for R20-40bn in applied digital industry output', source_url = 'https://www.csir.co.za/digital-capabilities' WHERE id = 71;

UPDATE policy_ideas SET economic_impact_estimate = 'R3-8bn in additional postgraduate output value; reduces PhD completion time by 1-2 years; improves research commercialisation pipeline', source_url = 'https://www.nrf.ac.za/bursaries-grants/postgraduate-bursaries/' WHERE id = 72;

UPDATE policy_ideas SET economic_impact_estimate = '0.1-0.2% GDP from agri-tech productivity uplift; R10-20bn in precision agriculture savings and yield improvements over 10 years', source_url = 'https://www.daff.gov.za/agri-tech' WHERE id = 73;

UPDATE policy_ideas SET economic_impact_estimate = 'R5-15bn in satellite services revenue; 1,000-3,000 high-value space economy jobs; enables downstream precision agriculture and earth observation industries', source_url = 'https://www.sansa.org.za/commercial/' WHERE id = 74;

UPDATE policy_ideas SET economic_impact_estimate = 'R2-5bn in licensing and royalty revenue from commercialised indigenous knowledge; protects SA IP in pharmaceuticals, agri-biotech, and cosmetics sectors', source_url = 'https://www.dhet.gov.za/Research%20and%20Coordination/Pages/Indigenous-Knowledge-Systems.aspx' WHERE id = 75;

UPDATE policy_ideas SET economic_impact_estimate = '0.2-0.5% GDP from restored commuter rail reducing road congestion; 2M+ daily commuters with travel time savings of 1-2 hours; R10-20bn in productivity recovered', source_url = 'https://www.prasa.com/about-us/who-we-are/' WHERE id = 76;

UPDATE policy_ideas SET economic_impact_estimate = '0.1-0.2% GDP from transport economic regulation reducing monopoly rents; R5-15bn in transport cost savings from competitive regulated pricing', source_url = 'https://www.dot.gov.za/economic-regulation-of-transport/' WHERE id = 77;

UPDATE policy_ideas SET economic_impact_estimate = 'R5-15bn in actuarial liability restructuring; reduces motor insurance premiums by 10-20% once RAF replaced; R30-50bn in long-term fiscal risk reduction', source_url = 'https://www.raf.co.za/about-the-raf' WHERE id = 78;

UPDATE policy_ideas SET economic_impact_estimate = '0.3-0.6% GDP from rail logistics cost reduction; road-to-rail shift reduces freight costs by 15-25%; R30-60bn annual logistics savings to mining and agriculture', source_url = 'https://www.transnet.net/BusinessWithTransnet/TFR/Pages/Freight-Rail-Reform.aspx' WHERE id = 79;

UPDATE policy_ideas SET economic_impact_estimate = '0.2-0.4% GDP from port efficiency gains; R20-40bn annual trade facilitation savings; reducing average container dwell time from 4-5 days to 2-3 days', source_url = 'https://www.transnet.net/BusinessWithTransnet/TPT/Pages/Port-Productivity.aspx' WHERE id = 80;

UPDATE policy_ideas SET economic_impact_estimate = 'R20-40bn in stable road funding secured; prevents R50-100bn in deferred maintenance cost accumulation; road quality improvement reduces vehicle operating costs by R5-10bn', source_url = 'https://www.sanral.co.za/news/road-funding-model' WHERE id = 81;

UPDATE policy_ideas SET economic_impact_estimate = 'R2-5bn in rail safety compliance investment; prevents R10-30bn in accident-related infrastructure losses; enables Transnet and PRASA operational expansion', source_url = 'https://www.rsr.org.za/about-the-rsr' WHERE id = 82;

UPDATE policy_ideas SET economic_impact_estimate = 'R10-20bn in formalised taxi industry economic activity; R3-8bn in efficiency gains from digital integration; 300,000 taxi operator livelihoods stabilised', source_url = 'https://www.dot.gov.za/public-transport/minibus-taxi' WHERE id = 83;

UPDATE policy_ideas SET economic_impact_estimate = '0.1-0.3% GDP from urban mobility productivity gains; R15-30bn in congestion cost reduction; 500,000+ daily users enabled in 8 major cities', source_url = 'https://www.dot.gov.za/public-transport/iptn' WHERE id = 84;

UPDATE policy_ideas SET economic_impact_estimate = 'R10-25bn in maritime services and shipbuilding revenue; 5,000-10,000 maritime sector jobs; enables Coega and East London IDZ expansion', source_url = 'https://www.dotc.gov.za/maritime/' WHERE id = 85;

UPDATE policy_ideas SET economic_impact_estimate = '0.3-0.7% GDP long-run from improved literacy and numeracy outcomes; R30-60bn in lifetime earnings gains for 1M students per cohort achieving Grade R access', source_url = 'https://www.education.gov.za/BELA' WHERE id = 86;

UPDATE policy_ideas SET economic_impact_estimate = '0.2-0.5% GDP from improved school readiness reducing grade repetition; R10-20bn in lifetime earnings gains for 400,000 ECD children per cohort', source_url = 'https://www.education.gov.za/EarlyChildhoodDevelopment.aspx' WHERE id = 87;

UPDATE policy_ideas SET economic_impact_estimate = '0.5-1.0% GDP long-run from eliminating reading crisis; R50-100bn in lifetime human capital gains per annual cohort achieving functional literacy', source_url = 'https://www.education.gov.za/ReadingForMeaning.aspx' WHERE id = 88;

UPDATE policy_ideas SET economic_impact_estimate = '0.2-0.4% GDP long-run from improved STEM pass rates; 50,000-100,000 additional STEM graduates per year feeding technology and engineering sectors', source_url = 'https://www.education.gov.za/STEM-education' WHERE id = 89;

UPDATE policy_ideas SET economic_impact_estimate = 'R20-40bn in school infrastructure investment supporting 3M learners; 0.2-0.4% GDP from improved learning environment productivity over 10 years', source_url = 'https://www.education.gov.za/SchoolInfrastructure.aspx' WHERE id = 90;

UPDATE policy_ideas SET economic_impact_estimate = 'R10-15bn in annual NSNP savings from reformed procurement; reaches 9M+ learners; R3-5bn in leakage reduction from competitive tendering', source_url = 'https://www.education.gov.za/Programmes/NationalSchoolNutritionProgramme.aspx' WHERE id = 91;

UPDATE policy_ideas SET economic_impact_estimate = '0.1-0.3% GDP from mother-tongue literacy gains; 20-30% improvement in Grade 3 reading outcomes; R10-20bn in reduced grade repetition costs', source_url = 'https://www.education.gov.za/LanguagePolicy.aspx' WHERE id = 92;

UPDATE policy_ideas SET economic_impact_estimate = 'R5-10bn in school attendance gains; 500,000+ rural learners with reliable transport; reduces school dropout rate in rural areas by 10-15%', source_url = 'https://www.education.gov.za/LearnerTransport.aspx' WHERE id = 93;

UPDATE policy_ideas SET economic_impact_estimate = 'R5-15bn in long-term productivity gains from inclusive education; 600,000 learners with disabilities gain access; reduces lifetime welfare dependency by R10-20bn', source_url = 'https://www.education.gov.za/InclusiveEducation.aspx' WHERE id = 94;

UPDATE policy_ideas SET economic_impact_estimate = 'R3-8bn in operational savings from school consolidation; improves per-learner resource allocation by 15-25% in rural schools', source_url = 'https://www.education.gov.za/RuralSchools.aspx' WHERE id = 95;

UPDATE policy_ideas SET economic_impact_estimate = 'R10-25bn in government property revenue optimisation; R5-15bn in annual leasing cost savings from rationalised portfolio', source_url = 'https://www.dpwi.gov.za/Divisions/PMTE/Pages/default.aspx' WHERE id = 96;

UPDATE policy_ideas SET economic_impact_estimate = 'R5-10bn in DPWI procurement savings from system renewal; reduces infrastructure delivery delays by 20-30%; R10-20bn in avoided project overrun costs', source_url = 'https://www.dpwi.gov.za/about-DPWI/Pages/default.aspx' WHERE id = 97;

UPDATE policy_ideas SET economic_impact_estimate = '0.1-0.3% GDP from EPWP graduates transitioning to formal employment; R10-20bn in skills premium from reskilled EPWP participants', source_url = 'https://www.epwp.gov.za/' WHERE id = 98;

UPDATE policy_ideas SET economic_impact_estimate = 'R20-50bn in infrastructure cost savings from professional project management; reduces project time overruns from 40% average to under 10%', source_url = 'https://www.dpwi.gov.za/Programmes/IDMS/Pages/default.aspx' WHERE id = 99;

UPDATE policy_ideas SET economic_impact_estimate = 'R10-20bn in deferred maintenance cost prevention; extends government building asset life by 20-30 years; R5-10bn annual saving versus reactive repairs', source_url = 'https://www.dpwi.gov.za/Programmes/Maintenance/Pages/default.aspx' WHERE id = 100;

UPDATE policy_ideas SET economic_impact_estimate = 'R50-100bn in social infrastructure mobilised via PPPs; reduces government balance sheet pressure for schools, clinics, and courts; 0.2-0.4% GDP from accelerated delivery', source_url = 'https://www.treasury.gov.za/organisation/ppp/' WHERE id = 101;

UPDATE policy_ideas SET economic_impact_estimate = 'R5-10bn in energy cost savings for government building portfolio; reduces public sector carbon footprint by 20-30%; models private sector green building adoption', source_url = 'https://www.dpwi.gov.za/GreenBuildings' WHERE id = 102;

UPDATE policy_ideas SET economic_impact_estimate = '0.2-0.5% GDP from urban land release enabling 300,000-500,000 affordable housing units; R50-100bn in residential construction investment over 5 years', source_url = 'https://www.dhs.gov.za/content/urban-land-release' WHERE id = 103;

UPDATE policy_ideas SET economic_impact_estimate = '1.0-2.0% GDP long-run from universal healthcare coverage; requires R200-400bn in annual financing at full implementation; human capital gains from improved population health', source_url = 'https://www.health.gov.za/nhi/' WHERE id = 104;

UPDATE policy_ideas SET economic_impact_estimate = 'R8-15bn annually to replace lapsed PEPFAR funding; prevents 1.5-2M HIV/AIDS patient treatment disruptions; avoids R50-100bn in long-term AIDS pandemic economic costs', source_url = 'https://www.health.gov.za/hiv-aids/' WHERE id = 105;

UPDATE policy_ideas SET economic_impact_estimate = 'R5-10bn in annual healthcare worker salary mobilisation; 25,000-40,000 qualified unemployed workers deployed; improves public health facility doctor-patient ratios by 20-30%', source_url = 'https://www.health.gov.za/healthcare-workers/' WHERE id = 106;

UPDATE policy_ideas SET economic_impact_estimate = 'R5-10bn in TB treatment cost reduction; 300,000 annual TB cases at R30,000 average treatment cost; 0.2-0.4% GDP from improved workforce productivity', source_url = 'https://www.health.gov.za/tb/' WHERE id = 107;

UPDATE policy_ideas SET economic_impact_estimate = '0.1-0.3% GDP from PHC-driven early disease prevention reducing hospital costs; R15-30bn in avoided secondary care costs annually', source_url = 'https://www.health.gov.za/primary-health-care/' WHERE id = 108;

UPDATE policy_ideas SET economic_impact_estimate = 'R5-15bn in mental health economic productivity restored; 3-5M South Africans with untreated mental illness; depression-linked productivity loss of R30-50bn annually if unaddressed', source_url = 'https://www.health.gov.za/mental-health/' WHERE id = 109;

UPDATE policy_ideas SET economic_impact_estimate = 'R8-15bn in tobacco-related disease cost reduction over 10 years; reduces smoking prevalence by 3-5 percentage points; 0.1-0.2% GDP from reduced healthcare burden', source_url = 'https://www.health.gov.za/tobacco-control/' WHERE id = 110;

UPDATE policy_ideas SET economic_impact_estimate = 'R10-20bn in provincial health department efficiency gains; reduces service delivery cost overruns by 15-20%; improves health outcomes in 5-8 underperforming provinces', source_url = 'https://www.health.gov.za/provincial-health-departments/' WHERE id = 111;

UPDATE policy_ideas SET economic_impact_estimate = 'R5-15bn in private health market efficiency gains; reduces private sector medical inflation premium by 2-4 percentage points annually; benefits 8M medical aid members', source_url = 'https://www.healthmarketinquiry.co.za/' WHERE id = 112;

UPDATE policy_ideas SET economic_impact_estimate = 'R5-10bn in faster medicine registration enabling local generic manufacturing; reduces drug import costs by 10-15%; accelerates African medicine market access', source_url = 'https://www.sahpra.org.za/about-us/' WHERE id = 113;

UPDATE policy_ideas SET economic_impact_estimate = 'R5-15bn in SMME debt and dispute resolution annually; 50,000-100,000 SMMEs protected from unfair treatment; reduces SMME failure rate from late payment by 10-15%', source_url = 'https://www.dsbd.gov.za/smme-ombud/' WHERE id = 114;

UPDATE policy_ideas SET economic_impact_estimate = 'R50-100bn in annual SMME procurement from government enforcing 30% set-aside; 100,000-200,000 SMME jobs created; 0.2-0.4% GDP from SMME multiplier', source_url = 'https://www.gov.za/smme-procurement-set-aside' WHERE id = 115;

UPDATE policy_ideas SET economic_impact_estimate = 'R10-20bn in additional SMME loan financing annually; 30,000-50,000 growth-stage SMMEs financed; improves SMME GDP contribution from 35% toward 40%', source_url = 'https://www.sefa.org.za/about-sefa/' WHERE id = 116;

UPDATE policy_ideas SET economic_impact_estimate = '0.1-0.3% GDP from SMME compliance cost reduction; R5-10bn annually in saved SMME compliance time and cost; 200,000+ new formal business registrations per year', source_url = 'https://www.bizportal.gov.za/' WHERE id = 117;

UPDATE policy_ideas SET economic_impact_estimate = 'R2-5bn in legal cannabis and hemp industry revenue by 2030; 5,000-15,000 formal cannabis sector jobs; positions SA as an African hemp export hub', source_url = 'https://www.gov.za/cannabis-licencing' WHERE id = 118;

UPDATE policy_ideas SET economic_impact_estimate = 'R5-10bn in SMME productivity gains from digital tools and specialist hubs; 50,000-100,000 SMMEs digitally onboarded; reduces SMME 5-year failure rate by 5-10%', source_url = 'https://www.seda.org.za/digital-transformation' WHERE id = 119;

UPDATE policy_ideas SET economic_impact_estimate = 'R5-15bn in cooperative enterprise revenue; 300,000-500,000 members in viable cooperatives; 0.1-0.2% GDP from redirected cooperative development spending to outcome-based models', source_url = 'https://www.dsbd.gov.za/cooperatives/' WHERE id = 120;

UPDATE policy_ideas SET economic_impact_estimate = '0.1-0.2% GDP from informal economy formalisation; R10-20bn in new tax revenues from 3M+ informal traders formalised; reduces street trading conflict by 30-40%', source_url = 'https://www.sars.gov.za/businesses-and-employers/turnover-tax/' WHERE id = 121;

UPDATE policy_ideas SET economic_impact_estimate = 'R20-40bn in SMME revenues from corporate supply chains; 50,000-80,000 SME suppliers linked to formal supply chains; 0.2-0.4% GDP from SMME-corporate linkage multiplier', source_url = 'https://www.thedtic.gov.za/financial-and-non-financial-support/incentive-programmes/enterprise-and-supplier-development/' WHERE id = 122;

UPDATE policy_ideas SET economic_impact_estimate = 'R5-15bn in green transition SMME financing; 10,000-20,000 clean energy and energy efficiency SMMEs supported; enables SMME participation in R300bn+ JET economy', source_url = 'https://www.gov.za/just-energy-transition' WHERE id = 123;
