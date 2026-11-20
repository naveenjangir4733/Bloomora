import type { SqlExecutor } from '@/db/postgres';
import { SqlConditionBuilder } from '@/db/sql-builder';
import type { PaginatedResult } from '@/types/common.types';
import type { NewUser, User, UserChanges, UserFilters, UserRole } from '@/types/user.types';
import { buildPaginationMeta, toOffset } from '@/utils/pagination.util';

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

const USER_COLUMNS = 'id, name, email, role, is_active, created_at, updated_at';

const toUser = (row: UserRow): User => ({
  id: row.id,
  name: row.name,
  email: row.email,
  role: row.role,
  isActive: row.is_active,
  createdAt: row.created_at.toISOString(),
  updatedAt: row.updated_at.toISOString(),
});

export class UserRepository {
  constructor(private readonly db: SqlExecutor) {}

  public async findMany(filters: UserFilters): Promise<PaginatedResult<User>> {
    const conditions = new SqlConditionBuilder()
      .add(filters.search ? `%${filters.search}%` : undefined, (ph): string => `(name ILIKE ${ph} OR email ILIKE ${ph})`)
      .add(filters.role, (ph): string => `role = ${ph}`)
      .add(filters.isActive, (ph): string => `is_active = ${ph}`);
    const where = conditions.toWhere();

    const countResult = await this.db.query<{ total: number }>(
      `SELECT COUNT(*)::int AS total FROM users ${where}`,
      conditions.getValues(),
    );

    const limit = conditions.bind(filters.limit);
    const offset = conditions.bind(toOffset(filters));
    const dataResult = await this.db.query<UserRow>(
      `SELECT ${USER_COLUMNS} FROM users ${where} ORDER BY created_at DESC, id LIMIT ${limit} OFFSET ${offset}`,
      conditions.getValues(),
    );

    return {
      items: dataResult.rows.map(toUser),
      meta: buildPaginationMeta(countResult.rows[0]?.total ?? 0, filters),
    };
  }

  public async findById(id: string): Promise<User | null> {
    const result = await this.db.query<UserRow>(`SELECT ${USER_COLUMNS} FROM users WHERE id = $1`, [id]);
    const row = result.rows[0];
    return row ? toUser(row) : null;
  }

  public async existsByEmail(email: string, excludeId?: string): Promise<boolean> {
    const result = await this.db.query<{ exists: boolean }>(
      'SELECT EXISTS (SELECT 1 FROM users WHERE LOWER(email) = LOWER($1) AND id IS DISTINCT FROM $2) AS "exists"',
      [email, excludeId ?? null],
    );
    return result.rows[0]?.exists === true;
  }

  public async create(user: NewUser): Promise<User> {
    const result = await this.db.query<UserRow>(
      `INSERT INTO users (name, email, role, is_active) VALUES ($1, $2, $3, $4) RETURNING ${USER_COLUMNS}`,
      [user.name, user.email, user.role, user.isActive],
    );
    const row = result.rows[0];
    if (!row) {
      throw new Error('User insert returned no row');
    }
    return toUser(row);
  }

  public async update(id: string, changes: UserChanges): Promise<User | null> {
    const result = await this.db.query<UserRow>(
      `UPDATE users SET
         name      = COALESCE($2, name),
         email     = COALESCE($3, email),
         role      = COALESCE($4::user_role, role),
         is_active = COALESCE($5, is_active)
       WHERE id = $1
       RETURNING ${USER_COLUMNS}`,
      [id, changes.name ?? null, changes.email ?? null, changes.role ?? null, changes.isActive ?? null],
    );
    const row = result.rows[0];
    return row ? toUser(row) : null;
  }

  public async delete(id: string): Promise<boolean> {
    const result = await this.db.query('DELETE FROM users WHERE id = $1', [id]);
    return result.rowCount === 1;
  }
}
