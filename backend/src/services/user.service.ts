import type { UserRepository } from '@/repositories/user.repository';
import type { PaginatedResult } from '@/types/common.types';
import type { User } from '@/types/user.types';
import { AppError } from '@/utils/app-error.util';
import type { CreateUserDto, UpdateUserDto, UserQueryDto } from '@/validators/user.validator';

export class UserService {
  constructor(private readonly users: UserRepository) {}

  public list(query: UserQueryDto): Promise<PaginatedResult<User>> {
    return this.users.findMany(query);
  }

  public async getById(id: string): Promise<User> {
    const user = await this.users.findById(id);
    if (!user) {
      throw AppError.notFound(`User '${id}' not found`);
    }
    return user;
  }

  public async create(dto: CreateUserDto): Promise<User> {
    await this.assertEmailAvailable(dto.email);
    return this.users.create(dto);
  }

  public async update(id: string, dto: UpdateUserDto): Promise<User> {
    if (dto.email) {
      await this.assertEmailAvailable(dto.email, id);
    }
    const updated = await this.users.update(id, dto);
    if (!updated) {
      throw AppError.notFound(`User '${id}' not found`);
    }
    return updated;
  }

  public async delete(id: string): Promise<void> {
    const deleted = await this.users.delete(id);
    if (!deleted) {
      throw AppError.notFound(`User '${id}' not found`);
    }
  }

  private async assertEmailAvailable(email: string, excludeId?: string): Promise<void> {
    if (await this.users.existsByEmail(email, excludeId)) {
      throw AppError.conflict(`A user with email '${email}' already exists`);
    }
  }
}
