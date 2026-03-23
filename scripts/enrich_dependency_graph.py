"""
Phase 4B: Densify the dependency graph.
Adds ~152 new edges to the existing 59, targeting 200+ total.

Edge types:
  enables     - source reform creates conditions for target to succeed
  depends_on  - target reform requires source to function
  tension     - source and target create policy tradeoffs
"""
import json
import os

GRAPH_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "dependency_graph.json")

NEW_EDGES = [
    # ── ENERGY INFRASTRUCTURE INTERNAL ──────────────────────────────────────
    {"source": 35, "target": 42, "type": "enables",
     "label": "IRP 2024 provides market mandate for competitive electricity market"},
    {"source": 35, "target": 38, "type": "enables",
     "label": "IRP 2024 informs cost-reflective tariff structure design"},
    {"source": 35, "target": 36, "type": "enables",
     "label": "IRP 2024 determines role of nuclear in the energy mix"},
    {"source": 35, "target": 37, "type": "enables",
     "label": "IRP 2024 nuclear share decision triggers new build programme"},
    {"source": 40, "target": 42, "type": "depends_on",
     "label": "NERSA independence is prerequisite for competitive electricity market credibility"},
    {"source": 58, "target": 62, "type": "enables",
     "label": "Eskom unbundling creates the National Transmission Company as separate entity"},
    {"source": 62, "target": 42, "type": "enables",
     "label": "Independent NTC enables functional competitive generation market"},
    {"source": 48, "target": 36, "type": "depends_on",
     "label": "Nuclear regulator capacity enables Koeberg long-term extension oversight"},
    {"source": 48, "target": 37, "type": "depends_on",
     "label": "Nuclear regulator capacity is prerequisite for new build programme safety oversight"},
    {"source": 44, "target": 39, "type": "enables",
     "label": "Upstream petroleum development data informs Integrated Energy Plan gas strategy"},
    {"source": 39, "target": 43, "type": "enables",
     "label": "Integrated Energy Plan drives gas infrastructure investment and import decisions"},
    {"source": 43, "target": 6,  "type": "enables",
     "label": "LNG backup energy supply enables reliable production for green hydrogen facilities"},
    {"source": 41, "target": 20, "type": "enables",
     "label": "Solar water heater demand reduction creates headroom for industrial energy self-generation"},

    # ── TRANSPORT / LOGISTICS INTERNAL ──────────────────────────────────────
    {"source": 77, "target": 59, "type": "enables",
     "label": "Transport Economic Regulator provides oversight framework for Transnet PSP"},
    {"source": 77, "target": 80, "type": "enables",
     "label": "EROT provides price regulation framework for port services"},
    {"source": 82, "target": 76, "type": "depends_on",
     "label": "Railway safety regulator enforces PRASA safety standards for rolling stock"},
    {"source": 82, "target": 79, "type": "depends_on",
     "label": "Railway safety regulator oversees third-party access safety compliance"},
    {"source": 79, "target": 80, "type": "enables",
     "label": "Freight rail track separation enables dedicated port productivity corridors"},
    {"source": 84, "target": 83, "type": "enables",
     "label": "Integrated public transport network incorporates and formalises minibus taxi operations"},
    {"source": 85, "target": 80, "type": "enables",
     "label": "Merchant shipping development increases port throughput utilisation"},

    # ── SMME & EMPLOYMENT INTERNAL ──────────────────────────────────────────
    {"source": 117, "target": 119, "type": "enables",
     "label": "BizPortal platform infrastructure supports SEDA digital transformation"},
    {"source": 117, "target": 121, "type": "enables",
     "label": "BizPortal enables streamlined informal economy business registration"},
    {"source": 114, "target": 115, "type": "enables",
     "label": "SMME Ombud enforcement builds credibility of 30% procurement set-aside"},
    {"source": 114, "target": 122, "type": "enables",
     "label": "Ombud service provides dispute resolution protecting enterprise development participants"},
    {"source": 115, "target": 116, "type": "enables",
     "label": "Government procurement set-aside creates loan demand enabling SEFA mandate refocus"},
    {"source": 119, "target": 122, "type": "enables",
     "label": "SEDA specialist hubs connect SMMEs to corporate supply chains"},
    {"source": 120, "target": 31,  "type": "enables",
     "label": "Cooperative development programme expands cooperative banking clientele"},
    {"source": 121, "target": 31,  "type": "enables",
     "label": "Informal economy formalisation creates new cooperative banking members"},
    {"source": 27,  "target": 116, "type": "enables",
     "label": "Land Bank agricultural finance model informs SEFA rural SMME finance approach"},
    {"source": 11,  "target": 117, "type": "enables",
     "label": "SMME regulatory burden reduction creates political mandate for BizPortal integration"},

    # ── HUMAN CAPITAL INTERNAL ───────────────────────────────────────────────
    {"source": 92,  "target": 88, "type": "enables",
     "label": "Mother-tongue instruction improves cognitive foundation for national literacy programme"},
    {"source": 88,  "target": 51, "type": "enables",
     "label": "Foundation literacy is prerequisite for effective TVET participation"},
    {"source": 88,  "target": 56, "type": "enables",
     "label": "Foundation literacy enables effective adult second-chance education outcomes"},
    {"source": 50,  "target": 51, "type": "enables",
     "label": "NSFAS sustainable funding enables TVET college enrollment at scale"},
    {"source": 50,  "target": 56, "type": "enables",
     "label": "NSFAS funding enables CET second-chance programme participation"},
    {"source": 52,  "target": 57, "type": "enables",
     "label": "SETA reform redirects skills levy funds to energy transition skills training"},
    {"source": 52,  "target": 16, "type": "enables",
     "label": "SETA reform funds 4IR digital skills development pipeline"},
    {"source": 69,  "target": 54, "type": "enables",
     "label": "STI Decadal Plan operationalises and targets R&D investment escalation to 1.5% GDP"},
    {"source": 69,  "target": 72, "type": "enables",
     "label": "STI plan provides mandate and framework for NRF bursary reform"},
    {"source": 72,  "target": 54, "type": "enables",
     "label": "NRF bursary reform expands research workforce contributing to R&D investment targets"},
    {"source": 87,  "target": 92, "type": "enables",
     "label": "ECD function shift to DBE enables coherent multilingual early childhood education"},
    {"source": 106, "target": 104, "type": "enables",
     "label": "Healthcare worker employment strengthens NHI delivery capacity on the ground"},
    {"source": 104, "target": 106, "type": "enables",
     "label": "NHI roadmap creates formal mandate for healthcare worker absorption programme"},
    {"source": 113, "target": 104, "type": "depends_on",
     "label": "SAHPRA medicines regulation strengthens NHI pharmaceutical procurement credibility"},
    {"source": 112, "target": 104, "type": "depends_on",
     "label": "Health market inquiry reforms are precondition for NHI insurance market functioning"},
    {"source": 90,  "target": 88, "type": "enables",
     "label": "School infrastructure provides physical space for literacy programme delivery"},
    {"source": 91,  "target": 88, "type": "enables",
     "label": "School nutrition improves cognitive capacity and attendance for literacy"},
    {"source": 93,  "target": 88, "type": "enables",
     "label": "Learner transport ensures school attendance enabling literacy programme delivery"},
    {"source": 95,  "target": 90, "type": "enables",
     "label": "Rural school consolidation triggers school infrastructure acceleration in rural areas"},
    {"source": 107, "target": 106, "type": "enables",
     "label": "TB programme workers qualify for healthcare worker absorption programme"},
    {"source": 55,  "target": 50, "type": "depends_on",
     "label": "NSFAS fraud prevention system reform is prerequisite for sustainable NSFAS funding model"},

    # ── STATE CAPACITY & GOVERNANCE INTERNAL ────────────────────────────────
    {"source": 29,  "target": 21, "type": "enables",
     "label": "NCOP AML monitoring strengthens sustainability of FATF exit conditions"},
    {"source": 24,  "target": 26, "type": "enables",
     "label": "SARS capacity data provides accurate revenue baseline for spending review"},
    {"source": 26,  "target": 23, "type": "enables",
     "label": "Inclusive growth spending review delivers expenditure reform enabling fiscal consolidation"},
    {"source": 23,  "target": 61, "type": "enables",
     "label": "Fiscal consolidation framework drives Eskom debt relief conditionality"},
    {"source": 25,  "target": 101, "type": "enables",
     "label": "PPP financing reform enables social infrastructure PPP regulatory framework"},
    {"source": 30,  "target": 34, "type": "enables",
     "label": "Municipal fiscal powers amendment connects to intergovernmental equitable share reform"},
    {"source": 60,  "target": 65, "type": "enables",
     "label": "SOE policy reform enables SAA successor entity viability through PFMA flexibility"},
    {"source": 60,  "target": 63, "type": "enables",
     "label": "SOE policy reform provides framework for Denel strategic equity partnership"},
    {"source": 22,  "target": 23, "type": "enables",
     "label": "Two-pot pension reform reduces pension fund contingent claims on fiscal resources"},
    {"source": 28,  "target": 23, "type": "enables",
     "label": "Carbon tax revenue contributes additional resources for fiscal consolidation"},
    {"source": 97,  "target": 99, "type": "depends_on",
     "label": "DPWI enterprise renewal is prerequisite for IDMS professional management deployment"},
    {"source": 55,  "target": 23, "type": "enables",
     "label": "NSFAS fraud prevention reduces contingent fiscal liabilities improving consolidation"},
    {"source": 61,  "target": 62, "type": "enables",
     "label": "Eskom debt relief frees fiscal space for National Transmission Company capitalisation"},
    {"source": 21,  "target": 23, "type": "enables",
     "label": "FATF exit reduces sovereign risk premium improving fiscal consolidation conditions"},
    {"source": 23,  "target": 34, "type": "enables",
     "label": "Fiscal consolidation review triggers equitable share formula reform"},
    {"source": 24,  "target": 28, "type": "enables",
     "label": "SARS capacity expansion strengthens carbon tax compliance and collection"},
    {"source": 28,  "target": 116, "type": "enables",
     "label": "Carbon tax revenue recycling creates funding channel for SEFA green energy finance"},
    {"source": 28,  "target": 123, "type": "enables",
     "label": "Carbon tax revenue recycling provides seed capital for JET SMME Finance Facility"},

    # ── CROSS-PACKAGE: Infrastructure → Trade & Industrial ──────────────────
    {"source": 20,  "target": 10, "type": "enables",
     "label": "Reliable energy enables domestic poultry production cost competitiveness"},
    {"source": 20,  "target": 45, "type": "enables",
     "label": "Reliable energy enables large-scale minerals beneficiation at economic cost"},
    {"source": 20,  "target": 9,  "type": "enables",
     "label": "Reliable energy makes Special Economic Zones viable for energy-intensive manufacturing"},
    {"source": 49,  "target": 45, "type": "enables",
     "label": "Grid expansion enables electrification of mining and beneficiation operations"},
    {"source": 59,  "target": 7,  "type": "enables",
     "label": "Transnet rail efficiency reduces steel input logistics costs for manufacturers"},
    {"source": 59,  "target": 8,  "type": "enables",
     "label": "Transnet rail enables reliable R-CTFL textile export logistics"},
    {"source": 59,  "target": 18, "type": "enables",
     "label": "Transnet rail reduces automotive component supply chain costs"},
    {"source": 80,  "target": 8,  "type": "enables",
     "label": "Port efficiency enables R-CTFL textile export competitiveness"},
    {"source": 80,  "target": 18, "type": "enables",
     "label": "Port efficiency enables automotive export supply chain reliability"},
    {"source": 80,  "target": 7,  "type": "enables",
     "label": "Port efficiency enables iron ore and steel product exports"},
    {"source": 42,  "target": 5,  "type": "enables",
     "label": "Competitive electricity market enables EV charging infrastructure economics"},
    {"source": 20,  "target": 15, "type": "enables",
     "label": "Energy reliability makes BBBEE equity investments in manufacturing viable"},

    # ── CROSS-PACKAGE: Infrastructure → SMME ────────────────────────────────
    {"source": 20,  "target": 123, "type": "enables",
     "label": "Reliable energy enables JET SMME Finance Facility beneficiaries to operate"},
    {"source": 49,  "target": 123, "type": "enables",
     "label": "Renewable energy expansion creates SMME contracting opportunities in installation"},
    {"source": 59,  "target": 122, "type": "enables",
     "label": "Reliable freight rail creates supply chain market for SMME enterprise development"},

    # ── CROSS-PACKAGE: Infrastructure → Human Capital ────────────────────────
    {"source": 20,  "target": 106, "type": "enables",
     "label": "Reliable energy enables proper functioning of healthcare facilities for workers"},
    {"source": 20,  "target": 90,  "type": "enables",
     "label": "Energy reliability enables school digital infrastructure and operations"},
    {"source": 84,  "target": 93,  "type": "enables",
     "label": "Integrated public transport provides learner school transport infrastructure"},
    {"source": 84,  "target": 106, "type": "enables",
     "label": "Public transport network enables healthcare worker commuting to facilities"},

    # ── CROSS-PACKAGE: Infrastructure → State Capacity ───────────────────────
    {"source": 58,  "target": 61, "type": "enables",
     "label": "Eskom unbundling progress is tracked through and shapes debt relief conditions"},
    {"source": 62,  "target": 25, "type": "enables",
     "label": "Independent NTC creates new PPP concession opportunities for infrastructure finance"},

    # ── CROSS-PACKAGE: Trade → Infrastructure ────────────────────────────────
    {"source": 45,  "target": 49, "type": "enables",
     "label": "Critical minerals export volumes justify grid expansion investment to mining regions"},
    {"source": 4,   "target": 59, "type": "enables",
     "label": "AfCFTA trade volumes justify Transnet rail and port expansion investment"},
    {"source": 3,   "target": 80, "type": "enables",
     "label": "AGOA export requirements create demand for port productivity improvement"},

    # ── CROSS-PACKAGE: Trade → SMME ──────────────────────────────────────────
    {"source": 9,   "target": 115, "type": "enables",
     "label": "SEZ zones create government procurement opportunities for SMME suppliers"},
    {"source": 9,   "target": 122, "type": "enables",
     "label": "SEZ zones create supply chain enterprise development opportunities for SMMEs"},
    {"source": 45,  "target": 123, "type": "enables",
     "label": "Critical minerals sector growth creates SMME opportunities in JET finance"},
    {"source": 8,   "target": 122, "type": "enables",
     "label": "R-CTFL master plan creates supplier development linkages for SMME textile firms"},
    {"source": 18,  "target": 122, "type": "enables",
     "label": "Automotive APDP Phase 2 creates enterprise development supply chains for SMMEs"},
    {"source": 5,   "target": 123, "type": "enables",
     "label": "EV white paper creates SMME opportunities in green transition finance"},

    # ── CROSS-PACKAGE: Trade → Human Capital ─────────────────────────────────
    {"source": 5,   "target": 57, "type": "enables",
     "label": "EV transition creates demand for advanced automotive manufacturing skills"},
    {"source": 45,  "target": 51, "type": "enables",
     "label": "Critical minerals beneficiation creates demand for mining TVET artisans"},
    {"source": 18,  "target": 51, "type": "enables",
     "label": "Automotive manufacturing sector demand drives TVET artisan training"},
    {"source": 8,   "target": 51, "type": "enables",
     "label": "R-CTFL manufacturing sector demand drives TVET textile skills development"},
    {"source": 7,   "target": 51, "type": "enables",
     "label": "Steel and metal fabrication sector creates demand for TVET artisans"},

    # ── CROSS-PACKAGE: Trade → State Capacity ────────────────────────────────
    {"source": 4,   "target": 21, "type": "depends_on",
     "label": "AfCFTA payment system participation requires FATF exit AML/CFT compliance"},
    {"source": 14,  "target": 9,  "type": "enables",
     "label": "Localisation designation policy creates demand for SEZ-based production facilities"},
    {"source": 14,  "target": 8,  "type": "enables",
     "label": "Localisation designation directly supports R-CTFL master plan implementation"},
    {"source": 14,  "target": 18, "type": "enables",
     "label": "Localisation designation supports automotive APDP Phase 2 enhancement"},
    {"source": 14,  "target": 45, "type": "enables",
     "label": "Localisation designation supports minerals beneficiation investment commitments"},

    # ── CROSS-PACKAGE: SMME → Infrastructure ─────────────────────────────────
    {"source": 31,  "target": 25, "type": "enables",
     "label": "Cooperative banking mobilises community savings capital for infrastructure finance"},

    # ── CROSS-PACKAGE: SMME → Human Capital ──────────────────────────────────
    {"source": 98,  "target": 51, "type": "enables",
     "label": "EPWP reform creates pathway to TVET skills certification for workers"},
    {"source": 98,  "target": 56, "type": "enables",
     "label": "EPWP reform provides second-chance education pathway connecting to CET programme"},
    {"source": 121, "target": 56, "type": "enables",
     "label": "Informal economy integration creates formal adult education demand"},
    {"source": 119, "target": 16, "type": "enables",
     "label": "SEDA digital transformation uses and creates demand for 4IR skills training"},

    # ── CROSS-PACKAGE: SMME → Trade ──────────────────────────────────────────
    {"source": 11,  "target": 4,  "type": "enables",
     "label": "SMME regulatory deregulation enables more firms to participate in AfCFTA trade"},
    {"source": 115, "target": 14, "type": "enables",
     "label": "Government SMME procurement enforcement enables localisation policy implementation"},
    {"source": 31,  "target": 19, "type": "enables",
     "label": "Cooperative banking can facilitate BRICS+ alternative payment processing"},

    # ── CROSS-PACKAGE: SMME → State Capacity ─────────────────────────────────
    {"source": 121, "target": 24, "type": "enables",
     "label": "Informal economy formalisation expands SARS tax base and compliance"},
    {"source": 117, "target": 24, "type": "enables",
     "label": "BizPortal business registration data improves SARS compliance monitoring"},

    # ── CROSS-PACKAGE: Human Capital → Infrastructure ────────────────────────
    {"source": 51,  "target": 58, "type": "enables",
     "label": "TVET artisans are needed for Eskom restructuring and new infrastructure builds"},
    {"source": 57,  "target": 49, "type": "enables",
     "label": "Advanced energy skills enable grid expansion project delivery at scale"},
    {"source": 89,  "target": 62, "type": "enables",
     "label": "STEM graduates provide engineers for National Transmission Company grid expansion"},

    # ── CROSS-PACKAGE: Human Capital → Trade ─────────────────────────────────
    {"source": 51,  "target": 8,  "type": "enables",
     "label": "TVET textile skills improve R-CTFL manufacturing competitiveness"},
    {"source": 51,  "target": 18, "type": "enables",
     "label": "TVET artisans feed automotive manufacturing productivity improvement"},
    {"source": 57,  "target": 5,  "type": "enables",
     "label": "Energy transition skills support EV white paper manufacturing implementation"},
    {"source": 16,  "target": 71, "type": "enables",
     "label": "4IR skills pipeline provides researchers for CSIR digital capabilities programme"},
    {"source": 72,  "target": 69, "type": "enables",
     "label": "NRF bursary reform produces research talent for STI Decadal Plan implementation"},

    # ── CROSS-PACKAGE: Human Capital → SMME ──────────────────────────────────
    {"source": 51,  "target": 98, "type": "enables",
     "label": "TVET skills certification connects to EPWP reform exit pathway for workers"},

    # ── CROSS-PACKAGE: Human Capital → State Capacity ────────────────────────
    {"source": 51,  "target": 99, "type": "enables",
     "label": "TVET artisans are needed for infrastructure delivery management system projects"},
    {"source": 53,  "target": 55, "type": "enables",
     "label": "University certification backlog clearance enables NSFAS fraud detection auditing"},

    # ── CROSS-PACKAGE: State Capacity → Infrastructure ───────────────────────
    {"source": 24,  "target": 62, "type": "enables",
     "label": "SARS revenue recovery creates fiscal space for NTC capitalisation"},
    {"source": 25,  "target": 59, "type": "enables",
     "label": "PPP infrastructure finance enables Transnet private sector participation"},
    {"source": 25,  "target": 76, "type": "enables",
     "label": "PPP financing enables PRASA rolling stock and infrastructure procurement"},
    {"source": 25,  "target": 80, "type": "enables",
     "label": "PPP financing enables port concession and productivity investment arrangements"},
    {"source": 34,  "target": 84, "type": "enables",
     "label": "Equitable share formula reform funds municipal public transport contributions"},
    {"source": 101, "target": 84, "type": "enables",
     "label": "PPP regulatory reform for social infrastructure includes public transport PPPs"},

    # ── CROSS-PACKAGE: State Capacity → SMME ─────────────────────────────────
    {"source": 23,  "target": 116, "type": "enables",
     "label": "Fiscal consolidation creates stable macroeconomic environment for SEFA lending"},
    {"source": 24,  "target": 121, "type": "enables",
     "label": "SARS capacity expansion improves informal economy tax integration monitoring"},
    {"source": 30,  "target": 121, "type": "enables",
     "label": "Municipal fiscal powers enable municipal trading infrastructure for informal traders"},
    {"source": 14,  "target": 115, "type": "enables",
     "label": "Localisation designation policy directly supports 30% procurement set-aside enforcement"},
    {"source": 34,  "target": 103, "type": "enables",
     "label": "Equitable share formula reform can direct metro funding to urban land release"},

    # ── CROSS-PACKAGE: State Capacity → Human Capital ────────────────────────
    {"source": 24,  "target": 50, "type": "enables",
     "label": "SARS revenue recovery improves fiscal sustainability of NSFAS funding model"},
    {"source": 25,  "target": 90, "type": "enables",
     "label": "PPP financing can fund school infrastructure projects through social concessions"},
    {"source": 34,  "target": 90, "type": "enables",
     "label": "Equitable share formula reform directs provincial funding to school infrastructure"},
    {"source": 111, "target": 55, "type": "enables",
     "label": "Provincial health turnaround enables systemic accountability for NSFAS-equivalent fraud prevention"},

    # ── CROSS-PACKAGE: State Capacity → Trade ────────────────────────────────
    {"source": 21,  "target": 15, "type": "enables",
     "label": "FATF exit improves investor confidence enabling BBBEE EEIP foreign investment"},
    {"source": 23,  "target": 45, "type": "enables",
     "label": "Fiscal consolidation enables government co-investment in minerals beneficiation strategy"},
    {"source": 25,  "target": 9,  "type": "enables",
     "label": "PPP financing enables Special Economic Zone infrastructure development"},

    # ── ADDITIONAL TRADE LINKS ────────────────────────────────────────────────
    {"source": 17,  "target": 10, "type": "enables",
     "label": "Anti-dumping surveillance modernisation enables more effective poultry industry protection"},
    {"source": 28,  "target": 6,  "type": "enables",
     "label": "Carbon tax creates market price incentive for green hydrogen investment"},

    # ── TENSION EDGES ─────────────────────────────────────────────────────────
    {"source": 37,  "target": 23, "type": "tension",
     "label": "Nuclear new build represents massive contingent fiscal liability threatening debt stabilisation"},
    {"source": 104, "target": 23, "type": "tension",
     "label": "NHI implementation carries massive fiscal risk undermining debt stabilisation path"},
    {"source": 28,  "target": 18, "type": "tension",
     "label": "Carbon tax raises manufacturing input costs affecting automotive sector competitiveness"},
    {"source": 10,  "target": 4,  "type": "tension",
     "label": "Poultry anti-dumping protection may conflict with AfCFTA trade liberalisation obligations"},
    {"source": 14,  "target": 4,  "type": "tension",
     "label": "Localisation policy creates tension with AfCFTA trade liberalisation obligations"},
    {"source": 23,  "target": 26, "type": "tension",
     "label": "Fiscal consolidation creates tension with inclusive growth spending priorities"},
]


def deduplicate(existing_links, new_edges):
    """Return only edges not already present in the graph."""
    seen = set()
    for link in existing_links:
        seen.add((link["source"], link["target"]))

    added = []
    for edge in new_edges:
        key = (edge["source"], edge["target"])
        if key not in seen:
            seen.add(key)
            added.append(edge)
        else:
            print(f"  SKIP (duplicate): {edge['source']} → {edge['target']}")
    return added


def main():
    with open(GRAPH_PATH, "r", encoding="utf-8") as f:
        graph = json.load(f)

    existing_links = graph["links"]
    print(f"Existing edges: {len(existing_links)}")

    new_to_add = deduplicate(existing_links, NEW_EDGES)
    print(f"New edges to add: {len(new_to_add)}")

    graph["links"] = existing_links + new_to_add
    print(f"Total edges after merge: {len(graph['links'])}")

    with open(GRAPH_PATH, "w", encoding="utf-8") as f:
        json.dump(graph, f, indent=2, ensure_ascii=False)

    print("Written:", GRAPH_PATH)

    # Summary by type
    counts = {}
    for link in graph["links"]:
        t = link.get("type", "legacy")
        counts[t] = counts.get(t, 0) + 1
    print("Edge type breakdown:", counts)


if __name__ == "__main__":
    main()
