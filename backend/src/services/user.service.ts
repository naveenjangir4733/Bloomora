import type { User, CreateUserDto, UpdateUserDto, UserQueryDto } from '@/types/user.types';
import type { PaginationMeta } from '@/types/common.types';
import { AppError } from '@/utils/app-error.util';

export class UserService {
  // In-memory typed store demonstration
  private static readonly users: User[] = [
    {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      role: 'admin',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Bob Smith',
      email: 'bob@example.com',
      role: 'user',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  public findAll(query: UserQueryDto): Promise<{ users: User[]; meta: PaginationMeta }> {
    let filtered = [...UserService.users];

    if (query.search) {
      const searchLower = query.search.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(searchLower) ||
          u.email.toLowerCase().includes(searchLower),
      );
    }

    if (query.role) {
      filtered = filtered.filter((u) => u.role === query.role);
    }

    if (query.isActive !== undefined) {
      filtered = filtered.filter((u) => u.isActive === query.isActive);
    }

    const total = filtered.length;
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const pagedUsers = filtered.slice(startIndex, startIndex + limit);

    const meta: PaginationMeta = {
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };

    return Promise.resolve({ users: pagedUsers, meta });
  }

  public findById(id: string): Promise<User> {
    const user = UserService.users.find((u) => u.id === id);
    if (!user) {
      return Promise.reject(AppError.notFound(`User with id '${id}' not found`));
    }
    return Promise.resolve(user);
  }

  public create(dto: CreateUserDto): Promise<User> {
    const emailExists = UserService.users.some(
      (u) => u.email.toLowerCase() === dto.email.toLowerCase(),
    );
    if (emailExists) {
      return Promise.reject(AppError.conflict(`User with email '${dto.email}' already exists`));
    }

    const newUser: User = {
      id: (UserService.users.length + 1).toString(),
      name: dto.name,
      email: dto.email,
      role: dto.role,
      isActive: dto.isActive,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    UserService.users.push(newUser);
    return Promise.resolve(newUser);
  }

  public async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);

    if (dto.email && dto.email.toLowerCase() !== user.email.toLowerCase()) {
      const emailExists = UserService.users.some(
        (u) => u.email.toLowerCase() === dto.email?.toLowerCase(),
      );
      if (emailExists) {
        throw AppError.conflict(`User with email '${dto.email}' already exists`);
      }
    }

    const updatedUser: User = {
      ...user,
      ...dto,
      updatedAt: new Date().toISOString(),
    };

    const index = UserService.users.findIndex((u) => u.id === id);
    if (index !== -1) {
      UserService.users[index] = updatedUser;
    }

    return updatedUser;
  }

  public delete(id: string): Promise<void> {
    const index = UserService.users.findIndex((u) => u.id === id);
    if (index === -1) {
      return Promise.reject(AppError.notFound(`User with id '${id}' not found`));
    }
    UserService.users.splice(index, 1);
    return Promise.resolve();
  }
}
