/**
 * Type declarations for node:sqlite (stable in Node.js v24+).
 * Provides typed wrappers for DatabaseSync, StatementSync, and query results.
 */
declare module "node:sqlite" {
  export class DatabaseSync {
    constructor(path: string);
    prepare<T = Record<string, unknown>>(sql: string): StatementSync<T>;
    close(): void;
  }

  export interface StatementSync<T = Record<string, unknown>> {
    get(...params: unknown[]): T | undefined;
    all(...params: unknown[]): T[];
    run(...params: unknown[]): { changes: number; lastInsertRowid: number };
  }
}
