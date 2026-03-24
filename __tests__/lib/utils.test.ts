import { slugify } from "@/lib/utils";

describe("slugify", () => {
  it("lowercases and replaces spaces with hyphens", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("strips special characters", () => {
    expect(slugify("Transport Economic Regulator: Operationalising the EROT Act")).toBe(
      "transport-economic-regulator-operationalising-the-erot-act"
    );
  });

  it("collapses multiple hyphens", () => {
    expect(slugify("A  B---C")).toBe("a-b-c");
  });

  it("trims leading and trailing hyphens", () => {
    expect(slugify("  hello world  ")).toBe("hello-world");
  });

  it("handles ampersands and slashes", () => {
    expect(slugify("Ports & Rail Reform")).toBe("ports-rail-reform");
  });

  it("handles already-slug strings", () => {
    expect(slugify("already-a-slug")).toBe("already-a-slug");
  });

  it("handles numbers", () => {
    expect(slugify("Policy 42 Review")).toBe("policy-42-review");
  });

  it("returns empty string for empty input", () => {
    expect(slugify("")).toBe("");
  });

  it("handles strings with only special characters", () => {
    expect(slugify("!!!")).toBe("");
  });
});
