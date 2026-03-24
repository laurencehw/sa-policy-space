/**
 * Jest global setup — runs before each test file.
 * Sets SQLITE_DB_PATH so local-api.ts can find a populated SQLite database.
 *
 * The DB is gitignored. If it can't be found, DB-dependent tests
 * skip themselves gracefully (see the dbDescribe helper in local-api.test.ts).
 *
 * Priority: policy_ideas.db (rich data) > dev.sqlite3 (fresh init)
 */
import fs from "fs";
import path from "path";

function findDb(): string | null {
  // Walk up the directory tree to find the data/ folder
  const roots = [
    process.cwd(),
    path.resolve(process.cwd(), ".."),
    path.resolve(process.cwd(), "../.."),
    path.resolve(process.cwd(), "../../.."),
  ];

  for (const root of roots) {
    const dataDir = path.join(root, "data");
    if (!fs.existsSync(dataDir)) continue;
    // Prefer policy_ideas.db (fuller dataset) then dev.sqlite3
    for (const name of ["policy_ideas.db", "dev.sqlite3"]) {
      const p = path.join(dataDir, name);
      if (fs.existsSync(p)) return p;
    }
  }
  return null;
}

if (!process.env.SQLITE_DB_PATH) {
  const found = findDb();
  if (found) {
    process.env.SQLITE_DB_PATH = found;
  }
}
