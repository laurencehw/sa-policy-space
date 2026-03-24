/**
 * Validates the JSON data files that the app reads at runtime.
 * These files ARE tracked in git, so this test always runs — even in CI.
 */
import fs from "fs";
import path from "path";

// Find the data directory relative to this test file or via env var
function findDataDir(): string {
  if (process.env.SQLITE_DB_PATH) {
    return path.dirname(process.env.SQLITE_DB_PATH);
  }
  // Walk up from __tests__/data/ to find data/
  const candidates = [
    path.resolve(__dirname, "../../data"),
    path.resolve(__dirname, "../../../data"),
    path.resolve(process.cwd(), "data"),
  ];
  for (const c of candidates) {
    if (fs.existsSync(path.join(c, "reform_packages.json"))) return c;
  }
  throw new Error("Cannot locate data directory");
}

let DATA_DIR: string;
try {
  DATA_DIR = findDataDir();
} catch {
  DATA_DIR = "";
}

function readJson(filename: string): unknown {
  return JSON.parse(fs.readFileSync(path.join(DATA_DIR, filename), "utf-8"));
}

describe("reform_packages.json", () => {
  beforeAll(() => {
    if (!DATA_DIR) throw new Error("Data directory not found");
  });

  it("parses without error", () => {
    expect(() => readJson("reform_packages.json")).not.toThrow();
  });

  it("contains exactly 5 reform packages", () => {
    const data = readJson("reform_packages.json") as Record<string, unknown>;
    expect(Object.keys(data)).toHaveLength(5);
  });

  it("each package has required fields", () => {
    const data = readJson("reform_packages.json") as Record<
      string,
      Record<string, unknown>
    >;
    for (const [key, pkg] of Object.entries(data)) {
      expect(typeof pkg.package_id).toBe("number");
      expect(typeof pkg.name).toBe("string");
      expect(typeof pkg.tagline).toBe("string");
      expect(typeof pkg.theory_of_change).toBe("string");
      expect(Array.isArray(pkg.idea_ids)).toBe(true);
      expect((pkg.idea_ids as number[]).length).toBeGreaterThan(0);
      // package_id should match the key
      expect(String(pkg.package_id)).toBe(key);
    }
  });

  it("idea_ids are positive integers with no duplicates within a package", () => {
    const data = readJson("reform_packages.json") as Record<
      string,
      { idea_ids: number[] }
    >;
    for (const pkg of Object.values(data)) {
      const seen = new Set<number>();
      for (const id of pkg.idea_ids) {
        expect(id).toBeGreaterThan(0);
        expect(Number.isInteger(id)).toBe(true);
        expect(seen.has(id)).toBe(false);
        seen.add(id);
      }
    }
  });
});

describe("dependency_graph.json", () => {
  beforeAll(() => {
    if (!DATA_DIR) throw new Error("Data directory not found");
  });

  it("parses without error", () => {
    expect(() => readJson("dependency_graph.json")).not.toThrow();
  });

  it("has nodes and links arrays", () => {
    const data = readJson("dependency_graph.json") as {
      nodes: unknown[];
      links: unknown[];
    };
    expect(Array.isArray(data.nodes)).toBe(true);
    expect(Array.isArray(data.links)).toBe(true);
    expect(data.nodes.length).toBeGreaterThan(0);
  });

  it("every node has an id and title", () => {
    const { nodes } = readJson("dependency_graph.json") as {
      nodes: Array<{ id: unknown; title: unknown }>;
    };
    for (const node of nodes) {
      expect(typeof node.id).toBe("number");
      expect(typeof node.title).toBe("string");
      expect((node.title as string).length).toBeGreaterThan(0);
    }
  });

  it("every link references valid node IDs", () => {
    const { nodes, links } = readJson("dependency_graph.json") as {
      nodes: Array<{ id: number }>;
      links: Array<{ source: number; target: number; label: string }>;
    };
    const nodeIds = new Set(nodes.map((n) => n.id));
    for (const link of links) {
      expect(nodeIds.has(link.source)).toBe(true);
      expect(nodeIds.has(link.target)).toBe(true);
      expect(typeof link.label).toBe("string");
    }
  });

  it("node IDs are unique", () => {
    const { nodes } = readJson("dependency_graph.json") as {
      nodes: Array<{ id: number }>;
    };
    const ids = nodes.map((n) => n.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("implementation_plans.json", () => {
  beforeAll(() => {
    if (!DATA_DIR) throw new Error("Data directory not found");
  });

  it("parses without error", () => {
    expect(() => readJson("implementation_plans.json")).not.toThrow();
  });

  it("is a non-empty object", () => {
    const data = readJson("implementation_plans.json") as Record<
      string,
      unknown
    >;
    expect(Object.keys(data).length).toBeGreaterThan(0);
  });
});

describe("international_comparisons.json", () => {
  beforeAll(() => {
    if (!DATA_DIR) throw new Error("Data directory not found");
  });

  it("parses without error", () => {
    expect(() => readJson("international_comparisons.json")).not.toThrow();
  });

  it("has a comparisons array", () => {
    const data = readJson("international_comparisons.json") as {
      comparisons: unknown[];
    };
    expect(Array.isArray(data.comparisons)).toBe(true);
    expect(data.comparisons.length).toBeGreaterThan(0);
  });

  it("each comparison has required fields", () => {
    const { comparisons } = readJson("international_comparisons.json") as {
      comparisons: Array<Record<string, unknown>>;
    };
    for (const c of comparisons) {
      expect(typeof c.country).toBe("string");
      expect(typeof c.binding_constraint).toBe("string");
      expect(typeof c.title).toBe("string");
    }
  });
});
