import type { QueryParam } from '@/db/postgres';

/**
 * Collects WHERE-clause fragments and their bound values while keeping
 * `$n` placeholders in sync. Values are always parameterised — never interpolated.
 */
export class SqlConditionBuilder {
  private readonly clauses: string[] = [];
  private readonly values: QueryParam[] = [];

  /** Adds a clause; `toClause` receives the placeholder (e.g. `$3`) for `value`. */
  public add(value: QueryParam | undefined, toClause: (placeholder: string) => string): this {
    if (value === undefined) {
      return this;
    }
    this.values.push(value);
    this.clauses.push(toClause(`$${this.values.length}`));
    return this;
  }

  /** Reserves the next placeholder for a value used outside the WHERE clause (LIMIT, OFFSET…). */
  public bind(value: QueryParam): string {
    this.values.push(value);
    return `$${this.values.length}`;
  }

  public toWhere(): string {
    return this.clauses.length > 0 ? `WHERE ${this.clauses.join(' AND ')}` : '';
  }

  public getValues(): readonly QueryParam[] {
    return [...this.values];
  }
}
