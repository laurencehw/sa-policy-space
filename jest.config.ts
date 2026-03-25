import type { Config } from "jest";

const config: Config = {
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: {
          module: "CommonJS",
          moduleResolution: "node",
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
          jsx: "react-jsx",
        },
        // Skip type-checking for speed — tests are a safety net, not a type checker
        diagnostics: false,
      },
    ],
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  testMatch: ["**/__tests__/**/*.test.ts", "**/__tests__/**/*.test.tsx"],
  setupFiles: ["<rootDir>/__tests__/setup.ts"],
  // Verbose output shows each test name
  verbose: true,
};

export default config;
