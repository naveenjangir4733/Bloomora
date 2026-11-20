import type { Request, Response, NextFunction } from 'express';
import { UserService } from '@/services/user.service';
import { ApiResponseUtil } from '@/utils/api-response.util';
import { HttpStatus } from '@/constants/http-status.constant';
import type { CreateUserDto, UpdateUserDto, UserQueryDto } from '@/types/user.types';

export class UserController {
  private readonly userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public getUsers = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const query = req.query as unknown as UserQueryDto;
      const { users, meta } = await this.userService.findAll(query);
      res.json(ApiResponseUtil.paginated(users, meta));
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = req.params['id'] as string;
      const user = await this.userService.findById(id);
      res.json(ApiResponseUtil.success(user));
    } catch (error) {
      next(error);
    }
  };

  public createUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const body = req.body as CreateUserDto;
      const created = await this.userService.create(body);
      res
        .status(HttpStatus.CREATED)
        .json(ApiResponseUtil.success(created, 'User created successfully', HttpStatus.CREATED));
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = req.params['id'] as string;
      const body = req.body as UpdateUserDto;
      const updated = await this.userService.update(id, body);
      res.json(ApiResponseUtil.success(updated, 'User updated successfully'));
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = req.params['id'] as string;
      await this.userService.delete(id);
      res.json(ApiResponseUtil.success(null, 'User deleted successfully'));
    } catch (error) {
      next(error);
    }
  };
}
